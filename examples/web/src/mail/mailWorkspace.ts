import { t } from "../i18n";
import { createComposeForm } from "./compose/ComposeForm";
import { mailShellHtml } from "./mailLayout";
import { connectAndList, type ListStatus, refreshInbox } from "./mailSession";
import { bindMailWorkspace } from "./mailWorkspaceBind";
import { sanitizeMailHtml } from "./privacy";
import {
  loadAccount,
  type MailProvider,
  type MessageSummary,
  resolveMailProvider,
} from "./providers";
import { bodyForMessage } from "./providers/bodies";
import { createMailStore } from "./store";

export type MailWorkspaceOptions = {
  store?: ReturnType<typeof createMailStore>;
  provider?: MailProvider;
};

export function createMailWorkspace(mount: HTMLElement, options: MailWorkspaceOptions = {}): void {
  const store = options.store ?? createMailStore();
  const provider = options.provider ?? resolveMailProvider();
  let bundle = store.load();
  let account = loadAccount();
  let messages: MessageSummary[] = [];
  let selected: MessageSummary | null = null;
  let status: ListStatus = account ? "loading" : "idle";
  let errorKey = "";
  let blockedImageCount = 0;
  let bodyHtml = "";
  let composing = false;
  let draftNote = "";

  function render(): void {
    const hint = bundle.privacy.blockRemoteImages
      ? t("mail.privacy.images_blocked")
      : t("mail.privacy.images_allowed");
    mount.innerHTML = mailShellHtml({
      bundle,
      account,
      messages,
      status,
      errorKey,
      selected,
      bodyHtml,
      blockedImageCount,
      privacyHint: hint,
      composing,
      draftNote,
      ruleCount: store.listActiveRules().length,
    });
    if (composing) {
      mount.querySelector("[data-reading-mount]")?.append(
        createComposeForm({
          onSaved: (draft) => {
            composing = false;
            draftNote = t("mail.compose.saved").replaceAll("{subject}", draft.subject);
            render();
          },
          onCancel: () => {
            composing = false;
            render();
          },
        }),
      );
    }
    bindMailWorkspace({
      mount,
      store,
      provider,
      getSelected: () => selected,
      setAccount: (a) => {
        account = a;
      },
      setMessages: (m) => {
        messages = m;
      },
      clearSelection: () => {
        selected = null;
        bodyHtml = "";
      },
      setStatusIdle: () => {
        status = "idle";
      },
      setComposing: (v) => {
        composing = v;
      },
      openMessage,
      onConnect: () => void onConnect(),
      render,
      reloadBundle: () => {
        bundle = store.load();
      },
    });
  }

  function openMessage(id: string): void {
    composing = false;
    selected = messages.find((m) => m.id === id) ?? null;
    if (!selected) {
      bodyHtml = "";
      blockedImageCount = 0;
      render();
      return;
    }
    bundle = store.load();
    const sanitized = sanitizeMailHtml(
      {
        html: bodyForMessage(selected),
        blockRemoteImages: bundle.privacy.blockRemoteImages,
        confirmExternalLinks: bundle.privacy.confirmExternalLinks,
        stripTrackingParams: bundle.privacy.stripTrackingParams,
        rules: store.listActiveRules(),
      },
      selected.from,
    );
    bodyHtml = sanitized.html;
    blockedImageCount = sanitized.blockedImageCount;
    render();
  }

  async function onConnect(): Promise<void> {
    status = "loading";
    render();
    const out = await connectAndList(provider, navigator.onLine);
    if (out.redirecting) return;
    account = out.account;
    messages = out.messages;
    status = out.status;
    errorKey = out.errorKey;
    render();
  }

  render();
  if (account) {
    void refreshInbox(provider, account).then((out) => {
      messages = out.messages;
      status = out.status;
      errorKey = out.errorKey;
      render();
    });
  }
}
