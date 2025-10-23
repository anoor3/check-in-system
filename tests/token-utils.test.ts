import { describe, expect, it } from "vitest";
import { generateRotatingToken, parseRotatingToken, hashRotatingToken } from "@/lib/token";

describe("token utils", () => {
  it("generates and parses a token", () => {
    const token = generateRotatingToken({ sessionId: "00000000-0000-0000-0000-000000000000", ttlSeconds: 30, secret: "secret" });
    const parsed = parseRotatingToken(token, "secret");
    expect(parsed.sid).toBe("00000000-0000-0000-0000-000000000000");
  });

  it("hashes tokens deterministically", () => {
    const token = generateRotatingToken({ sessionId: "00000000-0000-0000-0000-000000000000", ttlSeconds: 30, secret: "secret" });
    const hashA = hashRotatingToken(token);
    const hashB = hashRotatingToken(token);
    expect(hashA).toEqual(hashB);
  });
});
