import {
  createQrGenerator,
  QrGenerationError,
  normalizeText,
} from './shared/qrGenerator.js';

const elements = {
  textInput: document.getElementById('textInput'),
  generateBtn: document.getElementById('generateBtn'),
  resultSection: document.getElementById('resultSection'),
  errorSection: document.getElementById('errorSection'),
  errorMessage: document.getElementById('errorMessage'),
  qrCanvas: document.getElementById('qrCanvas'),
  qrText: document.getElementById('qrText'),
  downloadBtn: document.getElementById('downloadBtn'),
  copyBtn: document.getElementById('copyBtn'),
  inputHint: document.querySelector('.input-hint'),
};

const animationElements = {
  qrContainer: document.querySelector('.qr-container'),
  resultSectionElement: document.querySelector('.result-section'),
  inputSection: document.querySelector('.input-section'),
  footer: document.querySelector('.footer'),
  container: document.querySelector('.container'),
  qrInfo: document.querySelector('.qr-info'),
};

const state = {
  current: null,
};

const qrGenerator = createQrGenerator(window.qrcode);

document.addEventListener('DOMContentLoaded', () => {
  initializePopup();
  setupEventListeners();
  loadStoredText();
  validateInput();
});

function initializePopup() {
  chrome.storage.local.get(['selectedText'], (result) => {
    if (!result.selectedText) {
      return;
    }

    elements.textInput.value = normalizeText(result.selectedText);
    chrome.storage.local.remove(['selectedText']);
    generateQRCode();
  });
}

function setupEventListeners() {
  elements.generateBtn.addEventListener('click', generateQRCode);
  elements.downloadBtn.addEventListener('click', downloadQRCode);
  elements.copyBtn.addEventListener('click', copyQRCode);

  elements.textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      generateQRCode();
    }
  });

  elements.textInput.addEventListener('input', () => {
    validateInput();
    toggleHint();
  });

  elements.textInput.addEventListener('focus', toggleHint);
}

function toggleHint() {
  if (!elements.inputHint) {
    return;
  }

  if (normalizeText(elements.textInput.value)) {
    elements.inputHint.classList.add('show');
  } else {
    elements.inputHint.classList.remove('show');
  }
}

function validateInput() {
  const { ok } = qrGenerator.validate(elements.textInput.value, { requireValue: false });
  elements.generateBtn.disabled = !ok || !normalizeText(elements.textInput.value);
  elements.generateBtn.classList.toggle('disabled', elements.generateBtn.disabled);
}

function setLoading(isLoading) {
  elements.generateBtn.disabled = isLoading;
  elements.generateBtn.classList.toggle('loading', isLoading);

  elements.generateBtn.innerHTML = isLoading
    ? '<span class="btn-text">Generating</span><span class="btn-icon">⏳</span>'
    : '<span class="btn-text">Generate QR Code</span><span class="btn-icon">→</span>';
}

function generateQRCode() {
  const inputText = elements.textInput.value;
  const validation = qrGenerator.validate(inputText);

  if (!validation.ok) {
    showError(validation.message);
    return;
  }

  try {
    setLoading(true);
    hideError();
    hideResult();

    const result = qrGenerator.renderToCanvas(validation.normalized, {
      canvas: elements.qrCanvas,
      size: 400,
      margin: 16,
    });

    state.current = {
      text: result.text,
      dataUrl: result.dataUrl,
    };

    elements.qrText.textContent = result.text;
    showResult();
    animateSuccess();

    chrome.storage.local.set({ lastGeneratedText: result.text });
  } catch (error) {
    console.error('QR Code generation error:', error);

    const message = error instanceof QrGenerationError
      ? error.message
      : 'An unexpected error occurred while generating the QR code.';

    showError(message);
  } finally {
    setLoading(false);
  }
}

function downloadQRCode() {
  if (!state.current) {
    showError('No QR code to download.');
    return;
  }

  try {
    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = state.current.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showTemporaryMessage('QR code downloaded successfully!', 'success');
  } catch (error) {
    console.error('Download error:', error);
    showError('Failed to download QR code.');
  }
}

async function copyQRCode() {
  if (!state.current) {
    showError('No QR code to copy.');
    return;
  }

  try {
    const blob = await dataUrlToBlob(state.current.dataUrl);
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
    showTemporaryMessage('QR code copied to clipboard!', 'success');
  } catch (error) {
    console.warn('Image copy failed, attempting to copy text.', error);

    try {
      await navigator.clipboard.writeText(state.current.text);
      showTemporaryMessage('Text copied to clipboard!', 'success');
    } catch (copyError) {
      console.error('Copy error:', copyError);
      showError('Failed to copy QR code.');
    }
  }
}

function loadStoredText() {
  chrome.storage.local.get(['lastGeneratedText'], (result) => {
    if (!result.lastGeneratedText || elements.textInput.value) {
      return;
    }
    elements.textInput.value = normalizeText(result.lastGeneratedText);
    validateInput();
  });
}

function showResult() {
  elements.resultSection.style.display = 'block';
  elements.errorSection.style.display = 'none';
}

function hideResult() {
  elements.resultSection.style.display = 'none';

  const {
    container,
    inputSection,
    resultSectionElement,
    qrContainer,
    qrInfo,
    footer,
  } = animationElements;

  container?.classList.remove('qr-generated');
  inputSection?.classList.remove('compact');
  resultSectionElement?.classList.remove('focus');
  qrContainer?.classList.remove('focus');
  qrInfo?.classList.remove('focus');
  footer?.classList.remove('compact');
}

function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorSection.style.display = 'block';
  elements.resultSection.style.display = 'none';
}

function hideError() {
  elements.errorSection.style.display = 'none';
}

function animateSuccess() {
  const {
    qrContainer,
    resultSectionElement,
    inputSection,
    footer,
    container,
    qrInfo,
  } = animationElements;

  qrContainer?.classList.add('success');
  setTimeout(() => qrContainer?.classList.remove('success'), 600);

  setTimeout(() => {
    container?.classList.add('qr-generated');
    inputSection?.classList.add('compact');
    resultSectionElement?.classList.add('focus');
    qrContainer?.classList.add('focus');
    qrInfo?.classList.add('focus');
    footer?.classList.add('compact');
  }, 300);
}

function showTemporaryMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `temp-message ${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      messageDiv.remove();
    }, 300);
  }, 2000);
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
`;
document.head.appendChild(style);
