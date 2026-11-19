# Prism Mail Desktop (Tauri 2)

Online-only client for Windows, Linux, and macOS. Loads the web hub UI; does **not** download mailboxes for offline use (ADR-0015). Optional Proton Bridge connector lives in `src-tauri/src/bridge/`.

## Status

Sprint 3 scaffold: Rust library + Tauri shell stubs. Full installer packaging and signing are HUMAN follow-ups.

## Dev

```bash
cd apps/desktop
cargo check -p prism-mail-desktop
```

Web UI remains in `examples/web/` until the webview is wired to `examples/web/dist`.
