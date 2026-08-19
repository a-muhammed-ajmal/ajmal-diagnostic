// design-sync preview shim for `next/navigation`.
// Aliased in .design-sync/tsconfig.sync.json. Navigation and Footer call
// usePathname() only to mark the active nav link; outside a Next router that
// hook throws, which would blank both previews. Returning "/" renders the
// home-active state, which is a real state of the component.
export function usePathname(): string {
  return "/";
}

export function useRouter() {
  const noop = () => {};
  return { push: noop, replace: noop, back: noop, forward: noop, refresh: noop, prefetch: noop };
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}

export function useParams(): Record<string, string> {
  return {};
}

export function redirect(_url: string): never {
  throw new Error("redirect() is not available in design-system previews");
}

export function notFound(): never {
  throw new Error("notFound() is not available in design-system previews");
}
