import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { Commitments } from "@/components/sections/commitments";
import { Pillars } from "@/components/sections/pillars";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Statement } from "@/components/sections/statement";
import { ToolsBand } from "@/components/sections/tools-band";
import { Zones } from "@/components/sections/zones";
import { faq } from "@/lib/site";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <Statement />
      <Commitments />
      <Services />
      <Gallery />
      <Pillars />
      <Zones />
      <Pricing />
      <ToolsBand />
      <Process />
      <Faq />
      <Cta />
    </>
  );
}
