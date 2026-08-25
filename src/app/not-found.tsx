import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";

/**
 * The 404 fallback. WEB §4 registers it below the route register as a
 * fallback, not a route — so it is noindex, absent from the sitemap, and
 * absent from navigation.
 *
 * It is not a landing surface: no offer, no lead capture, no claim, and no
 * invented reason for the miss. Two ways forward and nothing else.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      tone="tint"
      spokeArc
      title="This page isn&rsquo;t here."
      lead="The link may be out of date, or the page may have moved."
      actions={
        <>
          <Button href="/" variant="quiet">
            Back to home
          </Button>
          <Button href="/diagnostic">
            Start the Business Health Check
            {/* WEB §5 fixes the label including the arrow. The icon is decorative,
                so the glyph is restated here for the accessible name only. */}
            <span className="sr-only"> →</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </>
      }
    />
  );
}
