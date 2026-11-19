import { describe, expect, it, vi } from "vitest";
import { listGmailInbox } from "./gmailApi";
import type { MailAccount } from "./types";

describe("listGmailInbox", () => {
  it("maps Gmail metadata into summaries", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes("/messages?")) {
        return {
          ok: true,
          json: async () => ({ messages: [{ id: "1", threadId: "t" }] }),
        };
      }
      return {
        ok: true,
        json: async () => ({
          id: "1",
          threadId: "t",
          snippet: "hi",
          payload: {
            headers: [
              { name: "Subject", value: "Hello" },
              { name: "From", value: "a@b.c" },
              { name: "Date", value: "Wed, 1 Jan 2026" },
            ],
          },
        }),
      };
    }) as unknown as typeof fetch;

    const account: MailAccount = {
      provider: "gmail",
      email: "u@g.com",
      accessToken: "tok",
    };
    const result = await listGmailInbox(account, fetchImpl);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.messages[0]?.subject).toBe("Hello");
      expect(result.messages[0]?.from).toBe("a@b.c");
    }
  });

  it("fails without a token", async () => {
    const result = await listGmailInbox({ provider: "gmail", email: "u@g.com" });
    expect(result).toEqual({ ok: false, error: "missing_token" });
  });
});
