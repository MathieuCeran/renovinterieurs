import type { Block, Page, Section } from "@/lib/content";

/* ------------------------------------------------------------------ */
/*  WhatsWrong : les changements d'une page, texte par texte           */
/*                                                                     */
/*  Une page publiée depuis WhatsWrong arrive en changements : textes   */
/*  réécrits, textes retirés, blocs ajoutés à côté d'un texte ou d'une  */
/*  section. Ils s'appliquent aux données de la page (le JSON) avant    */
/*  l'affichage : les composants du site restent les mêmes, le design   */
/*  ne bouge pas. Les textes écrits dans les composants passent par     */
/*  `wwText`. Chaque texte se retrouve par sa clé (`wwKey`).            */
/* ------------------------------------------------------------------ */

type WwBlock =
  | { kind: "heading"; level: number; text: string }
  | { kind: "text"; html: string };

export type WwChanges = {
  replace: { match: string; text: string; html: string }[];
  remove: { match: string; text: string }[];
  insert: {
    match: string;
    text: string;
    place: "before" | "after" | "end";
    blocks: WwBlock[];
  }[];
};

/** La clé d'un texte : la même fonction que WhatsWrong, à l'identique.
 *  Sans espace : un libellé collé à son détail garde la même clé. */
function wwKey(value: string): string {
  return String(value)
    .replace(/\]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/(\d)\s*[x×]\s*(?=\d)/g, "$1 ")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function decode(text: string): string {
  return text
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** Le HTML d'un texte (liens, gras) dans la syntaxe du site : [texte](/url). */
function toInline(html: string): string {
  const links = html.replace(
    /<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href: string, text: string) => {
      const label = text.replace(/<[^>]+>/g, "").trim();
      // Un lien vers le site lui-même reste relatif.
      const local = href.replace(/^https?:\/\/(www\.)?renovinterieurs\.fr/i, "");
      return `[${label}](${local || "/"})`;
    },
  );
  return decode(links.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

/** Les blocs ajoutés, dans les blocs du site : intertitre, paragraphes,
 *  liste. */
function toBlocks(blocks: WwBlock[]): Block[] {
  return blocks.flatMap((block): Block[] => {
    if (block.kind === "heading") {
      return [{ t: "h3", v: decode(block.text) }];
    }
    const out: Block[] = [];
    for (const m of block.html.matchAll(
      /<(p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi,
    )) {
      if (m[1].toLowerCase() === "p") {
        out.push({ t: "p", v: toInline(m[2]) });
      } else {
        const items = [...m[2].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map(
          (li) => toInline(li[1]),
        );
        out.push({ t: "ul", items });
      }
    }
    return out.length > 0 ? out : [{ t: "p", v: toInline(block.html) }];
  });
}

/** De nouvelles sections : une par intertitre H2 en tête. */
function toSections(blocks: WwBlock[]): Section[] {
  const sections: Section[] = [];
  for (const block of blocks) {
    if (block.kind === "heading" && block.level === 2) {
      sections.push({ title: decode(block.text), blocks: [] });
    } else if (sections.length === 0) {
      sections.push({ title: "", blocks: toBlocks([block]) });
    } else {
      sections[sections.length - 1].blocks.push(...toBlocks([block]));
    }
  }
  return sections;
}

const REMOVED = Symbol("removed");

/** Un texte du site à la lumière des changements : réécrit, retiré
 *  (null), ou tel quel. */
export function wwText(
  changes: WwChanges | null,
): (text: string) => string | null {
  if (!changes) return (text) => text;
  const replaced = new Map(changes.replace.map((c) => [wwKey(c.match), c]));
  const removed = new Set(changes.remove.map((c) => wwKey(c.match)));
  return (text) => {
    const key = wwKey(text);
    if (removed.has(key)) return null;
    const change = replaced.get(key);
    if (!change) return text;
    // Un texte sans lien garde la ponctuation d'Eli telle quelle.
    return /\[[^\]]+\]\(/.test(text) || /<a\b/i.test(change.html)
      ? toInline(change.html)
      : decode(change.text);
  };
}

/* Remplace et retire dans toutes les chaînes des données : un élément de
 * liste dont tout le texte est retiré disparaît. */
function mapTexts(value: unknown, text: (t: string) => string | null): unknown {
  if (typeof value === "string") {
    return text(value) ?? REMOVED;
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => mapTexts(item, text))
      .filter((item) => item !== REMOVED);
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value).map(([k, v]) => {
      // Les adresses, images et types de bloc ne sont pas du texte.
      if (["href", "src", "t", "kind", "parent", "hero"].includes(k)) {
        return [k, v] as const;
      }
      return [k, mapTexts(v, text)] as const;
    });
    const texts = entries.filter(([, v]) => typeof v === "string" || v === REMOVED);
    // Un élément dont tout le texte est retiré (et qui ne porte rien
    // d'autre) disparaît ; une section garde ses blocs.
    const holds = entries.some(([, v]) => Array.isArray(v) && v.length > 0);
    if (texts.length > 0 && !holds && texts.every(([, v]) => v === REMOVED)) {
      return REMOVED;
    }
    return Object.fromEntries(
      entries.map(([k, v]) => [k, v === REMOVED ? "" : v]),
    );
  }
  return value;
}

function blockTexts(block: Block): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) {
        if (!["href", "src", "t"].includes(k)) walk(x);
      }
    }
  };
  walk(block);
  return out;
}

