// Content script for Chrome extension
// Handles text selection and page interaction

/**
 * Initialize content script
 */
(function() {
    'use strict';
    
    console.log('DNCL QR Generator content script loaded');
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log('Content script received message:', request);
        
        if (request.action === 'getPageText') {
            const pageText = getPageText();
            sendResponse({ text: pageText });
        }
        
        if (request.action === 'getSelectedText') {
            const selectedText = getSelectedText();
            sendResponse({ text: selectedText });
        }
    });
    
    // Add keyboard shortcut listener
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+Q to generate QR from selection
        if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
            e.preventDefault();
            const selectedText = getSelectedText();
            if (selectedText) {
                generateQRFromSelection(selectedText);
            }
        }
    });
    
    // Add visual feedback for text selection
    document.addEventListener('mouseup', function() {
        const selectedText = getSelectedText();
        if (selectedText && selectedText.length > 0) {
            showSelectionHint();
        } else {
            hideSelectionHint();
        }
    });
    
    // Remove hint when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.qr-selection-hint')) {
            hideSelectionHint();
        }
    });
})();

/**
 * Get selected text from the page
 */
function getSelectedText() {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
        return selection.toString().trim();
    }
    return null;
}

/**
 * Get page text content
 */
function getPageText() {
    // Get the main content of the page
    const body = document.body;
    if (!body) return '';
    
    // Try to get the main content area
    const mainContent = body.querySelector('main') || 
                       body.querySelector('article') || 
                       body.querySelector('.content') || 
                       body.querySelector('#content') || 
                       body;
    
    // Get text content and clean it up
    let text = mainContent.innerText || mainContent.textContent || '';
    
    // Clean up the text
    text = text.replace(/\s+/g, ' ').trim();
    
    // Limit text length to prevent issues
    if (text.length > 2000) {
        text = text.substring(0, 2000) + '...';
    }
    
    return text;
}

/**
 * Generate QR code from selected text
 */
function generateQRFromSelection(text) {
    if (!text || text.trim().length === 0) {
        console.log('No text selected for QR generation');
        return;
    }
    
    console.log('Generating QR code for text:', text);
    
    // Send message to background script
    chrome.runtime.sendMessage({
        action: 'generateQRFromSelection',
        text: text
    }, function(response) {
        if (chrome.runtime.lastError) {
            console.error('Error sending message to background:', chrome.runtime.lastError);
            return;
        }
        
        if (response && response.success) {
            console.log('QR generation request sent successfully');
        }
    });
}

/**
 * Show selection hint
 */
function showSelectionHint() {
    // Remove existing hint
    hideSelectionHint();
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Create hint element
    const hint = document.createElement('div');
    hint.className = 'qr-selection-hint';
    hint.innerHTML = `
        <div class="hint-content">
            <span class="hint-text">Right-click to generate QR code</span>
            <span class="hint-shortcut">or Ctrl+Shift+Q</span>
        </div>
    `;
    
    // Style the hint
    hint.style.cssText = `
        position: fixed;
        top: ${rect.top + window.scrollY - 40}px;
        left: ${rect.left + window.scrollX}px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: fadeIn 0.2s ease;
        pointer-events: none;
        max-width: 200px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .qr-selection-hint .hint-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .qr-selection-hint .hint-shortcut {
            font-size: 10px;
            opacity: 0.8;
        }
    `;
    
    if (!document.querySelector('#qr-hint-styles')) {
        style.id = 'qr-hint-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(hint);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        hideSelectionHint();
    }, 3000);
}

/**
 * Hide selection hint
 */
function hideSelectionHint() {
    const existingHint = document.querySelector('.qr-selection-hint');
    if (existingHint) {
        existingHint.remove();
    }
}

/**
 * Utility function to check if text is valid for QR generation
 */
function isValidTextForQR(text) {
    if (!text || typeof text !== 'string') return false;
    
    const trimmedText = text.trim();
    if (trimmedText.length === 0) return false;
    if (trimmedText.length > 2953) return false; // QR code limit
    
    return true;
}

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        hideSelectionHint();
    }
});

/**
 * Handle page unload
 */
window.addEventListener('beforeunload', function() {
    hideSelectionHint();
});
