import { render } from "dom-serializer";
import {
  append,
  findAll,
  prepend,
  removeElement,
  replaceElement,
  textContent,
} from "domutils";
import { parseDocument } from "htmlparser2";

import { wwKey, type WwBlock, type WwChanges } from "@/lib/whatswrong-changes";

type Element = ReturnType<typeof findAll>[number];

// Les éléments qui portent un texte de l'article.
const TEXTS = new Set([
  "p", "li", "h1", "h2", "h3", "h4", "h5", "h6",
  "td", "th", "blockquote", "figcaption", "dt", "dd", "summary",
]);

const fragment = (html: string) => parseDocument(html).children;

function blocksHtml(blocks: WwBlock[]): string {
  return blocks
    .map((block) =>
      block.kind === "heading"
        ? `<h${block.level}>${block.text.replace(/</g, "&lt;")}</h${block.level}>`
        : block.html,
    )
    .join("");
}

/* Le plus profond élément de texte qui porte cette clé. */
function lookup(elements: Element[]): Map<string, Element[]> {
  const byKey = new Map<string, Element[]>();
  for (const element of elements) {
    const key = wwKey(textContent(element));
    if (key === "") continue;
    byKey.set(key, [...(byKey.get(key) ?? []), element]);
  }
  for (const [key, found] of byKey) {
    byKey.set(key, found.filter((el) => !found.some((other) => other !== el && isInside(other, el))));
  }
  return byKey;
}

function isInside(node: Element, ancestor: Element): boolean {
  for (let at = node.parent; at; at = at.parent) if (at === ancestor) return true;
  return false;
}

/* La fin de la section d'un intertitre : avant le prochain de même niveau. */
function sectionEnd(heading: Element): Element | null {
  const level = Number(heading.name.slice(1));
  for (let at = heading.next; at; at = at.next) {
    const name = (at as Element).name;
    if (name && /^h[1-6]$/.test(name) && Number(name.slice(1)) <= level) return at as Element;
  }
  return null;
}

/**
 * Les changements d'Eli posés dans le HTML d'un article, texte par texte :
 * réécrits à leur place, retirés, blocs ajoutés à côté. Toutes les clés se
 * lisent sur le texte d'origine, puis tout s'applique d'un coup. Le reste
 * de l'article (sa mise en forme, ses blocs) ne bouge pas.
 */
export function applyHtmlChanges(html: string, changes: WwChanges): string {
  const doc = parseDocument(html);
  const byKey = lookup(
    findAll((el) => TEXTS.has(el.name), doc.children) as Element[],
  );
  const at = (match: string) => byKey.get(wwKey(match)) ?? [];
  const removed = changes.remove.flatMap((r) => at(r.match));
  const replaced = changes.replace.flatMap((r) => at(r.match).map((el) => ({ el, r })));
  const inserted = changes.insert.flatMap((i) => at(i.match).map((el) => ({ el, i })));
  for (const { el, i } of inserted) {
    const nodes = fragment(blocksHtml(i.blocks));
    const heading = /^h[1-6]$/.test(el.name);
    if (i.place === "before") {
      nodes.forEach((node) => prepend(el, node));
    } else if (heading && (i.place === "end" || i.place === "after")) {
      const end = sectionEnd(el);
      const last = (el.parent?.children.at(-1) as Element | undefined) ?? el;
      if (end) nodes.forEach((node) => prepend(end, node));
      else nodes.reverse().forEach((node) => append(last, node));
    } else {
      nodes.reverse().forEach((node) => append(el, node));
    }
  }
  for (const { el, r } of replaced) {
    const heading = /^h[1-6]$/.test(el.name);
    const next = fragment(`<${el.name}>${heading ? r.text.replace(/</g, "&lt;") : r.html}</${el.name}>`)[0] as Element;
    next.attribs = el.attribs;
    replaceElement(el, next);
  }
  removed.forEach((el) => removeElement(el));
  return render(doc);
}
