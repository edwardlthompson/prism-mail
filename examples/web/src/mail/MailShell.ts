import { t } from "../i18n";
import { createMailStore } from "./store";

export type MailShellOptions = {
  store?: ReturnType<typeof createMailStore>;
};

function rulesLabel(count: number): string {
  if (count === 0) return t("mail.rules.none");
  return t("mail.rules.some").replaceAll("{count}", String(count));
}

/** Three-pane mail chrome skeleton (Sprint 0). No live providers yet. */
export function createMailShell(mount: HTMLElement, options: MailShellOptions = {}): void {
  const store = options.store ?? createMailStore();
  const bundle = store.load();
  const ruleCount = store.listActiveRules().length;
  const imagesBlocked = bundle.privacy.blockRemoteImages;

  mount.innerHTML = `
    <section class="pm-mail" data-testid="home-status" data-mail-shell>
      <p class="gp-visually-hidden" data-testid="status">${t("mail.status.scaffold")}</p>
      <div class="pm-mail-panes" data-reading-mode="${bundle.display.readingMode}">
        <aside class="pm-pane pm-pane-folders" aria-label="${t("mail.folders.label")}">
          <h2 class="pm-pane-title">${t("mail.folders.title")}</h2>
          <ul class="pm-folder-list">
            <li><button type="button" class="pm-folder" data-folder="inbox" aria-current="true">${t("mail.folders.inbox")}</button></li>
            <li><button type="button" class="pm-folder" data-folder="sent">${t("mail.folders.sent")}</button></li>
          </ul>
        </aside>
        <section class="pm-pane pm-pane-list" aria-label="${t("mail.list.label")}">
          <h2 class="pm-pane-title">${t("mail.list.title")}</h2>
          <p class="pm-empty" data-testid="mail-list-empty">${t("mail.list.empty")}</p>
        </section>
        <section class="pm-pane pm-pane-reading" aria-label="${t("mail.reading.label")}">
          <h2 class="pm-pane-title">${t("mail.reading.title")}</h2>
          <p class="pm-empty" data-testid="mail-reading-empty">${t("mail.reading.empty")}</p>
          <p class="pm-privacy-hint" data-testid="mail-privacy-hint">
            ${imagesBlocked ? t("mail.privacy.images_blocked") : t("mail.privacy.images_allowed")}
          </p>
          <p class="pm-rules-hint" data-testid="mail-rules-count">${rulesLabel(ruleCount)}</p>
        </section>
      </div>
    </section>
  `;
}
