import { listGmailInbox } from "./gmailApi";
import {
  beginGmailOAuth,
  clearGmailSession,
  exchangeGmailCode,
  oauthConfigured,
} from "./gmailOAuth";
import type { ListResult, MailAccount, MailProvider } from "./types";

export function createGmailProvider(): MailProvider {
  return {
    id: "gmail",
    async connect(): Promise<MailAccount> {
      if (!oauthConfigured()) throw new Error("missing_client_id");
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const account = await exchangeGmailCode(code);
        window.history.replaceState({}, "", window.location.pathname);
        return account;
      }
      await beginGmailOAuth();
      // Redirect in progress; unreachable in practice.
      throw new Error("redirecting");
    },
    listInbox(account: MailAccount): Promise<ListResult> {
      return listGmailInbox(account);
    },
    disconnect(): void {
      clearGmailSession();
    },
  };
}
