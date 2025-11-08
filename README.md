# DNCL QR Suite

Generate branded QR codes, personalise defaults per customer, and deliver the DNCL Chrome extension from one micro SaaS codebase.

---

## 🗂 Project layout

```
DNCL-QRGen/
├── extension/                # Chrome extension (MV3) ready for Load Unpacked
│   ├── background.js
│   ├── content.js
│   ├── manifest.json
│   ├── popup.html / .css / .js
│   └── shared/qrGenerator.js # Shared QR utilities (ES module)
├── shared/                   # Source-of-truth QR helpers consumable by web + extension
│   └── qr/qrGenerator.js
└── webapp/                   # Micro SaaS front-end (Vite + React)
    ├── public/downloads/     # Ships dncl-qr-extension.zip for one-click grab
    ├── src/components/       # Modular UI slices
    ├── src/hooks/            # Local state persistence helpers
    └── vite.config.js
```

> The extension package is re-zipped into `webapp/public/downloads/dncl-qr-extension.zip` so the web app can auto-serve the latest build.

---

## 🚀 Quick start

### 1. Clone

```bash
git clone https://github.com/phugialy/DNCL-QRGen.git
cd DNCL-QRGen
```

### 2. Run the micro web app

```bash
cd webapp
npm install
npm run dev
```

Visit the URL printed by Vite (usually `http://localhost:5173`). All customer personalisation is cached in `localStorage`, so returning users pick up where they left off.

### 3. Install the Chrome extension

1. Click **Download extension package** inside the web app *(or grab `webapp/public/downloads/dncl-qr-extension.zip` directly)*.
2. Extract the ZIP so you have a plain folder.
3. Open `chrome://extensions/` → enable **Developer mode**.
4. Choose **Load unpacked** and point at the extracted folder.
5. Pin the “DNCL QR Generator” icon for quick access.

---

## 💻 Web app highlights

- **Persistent personalisation**: store a customer label + default message in the browser cache.
- **High-fidelity QR output**: generates 512px PNGs with configurable error correction.
- **Copy & download**: one-click PNG download or clipboard copy (with text fallback).
- **Extension hand-off**: fetches the latest `dncl-qr-extension.zip` served alongside the SPA.

Useful scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite with hot reloading |
| `npm run build` | Production build (also zips the extension via CI) |
| `npm run lint` | ESLint check (React + SWC) |

---

## 🧩 Chrome extension features

- Manual text input with instant preview.
- Context-menu entries for selected text and full page content.
- Keyboard shortcut `Ctrl + Shift + Q`.
- Offline-friendly QR rendering using the shared generator module.
- Download, copy-to-clipboard, and helpful hints in the popup.

### Load for development

```bash
cd DNCL-QRGen/extension
# edit files, then reload the extension via chrome://extensions/
```

Changes to shared QR logic live in `shared/qr/qrGenerator.js`. The extension consumes the transpiled copy in `extension/shared/qrGenerator.js`.

---

## 🛠 Automation roadmap

- GitHub Actions workflow will build the SPA, re-zip the extension, and publish to GitHub Pages.
- Release tags will attach the latest `dncl-qr-extension.zip` as an artifact.
- Future toggle: deploy the extension to the Chrome Web Store once credentials are added.

---

## 🤝 Contributing

1. Fork the repo and create a feature branch.
2. Run `npm run lint` and `npm run build` inside `webapp/`.
3. Reload the extension and smoke-test the popup.
4. Submit a pull request with screenshots or notes.

---

## 📄 License

MIT © DNCL
