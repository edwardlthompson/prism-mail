import { t } from "../i18n";
import type { MailAccount, MessageSummary } from "./providers";
import { allowImagesRule, bindSettingsBar } from "./settingsUi";
import type { createMailStore } from "./store";

type Store = ReturnType<typeof createMailStore>;

export type WorkspaceBindDeps = {
  mount: HTMLElement;
  store: Store;
  provider: {
    disconnect: () => void;
  };
  getSelected: () => MessageSummary | null;
  setAccount: (a: MailAccount | null) => void;
  setMessages: (m: MessageSummary[]) => void;
  clearSelection: () => void;
  setStatusIdle: () => void;
  setComposing: (v: boolean) => void;
  openMessage: (id: string) => void;
  onConnect: () => void;
  render: () => void;
  reloadBundle: () => void;
};

export function bindMailWorkspace(deps: WorkspaceBindDeps): void {
  const { mount, store, provider, render } = deps;
  bindSettingsBar(mount, store, () => {
    deps.reloadBundle();
    const selected = deps.getSelected();
    if (selected) deps.openMessage(selected.id);
    else render();
  });
  mount.querySelector("[data-mail-compose]")?.addEventListener("click", () => {
    deps.setComposing(true);
    render();
  });
  mount.querySelector("[data-mail-connect]")?.addEventListener("click", () => deps.onConnect());
  mount.querySelector("[data-mail-disconnect]")?.addEventListener("click", () => {
    provider.disconnect();
    deps.setAccount(null);
    deps.setMessages([]);
    deps.clearSelection();
    deps.setStatusIdle();
    render();
  });
  for (const btn of mount.querySelectorAll<HTMLButtonElement>("[data-msg-id]")) {
    btn.addEventListener("click", () => deps.openMessage(btn.dataset.msgId ?? ""));
  }
  mount.querySelector("[data-allow-images]")?.addEventListener("click", () => {
    const selected = deps.getSelected();
    if (!selected) return;
    store.upsertRule(allowImagesRule(selected.from, store.load().privacy.deviceId));
    deps.openMessage(selected.id);
  });
  for (const a of mount.querySelectorAll<HTMLAnchorElement>("a[data-pm-confirm]")) {
    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      const href = a.getAttribute("data-pm-confirm") ?? "";
      if (href && window.confirm(t("mail.privacy.confirm_link"))) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    });
  }
}
