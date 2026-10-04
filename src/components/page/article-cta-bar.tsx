"use client";

import { useEffect, useState } from "react";

import { ArrowRight, PhoneIcon } from "@/components/ui/kit";
import { site } from "@/lib/site";

/**
 * Barre devis des articles, fixée en bas de l'écran sur grand écran (le
 * mobile a déjà la barre d'action du site). Visible une fois le héros
 * dépassé, masquée quand le formulaire #devis est à l'écran.
 */
export function ArticleCtaBar() {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const form = document.getElementById("devis");
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const io = new IntersectionObserver(
        ([e]) => setPastHero(!e.isIntersecting),
        { rootMargin: "-110px 0px 0px 0px" },
      );
      io.observe(hero);
      observers.push(io);
    }
    if (form) {
      const io = new IntersectionObserver(([e]) =>
        setFormVisible(e.isIntersecting),
      );
      io.observe(form);
      observers.push(io);
    }
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  const show = pastHero && !formVisible;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-6 z-40 hidden justify-center px-28 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] lg:flex ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center gap-5 rounded-full bg-ink/95 py-2 pr-2 pl-6 text-paper shadow-[0_24px_60px_-20px_rgba(22,18,15,0.55)] backdrop-blur-xl">
        <p className="text-[0.9rem] whitespace-nowrap">
          Un projet ? Devis détaillé{" "}
          <span className="display-italic text-gold-light">sous 48 h</span>
        </p>
        <a
          href={site.phoneHref}
          tabIndex={show ? 0 : -1}
          className="flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 text-[0.84rem] whitespace-nowrap text-paper/85 transition-colors hover:border-paper/50"
        >
          <PhoneIcon className="size-3.5" />
          {site.phoneDisplay}
        </a>
        <a
          href="#devis"
          tabIndex={show ? 0 : -1}
          className="flex items-center gap-3 rounded-full bg-terra py-1.5 pr-1.5 pl-5 text-[0.88rem] font-medium whitespace-nowrap transition-colors hover:bg-terra-deep"
        >
          Obtenir un devis
          <span className="flex size-7 items-center justify-center rounded-full bg-paper text-ink">
            <ArrowRight className="size-3" />
          </span>
        </a>
      </div>
    </div>
  );
}
