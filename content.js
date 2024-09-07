let isExtensionValid = true;

const svgIcons = {
  checkmark: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.7754 2.60742C10.847 2.60742 8.96196 3.17925 7.35859 4.25059C5.75521 5.32194 4.50552 6.84468 3.76757 8.62626C3.02962 10.4078 2.83653 12.3682 3.21274 14.2596C3.58894 16.1509 4.51754 17.8882 5.8811 19.2517C7.24467 20.6153 8.98195 21.5439 10.8733 21.9201C12.7646 22.2963 14.725 22.1032 16.5066 21.3652C18.2881 20.6273 19.8109 19.3776 20.8822 17.7742C21.9536 16.1709 22.5254 14.2858 22.5254 12.3574C22.5227 9.7724 21.4946 7.29403 19.6667 5.46615C17.8388 3.63826 15.3604 2.61015 12.7754 2.60742ZM17.056 10.638L11.806 15.888C11.7364 15.9578 11.6536 16.0131 11.5626 16.0508C11.4716 16.0886 11.374 16.108 11.2754 16.108C11.1768 16.108 11.0792 16.0886 10.9882 16.0508C10.8971 16.0131 10.8144 15.9578 10.7448 15.888L8.49477 13.638C8.35404 13.4973 8.27498 13.3064 8.27498 13.1074C8.27498 12.9084 8.35404 12.7175 8.49477 12.5768C8.6355 12.4361 8.82637 12.357 9.02539 12.357C9.22442 12.357 9.41529 12.4361 9.55602 12.5768L11.2754 14.2971L15.9948 9.5768C16.0645 9.50711 16.1472 9.45184 16.2382 9.41413C16.3293 9.37641 16.4268 9.357 16.5254 9.357C16.6239 9.357 16.7215 9.37641 16.8126 9.41413C16.9036 9.45184 16.9863 9.50711 17.056 9.5768C17.1257 9.64648 17.181 9.7292 17.2187 9.82025C17.2564 9.91129 17.2758 10.0089 17.2758 10.1074C17.2758 10.206 17.2564 10.3035 17.2187 10.3946C17.181 10.4856 17.1257 10.5684 17.056 10.638Z" fill="black"/>
</svg>
`,
  warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.1991 17.6335L14.0006 3.39569C13.7957 3.04687 13.5033 2.75764 13.1522 2.55668C12.8011 2.35572 12.4036 2.25 11.9991 2.25C11.5945 2.25 11.197 2.35572 10.8459 2.55668C10.4948 2.75764 10.2024 3.04687 9.99749 3.39569L1.79905 17.6335C1.60193 17.9709 1.49805 18.3546 1.49805 18.7454C1.49805 19.1361 1.60193 19.5199 1.79905 19.8572C2.0013 20.2082 2.29327 20.499 2.64502 20.6998C2.99676 20.9006 3.3956 21.0043 3.80061 21.0001H20.1975C20.6022 21.0039 21.0006 20.9001 21.352 20.6993C21.7034 20.4985 21.9951 20.2079 22.1972 19.8572C22.3946 19.52 22.4988 19.1364 22.4991 18.7456C22.4995 18.3549 22.3959 17.9711 22.1991 17.6335ZM11.2491 9.75006C11.2491 9.55115 11.3281 9.36038 11.4687 9.21973C11.6094 9.07908 11.8001 9.00006 11.9991 9.00006C12.198 9.00006 12.3887 9.07908 12.5294 9.21973C12.67 9.36038 12.7491 9.55115 12.7491 9.75006V13.5001C12.7491 13.699 12.67 13.8897 12.5294 14.0304C12.3887 14.171 12.198 14.2501 11.9991 14.2501C11.8001 14.2501 11.6094 14.171 11.4687 14.0304C11.3281 13.8897 11.2491 13.699 11.2491 13.5001V9.75006ZM11.9991 18.0001C11.7765 18.0001 11.559 17.9341 11.374 17.8105C11.189 17.6868 11.0448 17.5111 10.9597 17.3056C10.8745 17.1 10.8523 16.8738 10.8957 16.6556C10.9391 16.4374 11.0462 16.2369 11.2036 16.0796C11.3609 15.9222 11.5613 15.8151 11.7796 15.7717C11.9978 15.7283 12.224 15.7505 12.4296 15.8357C12.6351 15.9208 12.8108 16.065 12.9345 16.25C13.0581 16.4351 13.1241 16.6526 13.1241 16.8751C13.1241 17.1734 13.0055 17.4596 12.7945 17.6706C12.5836 17.8815 12.2974 18.0001 11.9991 18.0001Z" fill="black"/>
</svg>
`
};

function isValidBlockchainAddress(text) {
  const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;
  const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  
  return ethereumRegex.test(text) || solanaRegex.test(text);
}

function validateAddress(text) {
  
  if (!isExtensionValid) {
    showNotification(false, "Error: Extension reloaded. Please refresh the page.");
    return;
  }

  if (!isValidBlockchainAddress(text)) {
    return;
  }

  try {
    chrome.runtime.sendMessage({ action: "validateAddress", address: text }, (response) => {
      if (chrome.runtime.lastError) {
        handleExtensionInvalidation();
        return;
      }
      
      if (!response.hasSavedAddresses) {
        return;
      }
      
      if (response.isValid) {
        showNotification(response.isMatched, response.addressType);
      } else {
        showNotification(false, "Unknown");
      }
    });
  } catch (error) {
    handleExtensionInvalidation();
  }
}

function handleExtensionInvalidation() {
  isExtensionValid = false;
  showNotification(false, "Error: Extension reloaded. Please refresh the page.");
}

function showNotification(isMatched, addressType) {
  const notification = document.createElement('div');
  notification.className = `crypto-address-notification ${isMatched ? 'matched' : 'not-matched'}`;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '8px';
  notification.style.zIndex = '9999';
  notification.style.textAlign = 'center';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  notification.style.opacity = '0';
  notification.style.transition = 'opacity 0.3s ease-in-out';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  
  let message;
  let icon;
  
  if (addressType.startsWith("Error:")) {
    message = addressType;
    icon = svgIcons.warning;
    notification.style.backgroundColor = '#FFB800'; // Orange for errors
    notification.style.color = '#000000'; // White text for errors
  } else if (!isMatched) {
    message = "No addresses matched";
    icon = svgIcons.warning;
    notification.style.backgroundColor = '#FFB800'; // Orange for unmatched addresses
    notification.style.color = '#000000';
  } else {
    message = `${addressType} address matched`;
    icon = svgIcons.checkmark;
    notification.style.backgroundColor = '#CCFF00'; // Orange for matched addresses
    notification.style.color = '#000000';
  }
  
  notification.innerHTML = `
    <span class="icon" style="display: inline-flex; margin-right: 8px;">${icon}</span>
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
  
  setTimeout(() => {
    const selection = document.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText) {
      validateAddress(selectedText);
    }
  }, 100);
}

function handleCustomCopy(event) {
  if (!isExtensionValid) return;
  
  if (event.data && event.data.type === 'CUSTOM_COPY') {
    validateAddress(event.data.text);
  }
}

document.addEventListener('copy', handleCopy);

const script = document.createElement('script');
script.src = chrome.runtime.getURL('contentScript.js');
(document.head || document.documentElement).appendChild(script);

window.addEventListener('message', handleCustomCopy);


setInterval(() => {
  if (!isExtensionValid) return;
  
  try {
    chrome.runtime.getURL('');
  } catch (error) {
    handleExtensionInvalidation();
  }
}, 5000);