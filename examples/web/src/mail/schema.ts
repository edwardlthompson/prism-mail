/** Settings + whitelist schema (docs/specs/settings-whitelist-schema.md). */

export type Density = "comfortable" | "compact";
export type ReadingMode = "three_pane" | "two_pane";
export type ThemeMode = "system" | "light" | "dark";
export type RuleType = "image_allow" | "link_trust";
export type SubjectKind = "sender" | "domain";

export type Versioned = {
  id: string;
  version: number;
  deviceId: string;
  updatedAt: string;
  tombstone: boolean;
};

export type DisplaySettings = Versioned & {
  density: Density;
  theme: ThemeMode;
  readingMode: ReadingMode;
};

export type PrivacyDefaults = Versioned & {
  blockRemoteImages: boolean;
  confirmExternalLinks: boolean;
  stripTrackingParams: boolean;
  telemetry: false;
};

export type WhitelistRule = Versioned & {
  type: RuleType;
  subjectKind: SubjectKind;
  subject: string;
  enabled: boolean;
};

export type MailSettingsBundle = {
  display: DisplaySettings;
  privacy: PrivacyDefaults;
  rules: WhitelistRule[];
};

export function defaultDisplay(deviceId: string, now: string): DisplaySettings {
  return {
    id: "display",
    version: 1,
    deviceId,
    updatedAt: now,
    tombstone: false,
    density: "comfortable",
    theme: "system",
    readingMode: "three_pane",
  };
}

export function defaultPrivacy(deviceId: string, now: string): PrivacyDefaults {
  return {
    id: "privacy",
    version: 1,
    deviceId,
    updatedAt: now,
    tombstone: false,
    blockRemoteImages: true,
    confirmExternalLinks: true,
    stripTrackingParams: true,
    telemetry: false,
  };
}

export function emptyBundle(deviceId: string, now: string): MailSettingsBundle {
  return {
    display: defaultDisplay(deviceId, now),
    privacy: defaultPrivacy(deviceId, now),
    rules: [],
  };
}
