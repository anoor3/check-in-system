import crypto from "crypto";

interface GenerateTokenOptions {
  sessionId: string;
  secret?: string;
  ttlSeconds: number;
}

export function generateRotatingToken({ sessionId, secret = process.env.TOKEN_SIGNING_SECRET ?? "dev-secret", ttlSeconds }: GenerateTokenOptions) {
  const nonce = crypto.randomBytes(16).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${sessionId}.${exp}.${nonce}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return Buffer.from(JSON.stringify({ sid: sessionId, exp, nonce, sig })).toString("base64url");
}

export function parseRotatingToken(token: string, secret = process.env.TOKEN_SIGNING_SECRET ?? "dev-secret") {
  const decoded = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
  if (!decoded.sid || !decoded.exp || !decoded.sig) {
    throw new Error("Invalid token format");
  }
  const payload = `${decoded.sid}.${decoded.exp}.${decoded.nonce}`;
  const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const provided = Buffer.from(decoded.sig);
  const expected = Buffer.from(expectedSig);
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    throw new Error("Invalid signature");
  }
  if (decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }
  return decoded as { sid: string; exp: number; nonce: string; sig: string };
}

export function hashRotatingToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("base64url");
}
