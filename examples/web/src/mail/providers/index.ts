import { createDemoProvider } from "./demoProvider";
import { oauthConfigured } from "./gmailOAuth";
import { createGmailProvider } from "./gmailProvider";
import type { MailProvider } from "./types";

export { oauthConfigured } from "./gmailOAuth";
export { clearAccount, loadAccount, saveAccount } from "./session";
export type { MailAccount, MailProvider, MessageSummary } from "./types";

/** Prefer live Gmail when a client ID is configured; otherwise demo. */
export function resolveMailProvider(): MailProvider {
  return oauthConfigured() ? createGmailProvider() : createDemoProvider();
}
