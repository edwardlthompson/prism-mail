import { createMailWorkspace, type MailWorkspaceOptions } from "./mailWorkspace";

export type MailShellOptions = MailWorkspaceOptions;

/** Public entry: three-pane mail workspace. */
export function createMailShell(mount: HTMLElement, options: MailShellOptions = {}): void {
  createMailWorkspace(mount, options);
}
