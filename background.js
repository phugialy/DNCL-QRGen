// Background script for Chrome extension
// Handles context menu creation and message passing

/**
 * Initialize extension when installed or updated
 */
chrome.runtime.onInstalled.addListener(function() {
    console.log('DNCL QR Generator extension installed');
    
    // Create context menu item for selected text
    chrome.contextMenus.create({
        id: 'generateQRFromSelection',
        title: 'Generate QR Code from Selection',
        contexts: ['selection'],
        documentUrlPatterns: ['<all_urls>']
    });
    
    // Create context menu item for page
    chrome.contextMenus.create({
        id: 'generateQRFromPage',
        title: 'Generate QR Code from Page',
        contexts: ['page'],
        documentUrlPatterns: ['<all_urls>']
    });
});

/**
 * Handle context menu clicks
 */
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    console.log('Context menu clicked:', info.menuItemId);
    
    if (info.menuItemId === 'generateQRFromSelection') {
        handleSelectedText(info, tab);
    } else if (info.menuItemId === 'generateQRFromPage') {
        handlePageText(info, tab);
    }
});

/**
 * Handle selected text conversion
 */
function handleSelectedText(info, tab) {
    const selectedText = info.selectionText;
    
    if (!selectedText || selectedText.trim().length === 0) {
        console.log('No text selected');
        return;
    }
    
    console.log('Selected text:', selectedText);
    
    // Store the selected text for the popup to use
    chrome.storage.local.set({
        selectedText: selectedText.trim()
    }, function() {
        if (chrome.runtime.lastError) {
            console.error('Error storing selected text:', chrome.runtime.lastError);
            return;
        }
        
        // Open the extension popup
        chrome.action.openPopup();
    });
}

/**
 * Handle page text conversion
 */
function handlePageText(info, tab) {
    // Send message to content script to get page text
    chrome.tabs.sendMessage(tab.id, {
        action: 'getPageText'
    }, function(response) {
        if (chrome.runtime.lastError) {
            console.error('Error getting page text:', chrome.runtime.lastError);
            return;
        }
        
        if (response && response.text) {
            // Store the page text for the popup to use
            chrome.storage.local.set({
                selectedText: response.text.trim()
            }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error storing page text:', chrome.runtime.lastError);
                    return;
                }
                
                // Open the extension popup
                chrome.action.openPopup();
            });
        }
    });
}

/**
 * Handle messages from content scripts
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Background received message:', request);
    
    if (request.action === 'generateQRFromSelection') {
        // Store selected text and open popup
        chrome.storage.local.set({
            selectedText: request.text
        }, function() {
            chrome.action.openPopup();
            sendResponse({ success: true });
        });
        return true; // Keep message channel open for async response
    }
    
    if (request.action === 'generateQRFromPage') {
        // Store page text and open popup
        chrome.storage.local.set({
            selectedText: request.text
        }, function() {
            chrome.action.openPopup();
            sendResponse({ success: true });
        });
        return true; // Keep message channel open for async response
    }
});

/**
 * Handle extension icon click
 */
chrome.action.onClicked.addListener(function(tab) {
    // This will open the popup automatically
    console.log('Extension icon clicked');
});

/**
 * Handle tab updates to ensure context menu is available
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log('Tab updated:', tab.url);
    }
});

/**
 * Error handling
 */
chrome.runtime.onStartup.addListener(function() {
    console.log('DNCL QR Generator extension started');
});

chrome.runtime.onSuspend.addListener(function() {
    console.log('DNCL QR Generator extension suspended');
});
