// DOM elements
const textInput = document.getElementById('textInput');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const qrCanvas = document.getElementById('qrCanvas');
const qrText = document.getElementById('qrText');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const inputHint = document.querySelector('.input-hint');

// State management
let currentQRData = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
    initializePopup();
    setupEventListeners();
    loadStoredText();
});

/**
 * Initialize popup with any stored data
 */
function initializePopup() {
    // Check if there's text from context menu
    chrome.storage.local.get(['selectedText'], function(result) {
        if (result.selectedText) {
            textInput.value = result.selectedText;
            // Clear the stored text after using it
            chrome.storage.local.remove(['selectedText']);
            // Auto-generate QR code for selected text
            generateQRCode();
        }
    });
}

/**
 * Setup event listeners for UI interactions
 */
function setupEventListeners() {
    // Generate button click
    generateBtn.addEventListener('click', generateQRCode);
    
    // Enter key in text input
    textInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateQRCode();
        }
    });
    
    // Download button
    downloadBtn.addEventListener('click', downloadQRCode);
    
    // Copy button
    copyBtn.addEventListener('click', copyQRCode);
    
    // Input validation
    textInput.addEventListener('input', validateInput);
    
    // Show hint when user starts typing
    textInput.addEventListener('focus', function() {
        if (textInput.value.trim()) {
            inputHint.classList.add('show');
        }
    });
    
    textInput.addEventListener('input', function() {
        if (textInput.value.trim()) {
            inputHint.classList.add('show');
        } else {
            inputHint.classList.remove('show');
        }
    });
}

/**
 * Validate input and update UI state
 */
function validateInput() {
    const text = textInput.value.trim();
    generateBtn.disabled = text.length === 0;
    
    if (text.length > 0) {
        generateBtn.classList.remove('disabled');
    } else {
        generateBtn.classList.add('disabled');
    }
}

/**
 * Generate QR code from input text
 */
function generateQRCode() {
    const text = textInput.value.trim();
    
    if (!text) {
        showError('Please enter some text to convert to QR code.');
        return;
    }
    
    if (text.length > 2953) {
        showError('Text is too long. Please enter less than 2953 characters.');
        return;
    }
    
    try {
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.classList.add('loading');
        generateBtn.innerHTML = '<span class="btn-text">Generating</span><span class="btn-icon">⏳</span>';
        
        // Clear previous results
        hideError();
        hideResult();
        
        // Generate QR code using the correct API
        try {
            // Check if QRCode library is available
            if (typeof qrcode === 'undefined') {
                throw new Error('QRCode library not loaded');
            }
            
            // Clear canvas first
            const ctx = qrCanvas.getContext('2d');
            ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
            
            // Set canvas size explicitly
            qrCanvas.width = 400;
            qrCanvas.height = 400;
            
            // Create QR code
            const qr = qrcode(0, 'M');
            qr.addData(text);
            qr.make();
            
            // Calculate the optimal cell size to fill the canvas
            const moduleCount = qr.getModuleCount();
            const cellSize = Math.floor(Math.min(qrCanvas.width, qrCanvas.height) / moduleCount);
            
            // Use the built-in canvas rendering method with calculated cell size
            qr.renderTo2dContext(ctx, cellSize);
            
            // Success - show result
            currentQRData = text;
            qrText.textContent = text;
            showResult();
            
            // Add success animation and focus on QR code
            const qrContainer = document.querySelector('.qr-container');
            const resultSectionElement = document.querySelector('.result-section');
            const inputSection = document.querySelector('.input-section');
            const footer = document.querySelector('.footer');
            const container = document.querySelector('.container');
            const qrInfo = document.querySelector('.qr-info');
            
            // Add success pulse with null check
            if (qrContainer) {
                qrContainer.classList.add('success');
                setTimeout(() => {
                    if (qrContainer) qrContainer.classList.remove('success');
                }, 600);
            }
            
            // Trigger focus animation after a short delay with null checks
            setTimeout(() => {
                if (container) container.classList.add('qr-generated');
                if (inputSection) inputSection.classList.add('compact');
                if (resultSectionElement) resultSectionElement.classList.add('focus');
                if (qrContainer) qrContainer.classList.add('focus');
                if (qrInfo) qrInfo.classList.add('focus');
                if (footer) footer.classList.add('compact');
            }, 300);
            
            // Store the generated text for potential reuse
            chrome.storage.local.set({ lastGeneratedText: text });
            
        } catch (error) {
            console.error('QR Code generation error:', error);
            showError('Failed to generate QR code: ' + error.message);
        }
        
        generateBtn.disabled = false;
        generateBtn.classList.remove('loading');
        generateBtn.innerHTML = '<span class="btn-text">Generate QR Code</span><span class="btn-icon">→</span>';
        
    } catch (error) {
        console.error('QR Code generation error:', error);
        showError('An unexpected error occurred: ' + error.message);
        generateBtn.disabled = false;
        generateBtn.classList.remove('loading');
        generateBtn.innerHTML = '<span class="btn-text">Generate QR Code</span><span class="btn-icon">→</span>';
    }
}

/**
 * Download QR code as PNG image
 */
function downloadQRCode() {
    if (!currentQRData) {
        showError('No QR code to download.');
        return;
    }
    
    try {
        // Create download link
        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.png`;
        link.href = qrCanvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success feedback
        showTemporaryMessage('QR code downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        showError('Failed to download QR code.');
    }
}

/**
 * Copy QR code to clipboard
 */
async function copyQRCode() {
    if (!currentQRData) {
        showError('No QR code to copy.');
        return;
    }
    
    try {
        // Convert canvas to blob
        qrCanvas.toBlob(async function(blob) {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
                showTemporaryMessage('QR code copied to clipboard!', 'success');
            } catch (error) {
                // Fallback: copy text instead
                await navigator.clipboard.writeText(currentQRData);
                showTemporaryMessage('Text copied to clipboard!', 'success');
            }
        });
        
    } catch (error) {
        console.error('Copy error:', error);
        showError('Failed to copy QR code.');
    }
}

/**
 * Load previously stored text
 */
function loadStoredText() {
    chrome.storage.local.get(['lastGeneratedText'], function(result) {
        if (result.lastGeneratedText && !textInput.value) {
            textInput.value = result.lastGeneratedText;
            validateInput();
        }
    });
}

/**
 * Show result section
 */
function showResult() {
    resultSection.style.display = 'block';
    errorSection.style.display = 'none';
}

/**
 * Hide result section
 */
function hideResult() {
    resultSection.style.display = 'none';
    
    // Reset all focus states with null checks
    const container = document.querySelector('.container');
    const inputSection = document.querySelector('.input-section');
    const resultSectionElement = document.querySelector('.result-section');
    const qrContainer = document.querySelector('.qr-container');
    const qrInfo = document.querySelector('.qr-info');
    const footer = document.querySelector('.footer');
    
    if (container) container.classList.remove('qr-generated');
    if (inputSection) inputSection.classList.remove('compact');
    if (resultSectionElement) resultSectionElement.classList.remove('focus');
    if (qrContainer) qrContainer.classList.remove('focus');
    if (qrInfo) qrInfo.classList.remove('focus');
    if (footer) footer.classList.remove('compact');
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    resultSection.style.display = 'none';
}

/**
 * Hide error message
 */
function hideError() {
    errorSection.style.display = 'none';
}

/**
 * Show temporary success message
 */
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
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 2000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
`;
document.head.appendChild(style);
