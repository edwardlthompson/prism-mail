import { t } from "../i18n";
import type { MailSettingsBundle, WhitelistRule } from "./schema";
import type { MailStore } from "./store";

/** Compact privacy settings + allow-rule actions for the mail shell. */
export function settingsBarHtml(bundle: MailSettingsBundle): string {
  const checked = bundle.privacy.blockRemoteImages ? "checked" : "";
  return `<div class="pm-settings-bar" data-testid="mail-settings-bar">
    <label class="pm-settings-toggle">
      <input type="checkbox" data-privacy-images ${checked} />
      <span>${t("mail.settings.block_images")}</span>
    </label>
  </div>`;
}

export function bindSettingsBar(root: HTMLElement, store: MailStore, onChange: () => void): void {
  const box = root.querySelector<HTMLInputElement>("[data-privacy-images]");
  box?.addEventListener("change", () => {
    const bundle = store.load();
    bundle.privacy = {
      ...bundle.privacy,
      blockRemoteImages: Boolean(box.checked),
      version: bundle.privacy.version + 1,
      updatedAt: new Date().toISOString(),
    };
    store.save(bundle);
    onChange();
  });
}

export function allowImagesRule(from: string, deviceId: string): WhitelistRule {
  const subject = from.includes("<") ? (from.match(/<([^>]+)>/)?.[1] ?? from) : from;
  return {
    id: crypto.randomUUID(),
    version: 1,
    deviceId,
    updatedAt: new Date().toISOString(),
    tombstone: false,
    type: "image_allow",
    subjectKind: "sender",
    subject: subject.trim(),
    enabled: true,
  };
}
