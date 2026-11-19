import { APP_VERSION } from "./about/aboutSession";
import { createLaunchPromptDialog } from "./about/launchPrompt";
import type { LaunchPrompt } from "./about/runAppUpdates";
import { createSwUpdatePrompt } from "./about/swUpdatePrompt";
import type { DonationConfig } from "./about/types";
import { createAboutPanel } from "./components/AboutPanel";
import { createFeedbackPanel } from "./components/FeedbackPanel";
import { createSettingsPanel } from "./components/SettingsPanel";
import { t } from "./i18n";
import { createMailShell } from "./mail";
import { applyPanelScroll, current, type FeedbackKind, type GpRoute, type NavState } from "./nav";
import { bindPanelDialog } from "./panelDialog";

let dialogCleanup: (() => void) | undefined;

export type AppShellState = {
  nav: NavState;
  feedbackPrefill?: string;
  updateStatus: string;
  donations: DonationConfig;
  launchPrompt: LaunchPrompt | null;
  releaseRepo?: string;
  canApplyUpdate?: boolean;
  showSwUpdatePrompt?: boolean;
};

export type AppShellCallbacks = {
  onState: (next: Partial<AppShellState>) => void;
  onPushRoute: (route: GpRoute, kind?: FeedbackKind) => void;
  onPop: () => void;
  onApplyUpdate?: () => void;
  onDonate?: () => void;
  onLaunchPrompt?: (accepted: boolean) => void;
  canApplyUpdate?: boolean;
};

export function createAppShell(
  root: HTMLElement,
  state: AppShellState,
  callbacks: AppShellCallbacks,
): void {
  const route = current(state.nav);
  const atHome = route === "home";

  root.innerHTML = `
    <main class="${atHome ? "pm-main" : ""}">
      <div class="gp-header">
        <h1 class="gp-title">${t("app.title")}</h1>
        <div class="gp-header-actions">
          ${
            atHome
              ? `<button type="button" class="gp-settings-btn" data-settings-open aria-label="${t("settings.open")}">${t("settings.open")}</button>`
              : ""
          }
        </div>
      </div>
      <div data-mail-mount></div>
      <div data-panel-mount></div>
    </main>
  `;

  const mailMount = root.querySelector<HTMLElement>("[data-mail-mount]");
  if (atHome && mailMount) {
    createMailShell(mailMount);
  }

  root.querySelector("[data-settings-open]")?.addEventListener("click", () => {
    toggleOrPush(route, "settings", callbacks);
  });

  const mount = root.querySelector("[data-panel-mount]");
  if (!mount) return;

  dialogCleanup?.();
  dialogCleanup = undefined;
  mount.innerHTML = "";

  if (state.nav.promptOpen && state.launchPrompt) {
    const promptDialog = createLaunchPromptDialog(state.launchPrompt, (accepted) => {
      callbacks.onLaunchPrompt?.(accepted);
    });
    mount.appendChild(promptDialog);
    return;
  }

  if (atHome && state.showSwUpdatePrompt) {
    mount.appendChild(
      createSwUpdatePrompt(
        () => {
          callbacks.onApplyUpdate?.();
          callbacks.onState({ showSwUpdatePrompt: false, canApplyUpdate: true });
        },
        () => callbacks.onState({ showSwUpdatePrompt: false }),
      ),
    );
  }

  if (route === "feedback") {
    const panel = createFeedbackPanel(state.nav.feedbackKind ?? "bug", {
      onClose: callbacks.onPop,
      releaseRepo: state.releaseRepo ?? "",
      description: state.feedbackPrefill,
    });
    mount.appendChild(panel);
    dialogCleanup = bindPanelDialog(panel, callbacks.onPop);
    applyPanelScroll(root, state.nav);
    return;
  }

  if (route === "settings") {
    const panel = createSettingsPanel({
      onClose: callbacks.onPop,
      onOpenAbout: () => callbacks.onPushRoute("about"),
    });
    mount.appendChild(panel);
    dialogCleanup = bindPanelDialog(panel, callbacks.onPop);
    applyPanelScroll(root, state.nav);
    return;
  }

  if (route !== "about") return;

  mount.appendChild(
    createAboutPanel(
      {
        version: APP_VERSION,
        updateStatus: state.updateStatus,
        donations: state.donations,
        canApplyUpdate: state.canApplyUpdate ?? callbacks.canApplyUpdate,
      },
      callbacks.onPop,
      callbacks.onApplyUpdate,
      () => callbacks.onPushRoute("feedback", "bug"),
      () => callbacks.onPushRoute("feedback", "feature"),
    ),
  );
  const aboutPanel = mount.lastElementChild as HTMLElement;
  dialogCleanup = bindPanelDialog(aboutPanel, callbacks.onPop);
  applyPanelScroll(root, state.nav);
}

function toggleOrPush(route: GpRoute, target: GpRoute, callbacks: AppShellCallbacks): void {
  if (route === target) callbacks.onPop();
  else callbacks.onPushRoute(target);
}
