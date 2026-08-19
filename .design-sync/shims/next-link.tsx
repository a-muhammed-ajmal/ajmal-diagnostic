// design-sync preview shim for `next/link`.
// Aliased in .design-sync/tsconfig.sync.json so the DS bundle has no dependency
// on Next's router context. Link's only job in this DS is rendering an anchor
// with the DS classes (see src/components/ui/Button.tsx), so an <a> is a
// faithful stand-in — not a reimplementation of any DS component.
import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string };
  children?: ReactNode;
  // Next-only props that have no meaning outside the router — accepted and dropped.
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
};

export default function Link({
  href,
  children,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  shallow: _shallow,
  passHref: _passHref,
  legacyBehavior: _legacyBehavior,
  ...rest
}: LinkProps) {
  const resolved = typeof href === "string" ? href : (href?.pathname ?? "#");
  return (
    <a href={resolved} {...rest}>
      {children}
    </a>
  );
}
