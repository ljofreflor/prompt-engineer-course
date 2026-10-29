/** Hash SHA-256 hex of teacher credentials (set at build from env). */
export function getTeacherAuthConfig() {
  const user = String(
    import.meta.env.TEACHER_USER ?? process.env.TEACHER_USER ?? "profesor",
  ).trim();
  const password = String(
    import.meta.env.TEACHER_PASSWORD ??
      process.env.TEACHER_PASSWORD ??
      "cambiar-esta-clave",
  ).trim();
  return { user, password };
}

export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
