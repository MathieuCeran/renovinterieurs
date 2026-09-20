"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PhoneIcon } from "@/components/ui/kit";
import { site } from "@/lib/site";

const WhatsAppIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
    fill="currentColor"
  >
    <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.17-1.35a9.93 9.93 0 0 0 4.87 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2Zm0 18.13h-.01a8.26 8.26 0 0 1-4.21-1.15l-.3-.18-3.07.8.82-2.99-.2-.31a8.24 8.24 0 0 1-1.26-4.39c0-4.56 3.71-8.27 8.28-8.27 2.21 0 4.29.86 5.85 2.43a8.22 8.22 0 0 1 2.42 5.85c0 4.57-3.71 8.28-8.32 8.28Zm4.54-6.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.13-.56.12-.17.25-.64.81-.79.98-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.86-.87 2.09s.9 2.43 1.02 2.6c.12.16 1.76 2.69 4.26 3.77.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
  </svg>
);

export function ActionBar() {
  const [show, setShow] = useState(false);

  /**
   * Visible une fois le héros dépassé. Sur une page sans héros, le
   * sentinelle est le haut du document : la barre apparaît dès le
   * premier défilement.
   */
  useEffect(() => {
    const target =
      document.querySelector<HTMLElement>("[data-hero]") ??
      document.getElementById("contenu");
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { rootMargin: "-110px 0px 0px 0px", threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Mobile */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] lg:hidden ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <a
          href={site.phoneHref}
          className="flex flex-col items-center gap-1 py-3 text-[0.68rem] text-ink"
        >
          <PhoneIcon className="size-5" />
          Appeler
        </a>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 border-x border-line py-3 text-[0.68rem] text-ink"
        >
          <WhatsAppIcon />
          WhatsApp
        </a>
        <Link
          href="#devis"
          className="flex flex-col items-center gap-1 bg-terra py-3 text-[0.68rem] font-medium text-paper"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5">
            <path
              d="M5 3.5h9.5L19 8v12.5H5V3.5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M14 3.5V8h5M8 13h8M8 16.5h5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Devis
        </Link>
      </div>

      {/* Desktop */}
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nous écrire sur WhatsApp"
        className={`fixed right-7 bottom-7 z-50 hidden size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_-12px_rgba(37,211,102,0.5)] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-108 lg:flex ${
          show
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-0 opacity-0"
        }`}
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}
