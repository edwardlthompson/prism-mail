import { describe, expect, it } from "vitest";
import type { WhitelistRule } from "../schema";
import { sanitizeMailHtml, senderAllowed, stripTracking } from "./engine";

const baseRule = (partial: Partial<WhitelistRule>): WhitelistRule => ({
  id: "r",
  version: 1,
  deviceId: "d",
  updatedAt: "2026-01-01T00:00:00.000Z",
  tombstone: false,
  type: "image_allow",
  subjectKind: "sender",
  subject: "news@example.com",
  enabled: true,
  ...partial,
});

describe("privacy engine", () => {
  it("strips tracking params", () => {
    expect(stripTracking("https://ex.com/a?utm_source=x&id=1")).toBe("https://ex.com/a?id=1");
  });

  it("blocks remote images by default", () => {
    const result = sanitizeMailHtml({
      html: '<p>Hi<img src="https://track.example/pixel.gif" width="1" height="1" /></p>',
      blockRemoteImages: true,
      confirmExternalLinks: true,
      stripTrackingParams: true,
      rules: [],
    });
    expect(result.blockedImageCount).toBe(1);
    expect(result.html).toContain('data-pm-blocked="1"');
    expect(result.html).not.toContain("https://track.example");
  });

  it("honors image allow rules and link trust", () => {
    const rules = [
      baseRule({ type: "image_allow", subject: "news@example.com" }),
      baseRule({ id: "r2", type: "link_trust", subject: "news@example.com" }),
    ];
    expect(senderAllowed("News <news@example.com>", rules, "image_allow")).toBe(true);
    const result = sanitizeMailHtml(
      {
        html: '<a href="https://ex.com?utm_campaign=1">Go</a><img src="https://cdn.ex/a.png" />',
        blockRemoteImages: true,
        confirmExternalLinks: true,
        stripTrackingParams: true,
        rules,
      },
      "news@example.com",
    );
    expect(result.blockedImageCount).toBe(0);
    expect(result.rewrittenLinks).toBe(0);
    expect(result.html).toContain("https://ex.com/");
    expect(result.html).not.toContain("utm_campaign");
  });

  it("marks external links for confirmation when untrusted", () => {
    const result = sanitizeMailHtml({
      html: '<a href="https://phish.example/login">Click</a>',
      blockRemoteImages: true,
      confirmExternalLinks: true,
      stripTrackingParams: true,
      rules: [],
    });
    expect(result.rewrittenLinks).toBe(1);
    expect(result.html).toContain("data-pm-confirm");
  });
});
