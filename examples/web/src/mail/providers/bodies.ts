import type { MessageSummary } from "./types";

/** Demo / fallback HTML bodies for the reading pane. */
export function bodyForMessage(msg: MessageSummary): string {
  if (msg.id.startsWith("demo-")) {
    return `<p>${escape(msg.snippet)}</p>
      <p><img src="https://track.example/pixel.gif" width="1" height="1" alt="" /></p>
      <p><a href="https://example.com/article?utm_source=demo">Read more</a></p>`;
  }
  return `<p>${escape(msg.snippet || msg.subject)}</p>`;
}

function escape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
