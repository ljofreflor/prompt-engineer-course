/** Join a path with Astro BASE_URL (with or without trailing slash). */
export function asset(path: string): string {
  const base = String(import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const clean = path.replace(/^\//, "");
  return `${base}/${clean}`;
}
