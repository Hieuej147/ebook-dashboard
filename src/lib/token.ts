
export function decodeJwtExpiry(token: string): number | null {
  try {
    const base64Payload = token.split(".")[1];
    const decoded = Buffer.from(base64Payload, "base64url").toString("utf8");
    const payload = JSON.parse(decoded);
    return payload.exp * 1000;
  } catch {
    return null;
  }
}
