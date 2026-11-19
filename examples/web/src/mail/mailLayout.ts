import { t } from "../i18n";
import { accountHtml, listHtml, readingHtml, rulesLabel } from "./mailChrome";
import type { ListStatus } from "./mailSession";
import type { MailAccount, MessageSummary } from "./providers";
import type { MailSettingsBundle } from "./schema";
import { settingsBarHtml } from "./settingsUi";

export function mailShellHtml(args: {
  bundle: MailSettingsBundle;
  account: MailAccount | null;
  messages: MessageSummary[];
  status: ListStatus;
  errorKey: string;
  selected: MessageSummary | null;
  bodyHtml: string;
  blockedImageCount: number;
  privacyHint: string;
  composing: boolean;
  draftNote: string;
  ruleCount: number;
}): string {
  const reading = args.composing
    ? ""
    : readingHtml(
        args.selected,
        args.bodyHtml,
        args.blockedImageCount,
        args.privacyHint,
        rulesLabel(args.ruleCount),
      );
  const note = args.draftNote
    ? `<p class="pm-draft-note" data-testid="mail-draft-note">${args.draftNote}</p>`
    : "";
  return `
    <section class="pm-mail" data-testid="home-status" data-mail-shell>
      <p class="gp-visually-hidden" data-testid="status">${t("mail.status.scaffold")}</p>
      ${settingsBarHtml(args.bundle)}
      <div class="pm-mail-panes" data-reading-mode="${args.bundle.display.readingMode}">
        <aside class="pm-pane pm-pane-folders" aria-label="${t("mail.folders.label")}">
          <h2 class="pm-pane-title">${t("mail.folders.title")}</h2>
          <ul class="pm-folder-list">
            <li><button type="button" class="pm-folder" data-folder="inbox" aria-current="true">${t("mail.folders.inbox")}</button></li>
            <li><button type="button" class="pm-folder" data-folder="sent">${t("mail.folders.sent")}</button></li>
          </ul>
          ${accountHtml(args.account)}
          <button type="button" class="pm-compose-open" data-mail-compose data-testid="mail-compose-open">${t("mail.compose.open")}</button>
          ${note}
        </aside>
        <section class="pm-pane pm-pane-list" aria-label="${t("mail.list.label")}">
          <h2 class="pm-pane-title">${t("mail.list.title")}</h2>
          ${listHtml(args.status, args.account, args.messages, args.errorKey, args.selected?.id ?? null)}
        </section>
        <section class="pm-pane pm-pane-reading" aria-label="${t("mail.reading.label")}" data-reading-mount>
          <h2 class="pm-pane-title">${t("mail.reading.title")}</h2>
          ${reading}
        </section>
      </div>
    </section>
  `;
}
