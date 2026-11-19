import type { WhitelistRule } from "../schema";

export type SanitizeInput = {
  html: string;
  blockRemoteImages: boolean;
  confirmExternalLinks: boolean;
  stripTrackingParams: boolean;
  rules: WhitelistRule[];
};

export type SanitizeResult = {
  html: string;
  blockedImageCount: number;
  rewrittenLinks: number;
};

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
]);

export function senderAllowed(
  from: string,
  rules: WhitelistRule[],
  type: WhitelistRule["type"],
): boolean {
  const email = from.toLowerCase();
  const domain = email.includes("@") ? (email.split("@").pop() ?? "") : "";
  return rules.some((r) => {
    if (!r.enabled || r.tombstone || r.type !== type) return false;
    const sub = r.subject.toLowerCase();
    if (r.subjectKind === "sender") return email.includes(sub);
    return domain === sub || domain.endsWith(`.${sub}`);
  });
}

export function stripTracking(url: string): string {
  try {
    const u = new URL(url);
    for (const key of [...u.searchParams.keys()]) {
      if (TRACKING_PARAMS.has(key.toLowerCase())) u.searchParams.delete(key);
    }
    return u.toString();
  } catch {
    return url;
  }
}

/** Sanitize HTML mail for the reading pane (DOMParser). */
export function sanitizeMailHtml(input: SanitizeInput, from = ""): SanitizeResult {
  const doc = new DOMParser().parseFromString(input.html, "text/html");
  let blockedImageCount = 0;
  let rewrittenLinks = 0;
  const allowImages = !input.blockRemoteImages || senderAllowed(from, input.rules, "image_allow");
  const trustLinks = senderAllowed(from, input.rules, "link_trust");

  for (const img of [...doc.querySelectorAll("img")]) {
    const src = img.getAttribute("src") ?? "";
    const w = Number(img.getAttribute("width") || 0);
    const h = Number(img.getAttribute("height") || 0);
    const remote = /^(https?:|\/\/)/i.test(src);
    const isPixel = (w > 0 && w <= 2) || (h > 0 && h <= 2) || /pixel|track|beacon/i.test(src);
    if (isPixel || (remote && !allowImages)) {
      img.removeAttribute("src");
      img.setAttribute("data-pm-blocked", "1");
      img.setAttribute("alt", img.getAttribute("alt") || "blocked");
      blockedImageCount += 1;
    }
  }

  for (const a of [...doc.querySelectorAll("a[href]")]) {
    let href = a.getAttribute("href") ?? "";
    if (input.stripTrackingParams) href = stripTracking(href);
    a.setAttribute("href", href);
    if (input.confirmExternalLinks && !trustLinks && /^https?:/i.test(href)) {
      a.setAttribute("data-pm-confirm", href);
      a.setAttribute("href", "#");
      rewrittenLinks += 1;
    }
  }

  // Drop scripts/styles that could exfiltrate.
  for (const el of [...doc.querySelectorAll("script,iframe,object,embed")]) el.remove();

  return {
    html: doc.body?.innerHTML ?? "",
    blockedImageCount,
    rewrittenLinks,
  };
}
