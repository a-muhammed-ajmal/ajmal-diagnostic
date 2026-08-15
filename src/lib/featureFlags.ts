/** The FDI flow remains unavailable unless explicitly enabled per environment. */
export function isFdiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FDI_ENABLED === 'true';
}
