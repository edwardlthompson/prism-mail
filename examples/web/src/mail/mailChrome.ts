import { t } from "../i18n";
import type { MailAccount, MessageSummary } from "./providers";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function rulesLabel(count: number): string {
  if (count === 0) return t("mail.rules.none");
  return t("mail.rules.some").replaceAll("{count}", String(count));
}

export function accountHtml(acc: MailAccount | null): string {
  if (!acc) {
    return `<button type="button" class="pm-connect" data-mail-connect data-testid="mail-connect">${t("mail.connect.cta")}</button>
      <p class="pm-connect-hint">${t("mail.connect.hint")}</p>`;
  }
  return `<p class="pm-account" data-testid="mail-account">${escapeHtml(acc.email)} (${escapeHtml(acc.provider)})</p>
    <button type="button" class="pm-disconnect" data-mail-disconnect data-testid="mail-disconnect">${t("mail.connect.disconnect")}</button>`;
}

export function readingHtml(
  selected: MessageSummary | null,
  sanitizedHtml: string,
  blockedImageCount: number,
  privacyHint: string,
  rulesHint: string,
): string {
  if (!selected) {
    return `<p class="pm-empty" data-testid="mail-reading-empty">${t("mail.reading.empty")}</p>
      <p class="pm-privacy-hint" data-testid="mail-privacy-hint">${privacyHint}</p>
      <p class="pm-rules-hint" data-testid="mail-rules-count">${rulesHint}</p>`;
  }
  const allow =
    blockedImageCount > 0
      ? `<button type="button" class="pm-allow-images" data-allow-images data-testid="mail-allow-images">${t("mail.privacy.allow_sender")}</button>`
      : "";
  return `<article class="pm-reading" data-testid="mail-reading">
      <h3 class="pm-reading-subject">${escapeHtml(selected.subject)}</h3>
      <p class="pm-reading-from">${escapeHtml(selected.from)}</p>
      <div class="pm-reading-body" data-testid="mail-reading-body">${sanitizedHtml}</div>
      <p class="pm-privacy-hint" data-testid="mail-privacy-hint">${privacyHint}</p>
      <p class="pm-blocked-count" data-testid="mail-blocked-images">${t("mail.privacy.blocked_count").replaceAll("{count}", String(blockedImageCount))}</p>
      ${allow}
      <p class="pm-rules-hint" data-testid="mail-rules-count">${rulesHint}</p>
    </article>`;
}

export function listHtml(
  status: "idle" | "loading" | "error" | "ready",
  account: MailAccount | null,
  messages: MessageSummary[],
  errorKey: string,
  selectedId: string | null,
): string {
  if (status === "loading") {
    return `<p class="pm-empty" data-testid="mail-list-loading">${t("mail.list.loading")}</p>`;
  }
  if (status === "error") {
    return `<p class="pm-empty" data-testid="mail-list-error">${t(errorKey || "mail.list.error")}</p>`;
  }
  if (!account) {
    return `<p class="pm-empty" data-testid="mail-list-empty">${t("mail.list.empty")}</p>`;
  }
  if (messages.length === 0) {
    return `<p class="pm-empty" data-testid="mail-list-empty">${t("mail.list.none")}</p>`;
  }
  const rows = messages
    .map((m) => {
      const current = selectedId === m.id ? ' aria-current="true"' : "";
      return `<li>
        <button type="button" class="pm-msg" data-msg-id="${escapeHtml(m.id)}"${current}>
          <span class="pm-msg-from">${escapeHtml(m.from)}</span>
          <span class="pm-msg-subject">${escapeHtml(m.subject)}</span>
          <span class="pm-msg-snippet">${escapeHtml(m.snippet)}</span>
        </button>
      </li>`;
    })
    .join("");
  return `<ul class="pm-msg-list" data-testid="mail-list">${rows}</ul>`;
}
