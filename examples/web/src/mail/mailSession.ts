import type { MailAccount, MailProvider, MessageSummary } from "./providers";

export type ListStatus = "idle" | "loading" | "error" | "ready";

export async function connectAndList(
  provider: MailProvider,
  online: boolean,
): Promise<{
  account: MailAccount | null;
  messages: MessageSummary[];
  status: ListStatus;
  errorKey: string;
  redirecting: boolean;
}> {
  if (!online) {
    return {
      account: null,
      messages: [],
      status: "error",
      errorKey: "mail.connect.offline",
      redirecting: false,
    };
  }
  try {
    const account = await provider.connect();
    const result = await provider.listInbox(account);
    return {
      account,
      messages: result.ok ? result.messages : [],
      status: result.ok ? "ready" : "error",
      errorKey: result.ok ? "" : "mail.list.error",
      redirecting: false,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error";
    if (msg === "redirecting") {
      return {
        account: null,
        messages: [],
        status: "loading",
        errorKey: "",
        redirecting: true,
      };
    }
    return {
      account: null,
      messages: [],
      status: "error",
      errorKey: msg === "missing_client_id" ? "mail.connect.missing_client" : "mail.connect.error",
      redirecting: false,
    };
  }
}

export async function refreshInbox(
  provider: MailProvider,
  account: MailAccount,
): Promise<{ messages: MessageSummary[]; status: ListStatus; errorKey: string }> {
  const result = await provider.listInbox(account);
  return {
    messages: result.ok ? result.messages : [],
    status: result.ok ? "ready" : "error",
    errorKey: result.ok ? "" : "mail.list.error",
  };
}
