# DNCL QR Code Generator Chrome Extension

A powerful Chrome extension that converts text input or selected text into scannable QR codes.

## Features

- **Manual Text Input**: Type any text and generate a QR code instantly
- **Selected Text Conversion**: Right-click on selected text to convert to QR code
- **Page Text Conversion**: Convert entire page content to QR code
- **Download & Copy**: Download QR codes as PNG images or copy to clipboard
- **Keyboard Shortcuts**: Use Ctrl+Shift+Q for quick QR generation from selection
- **Visual Feedback**: Hints and animations for better user experience

## Installation

### Method 1: Load Unpacked Extension (Development)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your extensions list

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon.

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

## Support

For issues, feature requests, or questions:
1. Check the existing issues
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
