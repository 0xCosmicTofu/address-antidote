console.log("Crypto Address Validator content script loaded");

let isExtensionValid = true;

function isValidBlockchainAddress(text) {
  const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;
  const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  
  return ethereumRegex.test(text) || solanaRegex.test(text);
}

function validateAddress(text) {
  console.log("Validating address:", text);
  
  if (!isExtensionValid) {
    console.log("Extension context is invalid. Please refresh the page.");
    showNotification(false, "Error: Extension reloaded. Please refresh the page.");
    return;
  }

  if (!isValidBlockchainAddress(text)) {
    console.log("Not a valid Ethereum or Solana address, skipping validation");
    return;
  }

  try {
    chrome.runtime.sendMessage({ action: "validateAddress", address: text }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        handleExtensionInvalidation();
        return;
      }
      console.log("Validation response:", response);
      
      if (!response.hasSavedAddresses) {
        console.log("No saved addresses, skipping validation");
        return;
      }
      
      if (response.isValid) {
        showNotification(response.isMatched, response.addressType);
      } else {
        console.log("Address not recognized as Solana or Ethereum");
        showNotification(false, "Unknown");
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    handleExtensionInvalidation();
  }
}

function handleExtensionInvalidation() {
  isExtensionValid = false;
  console.log("Extension context invalidated. Please refresh the page.");
  showNotification(false, "Error: Extension reloaded. Please refresh the page.");
}

function showNotification(isMatched, addressType) {
  console.log("Showing notification:", isMatched, addressType);
  const notification = document.createElement('div');
  notification.className = `crypto-address-notification ${isMatched ? 'matched' : 'not-matched'}`;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '9999';
  notification.style.textAlign = 'center';
  notification.style.minWidth = '200px';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  notification.style.opacity = '0';
  notification.style.transition = 'opacity 0.3s ease-in-out';
  
  let message;
  let icon;
  
  if (addressType.startsWith("Error:")) {
    message = addressType;
    icon = '⚠️';
    notification.style.backgroundColor = '#FFA500'; // Yellow for errors
    notification.style.color = 'black'; // Black text for errors
  } else if (!isMatched) {
    message = "No addresses matched";
    icon = '⚠️';
    notification.style.backgroundColor = '#FFA500'; // Yellow for unmatched addresses
    notification.style.color = 'black';
  } else {
    message = `${addressType} address matched`;
    icon = '✅';
    notification.style.backgroundColor = '#4CAF50'; // Green for matched addresses
    notification.style.color = 'white';
  }
  
  notification.innerHTML = `
    <span class="icon" style="margin-right: 5px;">${icon}</span>
    <span class="message">${message}</span>
  `;
  document.body.appendChild(notification);
  
  // Trigger reflow to ensure the transition applies
  notification.offsetHeight;
  
  // Fade in
  notification.style.opacity = '1';
  
  setTimeout(() => {
    // Fade out
    notification.style.opacity = '0';
    
    // Remove the element after the fade-out transition completes
    notification.addEventListener('transitionend', function() {
      notification.remove();
    });
  }, 2700); // Start fade-out after 2.7 seconds (3 seconds total display time)
}

function handleCopy(e) {
  if (!isExtensionValid) return;
  
  console.log("Copy event detected");
  setTimeout(() => {
    const selection = document.getSelection();
    const selectedText = selection.toString().trim();
    console.log("Selected text:", selectedText);
    if (selectedText) {
      validateAddress(selectedText);
    }
  }, 100);
}

function handleCustomCopy(event) {
  if (!isExtensionValid) return;
  
  if (event.data && event.data.type === 'CUSTOM_COPY') {
    console.log("Custom copy detected:", event.data.text);
    validateAddress(event.data.text);
  }
}

document.addEventListener('copy', handleCopy);

const script = document.createElement('script');
script.src = chrome.runtime.getURL('contentScript.js');
(document.head || document.documentElement).appendChild(script);

window.addEventListener('message', handleCustomCopy);

console.log("Copy event listeners and custom copy interceptor set up");

setInterval(() => {
  if (!isExtensionValid) return;
  
  try {
    chrome.runtime.getURL('');
  } catch (error) {
    handleExtensionInvalidation();
  }
}, 5000);