# DNCL QR Code Generator Chrome Extension

A powerful Chrome extension that converts text input or selected text into scannable QR codes.

## 🚀 Quick Install (3 Steps)

### Step 1: Download the Extension

**Option A: Download as ZIP (Easiest)**
1. Click the green **"Code"** button at the top of this page
2. Click **"Download ZIP"**
3. Extract the ZIP file to a folder (e.g., `Downloads/DNCL-QRGen-main`)

**Option B: Clone with Git**
```bash
git clone https://github.com/phugialy/DNCL-QRGen.git
cd DNCL-QRGen
```

### Step 2: Open Chrome Extensions Page

1. Open Google Chrome
2. Go to `chrome://extensions/` (paste this in the address bar)
3. **Enable "Developer mode"** (toggle in the top-right corner)

### Step 3: Load the Extension

1. Click **"Load unpacked"** button
2. Select the folder where you extracted/cloned the extension
3. The extension icon will appear in your Chrome toolbar!

**That's it!** 🎉 The extension is now installed and ready to use.

---

## Features

- **Manual Text Input**: Type any text and generate a QR code instantly
- **Selected Text Conversion**: Right-click on selected text to convert to QR code
- **Page Text Conversion**: Convert entire page content to QR code
- **Download & Copy**: Download QR codes as PNG images or copy to clipboard
- **Keyboard Shortcuts**: Use Ctrl+Shift+Q for quick QR generation from selection
- **Visual Feedback**: Hints and animations for better user experience

## Installation (Detailed)

### For Developers

If you want to modify the extension:

```bash
# Clone the repository
git clone https://github.com/phugialy/DNCL-QRGen.git
cd DNCL-QRGen

# Make changes to the code
# Then reload the extension in Chrome (chrome://extensions/)
```

### Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon for one-click installation.

## Usage

### Manual Text Input

1. Click the extension icon in the Chrome toolbar
2. Type your text in the input field
3. Click "Generate QR Code"
4. The QR code will appear below the input
5. Use "Download" or "Copy" buttons to save the QR code

### Selected Text Conversion

1. Select any text on a webpage
2. Right-click and choose "Generate QR Code from Selection"
3. The extension popup will open with the QR code generated
4. Alternatively, use Ctrl+Shift+Q keyboard shortcut

### Page Text Conversion

1. Right-click anywhere on a webpage
2. Choose "Generate QR Code from Page"
3. The extension will generate a QR code from the page content

## Keyboard Shortcuts

- **Ctrl+Shift+Q**: Generate QR code from selected text

## Technical Details

- **Manifest Version**: 3
- **Permissions**: activeTab, contextMenus, storage
- **QR Code Library**: QRCode.js
- **Maximum Text Length**: 2,953 characters (QR code limit)
- **Supported Formats**: PNG download, clipboard copy

## File Structure

```
DNCL-QRGen/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # Content script for page interaction
├── qrcode.min.js         # QR code generation library
├── icons/                # Extension icons
│   └── icon.svg         # SVG icon source
└── README.md            # This file
```

## Development

### Prerequisites

- Google Chrome browser
- Basic knowledge of Chrome extension development

### Building

1. Clone the repository
2. Make your changes
3. Test in Chrome using "Load unpacked"
4. Package for distribution using Chrome's "Pack extension" feature

### Testing

1. Load the extension in Chrome
2. Test manual text input
3. Test selected text conversion
4. Test page text conversion
5. Verify download and copy functionality
6. Test keyboard shortcuts

## Error Handling

The extension includes comprehensive error handling for:
- Empty text input
- Text length limits
- QR code generation failures
- Download/copy failures
- Network connectivity issues

## Browser Compatibility

- Chrome 88+
- Chromium-based browsers (Edge, Brave, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

**Extension not loading?**
- Make sure you selected the correct folder (the one containing `manifest.json`)
- Check that Developer mode is enabled
- Try reloading the extension in `chrome://extensions/`

**QR code not generating?**
- Make sure you've entered text in the input field
- Check browser console for errors (F12)
- Try refreshing the extension popup

**Extension icon not showing?**
- Click the puzzle piece icon in Chrome toolbar
- Pin the extension to make it always visible

## Support

For issues, feature requests, or questions:
1. Check the existing [Issues](https://github.com/phugialy/DNCL-QRGen/issues)
2. Create a new issue with detailed description
3. Include browser version and steps to reproduce

## Changelog

### Version 1.0.0
- Initial release
- Manual text input
- Selected text conversion
- Page text conversion
- Download and copy functionality
- Keyboard shortcuts
- Visual feedback and animations
