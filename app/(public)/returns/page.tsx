import * as React from "react";
import Link from "next/link";

import {
  StaticPageShell,
  StaticSection,
  staticMetadata,
} from "@/components/layout/StaticPageShell";
import { T } from "@/components/i18n/T";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const metadata = staticMetadata(
  "Politique de retour",
  "Retour sous 14 jours sur tous les produits éligibles — conditions, procédure et remboursement."
);

export default function ReturnsPage() {
  return (
    <StaticPageShell
      eyebrow={<T k="info.returns.eyebrow" />}
      title={<T k="info.returns.title" />}
    >
      <StaticSection title={<T k="returns.window.title" />}>
        <p>
          <T k="returns.window.p1" />
        </p>
      </StaticSection>

      <StaticSection title={<T k="returns.conditions.title" />}>
        <ul className="list-disc space-y-2 ps-5">
          <li>
            <T k="returns.conditions.i1" />
          </li>
          <li>
            <T k="returns.conditions.i2" />
          </li>
          <li>
            <T k="returns.conditions.i3" />
          </li>
        </ul>
      </StaticSection>

      <StaticSection title={<T k="returns.procedure.title" />}>
        <ol className="list-decimal space-y-2 ps-5">
          <li>
            <T k="returns.procedure.i1" />
          </li>
          <li>
            <T k="returns.procedure.i2" />
          </li>
          <li>
            <T k="returns.procedure.i3" />
          </li>
          <li>
            <T k="returns.procedure.i4" />
          </li>
        </ol>
      </StaticSection>

      <StaticSection title={<T k="returns.refund.title" />}>
        <p>
          <T k="returns.refund.p1" />
        </p>
        <p>
          <T k="returns.refund.p2" />
        </p>
      </StaticSection>

      <StaticSection title={<T k="returns.fees.title" />}>
        <ul className="list-disc space-y-2 ps-5">
          <li>
            <strong>
              <T k="returns.fees.i1.bold" />
            </strong>{" "}
            <T k="returns.fees.i1.text" />
          </li>
          <li>
            <strong>
              <T k="returns.fees.i2.bold" />
            </strong>{" "}
            <T k="returns.fees.i2.text" />
          </li>
          <li>
            <strong>
              <T k="returns.fees.i3.bold" />
            </strong>{" "}
            <T k="returns.fees.i3.text" />
          </li>
        </ul>
      </StaticSection>

      <StaticSection title={<T k="returns.exceptions.title" />}>
        <p>
          <T k="returns.exceptions.lead" />
        </p>
        <ul className="list-disc space-y-2 ps-5">
          <li>
            <T k="returns.exceptions.i1" />
          </li>
          <li>
            <T k="returns.exceptions.i2" />
          </li>
          <li>
            <T k="returns.exceptions.i3" />
          </li>
          <li>
            <T k="returns.exceptions.i4" />
          </li>
        </ul>
      </StaticSection>

      <div className="rounded-lg bg-forest-900 p-6 text-center text-cream sm:p-8">
        <p className="font-display text-lg">
          <T k="returns.banner.quote" />
        </p>
        <Link
          href={routes.contact}
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "mt-5"
          )}
        >
          <T k="returns.banner.cta" />
        </Link>
      </div>
    </StaticPageShell>
  );
}
