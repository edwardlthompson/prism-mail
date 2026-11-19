import { describe, expect, it } from "vitest";
import { challengeS256, randomVerifier } from "./pkce";

describe("pkce", () => {
  it("creates url-safe verifier and challenge", async () => {
    const verifier = randomVerifier();
    expect(verifier.length).toBeGreaterThan(20);
    expect(verifier).not.toMatch(/[+/=]/);
    const challenge = await challengeS256(verifier);
    expect(challenge).not.toMatch(/[+/=]/);
    expect(challenge).not.toBe(verifier);
  });
});
