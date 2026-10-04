import { revalidatePath, revalidateTag } from "next/cache";

import { getPage } from "@/lib/content";
import { WW_TAG, syncWhatsWrong } from "@/lib/whatswrong";

/**
 * Appelé chaque heure par le cron Vercel (voir vercel.json), qui envoie
 * « Authorization: Bearer $CRON_SECRET ». Peut aussi être lancé à la
 * main avec ?secret=… pour tester.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const given =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    new URL(req.url).searchParams.get("secret");
  if (!secret || given !== secret) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const report = await syncWhatsWrong((path) => getPage(path) !== null);

    if (report.published.length > 0) {
      // Les nouveaux articles apparaissent tout de suite : index, sitemap, pages.
      revalidateTag(WW_TAG, { expire: 0 });
      revalidatePath("/conseils");
      revalidatePath("/sitemap.xml");
      for (const { url } of report.published)
        revalidatePath(new URL(url).pathname);
    }

    return Response.json(report);
  } catch (err) {
    console.error("[whatswrong] sync", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 502 },
    );
  }
}
