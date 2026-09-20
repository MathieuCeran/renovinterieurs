import Image from "next/image";

/**
 * Rideau d’ouverture : carte-titre (monogramme + accroche) puis deux
 * panneaux qui s’écartent sur le héros. Entièrement en CSS — purement
 * décoratif, sans interaction, joué une seule fois par session et
 * supprimé en mode animations réduites.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden>
      <div className="intro-panel intro-panel-top" />
      <div className="intro-panel intro-panel-bottom" />

      <div className="intro-card">
        <Image
          src="/brand/monogram.png"
          alt=""
          width={300}
          height={300}
          priority
          className="intro-mark size-16 sm:size-[5rem]"
        />

        <p className="mt-8 text-[clamp(1.85rem,5.4vw,4.3rem)] leading-[1.06] font-medium tracking-[-0.02em] text-paper">
          <span className="mask intro-line-1">
            <span className="block">L’art de faire renaître</span>
          </span>
          <span className="mask intro-line-2 mt-1 block">
            <span className="display-italic block text-[1.12em] leading-[1.04] text-shell">
              un intérieur
            </span>
          </span>
        </p>

        <span className="intro-rule mt-7 block" />

        <p className="intro-caption mt-6 text-[0.66rem] font-medium tracking-[0.4em] text-paper/55 uppercase sm:text-[0.72rem]">
          Renovintérieur — Paris &amp; Île-de-France
        </p>
      </div>
    </div>
  );
}
