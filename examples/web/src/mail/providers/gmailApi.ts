import type { ListResult, MailAccount, MessageSummary } from "./types";

type GmailList = {
  messages?: { id: string; threadId: string }[];
};

type GmailMsg = {
  id: string;
  threadId: string;
  snippet?: string;
  payload?: { headers?: { name: string; value: string }[] };
  internalDate?: string;
};

function header(msg: GmailMsg, name: string): string {
  const hit = msg.payload?.headers?.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return hit?.value ?? "";
}

export async function listGmailInbox(
  account: MailAccount,
  fetchImpl: typeof fetch = fetch,
): Promise<ListResult> {
  const token = account.accessToken;
  if (!token) return { ok: false, error: "missing_token" };
  try {
    const listRes = await fetchImpl(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=25&q=in:inbox",
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!listRes.ok) return { ok: false, error: `list_${listRes.status}` };
    const list = (await listRes.json()) as GmailList;
    const ids = (list.messages ?? []).slice(0, 25);
    const messages: MessageSummary[] = [];
    for (const row of ids) {
      const msgRes = await fetchImpl(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${row.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!msgRes.ok) continue;
      const msg = (await msgRes.json()) as GmailMsg;
      messages.push({
        id: msg.id,
        threadId: msg.threadId,
        subject: header(msg, "Subject") || "(no subject)",
        from: header(msg, "From"),
        snippet: msg.snippet ?? "",
        date: header(msg, "Date") || msg.internalDate || "",
      });
    }
    return { ok: true, messages };
  } catch {
    return { ok: false, error: "network" };
  }
}