/** Les ajouts : à côté d'un texte (paragraphe, intro) ou d'une section. */
function insert(page: Page, changes: WwChanges, missed: string[]): Page {
  const sections = page.sections.map((s) => ({ ...s, blocks: [...s.blocks] }));
  const intro = [...page.intro];
  for (const add of changes.insert) {
    const match = wwKey(add.match);
    const at = sections.findIndex((s) => wwKey(s.title) === match);
    if (at !== -1) {
      if (add.place === "end") {
        sections[at].blocks.push(...toBlocks(add.blocks));
      } else {
        sections.splice(
          add.place === "before" ? at : at + 1,
          0,
          ...toSections(add.blocks),
        );
      }
      continue;
    }
    const inIntro = intro.findIndex((t) => wwKey(t) === match);
    if (inIntro !== -1) {
      const blocks = toBlocks(add.blocks);
      intro.splice(
        inIntro + 1,
        0,
        ...blocks.flatMap((b) => (b.t === "p" ? [b.v] : [])),
      );
      // Une liste ou un intertitre ouvrent la première section.
      const rest = blocks.filter((b) => b.t !== "p");
      if (rest.length > 0 && sections[0]) sections[0].blocks.unshift(...rest);
      continue;
    }
    let placed = false;
    for (const section of sections) {
      const index = section.blocks.findIndex((b) =>
        blockTexts(b).some((t) => wwKey(t) === match),
      );
      if (index === -1) continue;
      // Après le bloc entier (un paragraphe, mais aussi des cartes, une
      // liste, un tableau) : jamais dedans.
      section.blocks.splice(index + 1, 0, ...toBlocks(add.blocks));
      placed = true;
      break;
    }
    if (!placed) missed.push(add.text);
  }
  return { ...page, intro, sections };
}

/**
 * La page avec les changements de WhatsWrong : ajouts posés d'abord (leurs
 * ancres sont les textes en ligne), puis textes réécrits et retirés.
 */
export function applyWwChanges(page: Page, changes: WwChanges): Page {
  const missed: string[] = [];
  const withInserts = insert(page, changes, missed);
  const text = wwText(changes);
  const next = mapTexts(withInserts, text) as Page;
  if (process.env.NODE_ENV !== "production" && missed.length > 0) {
    console.warn("[whatswrong] ancres introuvables :", missed);
  }
  return next;
}
