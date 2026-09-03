/**
 * Prefix a site-relative path with Astro's configured base URL.
 * Use this for every internal href/src that points into /public or a route.
 * External URLs (http/https/protocol-relative) pass through unchanged.
 */
export function withBase(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path)) return path;
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
