import { challengeS256, randomVerifier } from "./pkce";
import { clearAccount, saveAccount } from "./session";
import type { MailAccount } from "./types";

const VERIFIER_KEY = "prism.mail.pkce.verifier";
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly openid email";

export function googleClientId(): string {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? "";
}

export function oauthConfigured(): boolean {
  return Boolean(googleClientId());
}

export async function beginGmailOAuth(
  redirectUri: string = window.location.origin + "/",
): Promise<void> {
  const clientId = googleClientId();
  if (!clientId) throw new Error("missing_client_id");
  const verifier = randomVerifier();
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  const challenge = await challengeS256(verifier);
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "consent");
  window.location.assign(url.toString());
}

export async function exchangeGmailCode(
  code: string,
  redirectUri: string = window.location.origin + "/",
  fetchImpl: typeof fetch = fetch,
): Promise<MailAccount> {
  const clientId = googleClientId();
  const verifier = sessionStorage.getItem(VERIFIER_KEY) ?? "";
  sessionStorage.removeItem(VERIFIER_KEY);
  if (!clientId || !verifier) throw new Error("oauth_state");
  const body = new URLSearchParams({
    client_id: clientId,
    code,
    code_verifier: verifier,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });
  const res = await fetchImpl("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`token_${res.status}`);
  const json = (await res.json()) as { access_token?: string; id_token?: string };
  if (!json.access_token) throw new Error("no_access_token");
  const email = await fetchEmail(json.access_token, fetchImpl);
  const account: MailAccount = {
    provider: "gmail",
    email,
    accessToken: json.access_token,
  };
  saveAccount(account);
  return account;
}

async function fetchEmail(token: string, fetchImpl: typeof fetch): Promise<string> {
  const res = await fetchImpl("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return "gmail-user";
  const json = (await res.json()) as { emailAddress?: string };
  return json.emailAddress ?? "gmail-user";
}

export function clearGmailSession(): void {
  clearAccount();
  sessionStorage.removeItem(VERIFIER_KEY);
}
