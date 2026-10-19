import type { Metadata } from "next";
import {
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { wwKey, type WwBlock, type WwChanges } from "@/lib/whatswrong-changes";
import { publishedPageVersion } from "@/lib/whatswrong-pages";

/* ============================================================================
   Les pages écrites à la main (outils, FAQ, contact, réalisations…) avec
   leur version publiée depuis WhatsWrong : les changements posés dans
   l'arbre de la page avant son rendu — props des composants comme JSX —,
   le design ne bouge jamais. Les pages du modèle générique ([...slug])
   reçoivent les leurs dans leurs données (`applyWwChanges`).
   ============================================================================ */

/* Les props qui ne sont pas du texte affiché. */
const NOT_TEXT = new Set([
  "href",
  "src",
  "className",
  "id",
  "style",
  "image",
  "cadrage",
  "fond",
  "variant",
  "colonnes",
  "chemin",
  "type",
  "rel",
  "target",
  "key",
  "height",
  "tone",
  "size",
]);
// Les éléments qui font partie d'une phrase (un lien, du gras).
const INLINE = new Set(["a", "strong", "em", "b", "i", "span", "br", "small", "abbr"]);

const REMOVED = Symbol("removed");

/* Un composant client (marqué « use client ») : on ne l'exécute jamais ici. */
function isClientReference(type: unknown): boolean {
  return (type as { $$typeof?: symbol }).$$typeof === Symbol.for("react.client.reference");
}

/** Le texte visible d'un nœud React non rendu. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/* Une phrase : du texte et des éléments en ligne seulement (un lien, du
   gras) — elle se retrouve entière par sa clé. */
function isPhrase(node: ReactNode): boolean {
  if (typeof node === "string" || typeof node === "number" || node == null || typeof node === "boolean") return true;
  if (Array.isArray(node)) return node.every(isPhrase);
  if (!isValidElement<{ children?: ReactNode }>(node)) return false;
  const inline = typeof node.type !== "string" || INLINE.has(node.type);
  return inline && isPhrase(node.props.children);
}

function html(value: string): ReactNode {
  return <span dangerouslySetInnerHTML={{ __html: value }} />;
}

function newBlocks(blocks: WwBlock[]): ReactNode {
  return blocks.map((block, index) =>
    block.kind === "heading" ? (
      <h3 key={index}>{block.text}</h3>
    ) : (
      <div key={index} className="ww-prose mt-4 max-w-3xl text-[1rem] leading-relaxed [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3" dangerouslySetInnerHTML={{ __html: block.html }} />
    ),
  );
}

/* Une nouvelle section (un H2 en tête), au dessin des autres. */
function newSections(blocks: WwBlock[]): ReactNode {
  const groups: WwBlock[][] = [];
  for (const block of blocks) {
    if ((block.kind === "heading" && block.level === 2) || groups.length === 0) groups.push([block]);
    else groups[groups.length - 1].push(block);
  }
  return groups.map((group, index) => {
    const [first, ...rest] = group;
    return first.kind === "heading" && first.level === 2 ? (
      <section key={`ww-${index}`} className="container-x py-12 lg:py-16">
        <div className="border-t border-line pt-8">
          <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-medium tracking-[-0.01em]">
            {first.text}
          </h2>
          <div className="mt-6 max-w-3xl">{newBlocks(rest)}</div>
        </div>
      </section>
    ) : (
      <Fragment key={`ww-${index}`}>{newBlocks(group)}</Fragment>
    );
  });
}

class Overlay {
  private replaced: Map<string, WwChanges["replace"][number]>;
  private removed: Set<string>;
  private inserts: Map<string, WwChanges["insert"]>;
  readonly missed = new Set<string>();

  constructor(changes: WwChanges) {
    this.replaced = new Map(changes.replace.map((c) => [wwKey(c.match), c]));
    this.removed = new Set(changes.remove.map((c) => wwKey(c.match)));
    this.inserts = new Map();
    for (const insert of changes.insert) {
      const key = wwKey(insert.match);
      this.inserts.set(key, [...(this.inserts.get(key) ?? []), insert]);
      this.missed.add(key);
    }
  }

  /** Une chaîne d'une prop : réécrite (texte seul), retirée, ou telle quelle. */
  private string(value: string): string | typeof REMOVED {
    const key = wwKey(value);
    if (this.removed.has(key)) return REMOVED;
    return this.replaced.get(key)?.text ?? value;
  }

  /** Toutes les données d'une prop : chaînes, listes, objets d'items. */
  private data(value: unknown): unknown {
    if (typeof value === "string") return this.string(value);
    if (Array.isArray(value)) {
      return value.map((item) => this.data(item)).filter((item) => item !== REMOVED);
    }
    if (isValidElement(value)) return this.node(value);
    if (value && typeof value === "object") {
      const entries = Object.entries(value).map(([k, v]) => [k, NOT_TEXT.has(k) ? v : this.data(v)] as const);
      const texts = entries.filter(([, v]) => typeof v === "string" || v === REMOVED);
      if (texts.length > 0 && texts.every(([, v]) => v === REMOVED)) return REMOVED;
      return Object.fromEntries(entries.map(([k, v]) => [k, v === REMOVED ? "" : v]));
    }
    return value;
  }

  /** Les ajouts ancrés sur l'un des textes de cet élément. */
  private anchored(element: ReactElement<Record<string, unknown>>): WwChanges["insert"] {
    const keys = new Set<string>();
    if (typeof element.type === "string" && isPhrase(element.props.children as ReactNode)) {
      keys.add(wwKey(textOf(element)));
    }
    for (const [name, value] of Object.entries(element.props)) {
      if (!NOT_TEXT.has(name) && typeof value === "string") keys.add(wwKey(value));
    }
    return [...keys].flatMap((key) => {
      const found = this.inserts.get(key) ?? [];
      if (found.length > 0) this.missed.delete(key);
      return found;
    });
  }

  node(node: ReactNode): ReactNode {
    if (typeof node === "string") {
      const value = this.string(node);
      if (value === REMOVED) return null;
      const change = this.replaced.get(wwKey(node));
      return change ? html(change.html) : value;
    }
    if (Array.isArray(node)) return node.map((child, index) => <Fragment key={index}>{this.node(child)}</Fragment>);
    if (!isValidElement<Record<string, unknown>>(node)) return node;
    const element = node;
    // Une phrase du JSX (un paragraphe avec un lien) : remplacée entière.
    if (typeof element.type === "string" && !INLINE.has(element.type) && isPhrase(element.props.children as ReactNode)) {
      const key = wwKey(textOf(element));
      if (this.removed.has(key)) return null;
      const change = this.replaced.get(key);
      if (change) return this.around(element, cloneElement(element, {}, html(change.html)));
    }
    // Un texte retiré d'une prop (une accroche, un chapô) : la prop part,
    // le composant reste.
    const props = Object.fromEntries(
      Object.entries(element.props).map(([name, value]) => {
        if (name === "children") return [name, this.node(value as ReactNode)];
        const next = NOT_TEXT.has(name) ? value : this.data(value);
        return [name, next === REMOVED ? undefined : next];
      }),
    );
    // Un composant serveur du site (une fonction, pas un composant client) :
    // exécuté, pour atteindre aussi les textes écrits en lui. Asynchrone
    // ou client, il reste tel quel.
    if (typeof element.type === "function" && !isClientReference(element.type)) {
      const output = (element.type as (p: Record<string, unknown>) => ReactNode)(props);
      if (!(output instanceof Promise)) {
        return this.around(element, <>{this.node(output)}</>);
      }
    }
    return this.around(element, cloneElement(element, props));
  }

  /* L'élément et ce qui s'ajoute avant, après ou à la fin de lui. */
  private around(original: ReactElement<Record<string, unknown>>, element: ReactElement): ReactNode {
    const inserts = this.anchored(original);
    if (inserts.length === 0) return element;
    const before = inserts.filter((i) => i.place === "before").flatMap((i) => i.blocks);
    const after = inserts.filter((i) => i.place === "after").flatMap((i) => i.blocks);
    const end = inserts.filter((i) => i.place === "end").flatMap((i) => i.blocks);
    const withEnd =
      end.length === 0
        ? element
        : cloneElement(element, {}, (element.props as { children?: ReactNode }).children, newBlocks(end));
    return (
      <>
        {before.length > 0 && newSections(before)}
        {withEnd}
        {after.length > 0 && newSections(after)}
      </>
    );
  }
}

/**
 * Une page écrite à la main avec sa version publiée depuis WhatsWrong :
 * `export default withWw("/chemin", Page)`. Une page fusionnée dans une
 * autre redirige (301) vers elle.
 */
export function withWw<P extends object>(
  path: string,
  Page: (props: P) => ReactNode | Promise<ReactNode>,
) {
  return async function WhatsWrongPage(props: P) {
    const changes = (await publishedPageVersion(path))?.changes ?? null;
    const tree = await Page(props);
    if (changes === null) return tree;
    const overlay = new Overlay(changes);
    const out = overlay.node(tree);
    if (process.env.NODE_ENV !== "production" && overlay.missed.size > 0) {
      console.warn(`[whatswrong] ${path} : ancres introuvables`, [...overlay.missed]);
    }
    return out;
  };
}

/** Le titre et la description publiés depuis WhatsWrong, sinon ceux du site. */
export async function wwMetadata(path: string, metadata: Metadata): Promise<Metadata> {
  const version = await publishedPageVersion(path);
  if (version === null) return metadata;
  return {
    ...metadata,
    title: version.title || metadata.title,
    description: version.description || metadata.description,
    openGraph: metadata.openGraph && {
      ...metadata.openGraph,
      title: version.title || metadata.openGraph.title,
      description: version.description || metadata.openGraph.description,
    },
  };
}
