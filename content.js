console.log("Crypto Address Validator content script loaded");

let validationTimeout = null;

function validateAddress(text) {
  console.log("Validating address:", text);
  
  chrome.runtime.sendMessage({ action: "validateAddress", address: text }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError);
      return;
    }
    console.log("Validation response:", response);
    if (response && response.addressType !== "Unknown") {
      showNotification(response.isValid, response.addressType);
    } else {
      console.log("Address not recognized as Solana or Ethereum");
    }
  });
}

function showNotification(isValid, addressType) {
  console.log("Showing notification:", isValid, addressType);
  const notification = document.createElement('div');
  notification.className = `crypto-address-notification ${isValid ? 'valid' : 'invalid'}`;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px';
  notification.style.backgroundColor = isValid ? '#4CAF50' : '#F44336';
  notification.style.color = 'white';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '9999';
  notification.innerHTML = `
    <span class="icon">${isValid ? '✅' : '❌'}</span>
    <span class="message">${addressType} address ${isValid ? 'matched' : 'not matched'}</span>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function handleCopyAction(text) {
  if (validationTimeout) {
    clearTimeout(validationTimeout);
  }
  validationTimeout = setTimeout(() => {
    validateAddress(text);
    validationTimeout = null;
  }, 100);
}

// Listen for standard copy events
document.addEventListener('copy', (e) => {
  console.log("Standard copy event detected");
  setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    console.log("Selected text (standard copy):", selectedText);
    if (selectedText) {
      handleCopyAction(selectedText);
    }
  }, 100);
});

// Inject the page script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('page-script.js');
(document.head || document.documentElement).appendChild(script);

// Listen for messages from the injected script
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CUSTOM_COPY') {
    console.log("Custom copy detected:", event.data.text);
    handleCopyAction(event.data.text);
  }
});

console.log("Copy event listeners and custom copy interceptor set up");