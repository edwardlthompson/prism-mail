export type MailAccount = {
  provider: "gmail" | "demo";
  email: string;
  accessToken?: string;
};

export type MessageSummary = {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
};

export type ListResult = { ok: true; messages: MessageSummary[] } | { ok: false; error: string };

export type MailProvider = {
  id: "gmail" | "demo";
  connect: () => Promise<MailAccount>;
  listInbox: (account: MailAccount) => Promise<ListResult>;
  disconnect: () => void;
};
