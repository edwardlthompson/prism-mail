import { clearAccount, saveAccount } from "./session";
import type { ListResult, MailAccount, MailProvider, MessageSummary } from "./types";

const DEMO: MessageSummary[] = [
  {
    id: "demo-1",
    threadId: "t1",
    subject: "Welcome to Prism Mail",
    from: "hello@prism.mail",
    snippet: "Demo inbox — connect a real Gmail client ID for live mail.",
    date: "2026-01-01T12:00:00.000Z",
  },
  {
    id: "demo-2",
    threadId: "t2",
    subject: "Privacy defaults are on",
    from: "privacy@prism.mail",
    snippet: "Remote images stay blocked until you allow a sender.",
    date: "2026-01-02T09:30:00.000Z",
  },
];

export function createDemoProvider(): MailProvider {
  return {
    id: "demo",
    async connect(): Promise<MailAccount> {
      const account: MailAccount = { provider: "demo", email: "demo@prism.mail" };
      saveAccount(account);
      return account;
    },
    async listInbox(_account: MailAccount): Promise<ListResult> {
      return { ok: true, messages: DEMO };
    },
    disconnect(): void {
      clearAccount();
    },
  };
}
