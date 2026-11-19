import { t } from "../../i18n";
import { type ComposeDraft, newDraft, saveDraft } from "./drafts";

export type ComposeFormCallbacks = {
  onSaved: (draft: ComposeDraft) => void;
  onCancel: () => void;
};

/** Local-only compose stub (queues draft; no provider send yet). */
export function createComposeForm(callbacks: ComposeFormCallbacks): HTMLElement {
  const form = document.createElement("form");
  form.className = "pm-compose";
  form.dataset.testid = "mail-compose";
  form.innerHTML = `
    <h2 class="pm-pane-title">${t("mail.compose.title")}</h2>
    <label class="pm-compose-row">
      <span>${t("mail.compose.to")}</span>
      <input type="email" name="to" required data-testid="mail-compose-to" />
    </label>
    <label class="pm-compose-row">
      <span>${t("mail.compose.subject")}</span>
      <input type="text" name="subject" required data-testid="mail-compose-subject" />
    </label>
    <label class="pm-compose-row">
      <span>${t("mail.compose.body")}</span>
      <textarea name="body" rows="6" required data-testid="mail-compose-body"></textarea>
    </label>
    <div class="pm-compose-actions">
      <button type="submit" data-testid="mail-compose-save">${t("mail.compose.save")}</button>
      <button type="button" data-compose-cancel>${t("mail.compose.cancel")}</button>
    </div>
    <p class="pm-compose-hint">${t("mail.compose.hint")}</p>
  `;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const data = new FormData(form);
    const draft = newDraft({
      to: String(data.get("to") ?? ""),
      subject: String(data.get("subject") ?? ""),
      body: String(data.get("body") ?? ""),
    });
    saveDraft(draft);
    callbacks.onSaved(draft);
  });
  form.querySelector("[data-compose-cancel]")?.addEventListener("click", callbacks.onCancel);
  return form;
}
