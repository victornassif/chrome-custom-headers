# chrome-custom-headers

A small Chrome extension to add, modify, or remove HTTP request headers. Created as a lightweight replacement for ModHeader (which includes ads).

## Purpose
- Provide an ad-free, privacy-focused tool for manipulating request headers.
- Simple rule-based header injection/removal for development and debugging.

## Load into Chrome (developer mode)
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked**.
4. Select the extension folder (the repository root or `dist`/`build` folder if the extension is built).
5. The extension should appear in the toolbar. Pin it if needed.

Note: if you have ModHeader installed, disable or remove it to avoid conflicting behavior.

## Quick usage
- Click the extension icon to open the UI.
- Add a rule: specify domain matching (e.g., `*://example.com/*`), header name, and header value.
- Enable/disable rules or toggle the extension globally.
- Changes take effect on new requests (reload pages to apply).

## Example rule
```
Domain: *://api.example.com/*
Header: X-My-Header
Value: 12345
Action: Add
```

## Privacy & permissions
- Requires permission to read/modify requests for specified sites.
- No ads and no telemetry by default (verify in code for your distribution).

## Uninstall
- Go to `chrome://extensions/`, find the extension, and click **Remove**.

Contributions, bug reports, and feature requests welcome — open a GitHub issue or PR in the repository.