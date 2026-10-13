/** ISO 3166-1 alpha-2 → flag emoji */
export function countryCodeToFlag(code: string): string {
  const cc = code.toUpperCase();
  if (cc.length !== 2) return "🌍";
  return String.fromCodePoint(
    ...[...cc].map((c) => 0x1_1a5 + c.charCodeAt(0) - 65),
  );
}
