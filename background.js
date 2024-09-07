/* Address Antidote - Version 1.0 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ savedAddresses: [] }, () => {
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "validateAddress") {
    chrome.storage.sync.get("savedAddresses", (data) => {
      const savedAddresses = data.savedAddresses || [];
      
      const addressType = getAddressType(request.address);
      const isValid = addressType !== "Unknown";
      const isMatched = savedAddresses.includes(request.address);
      const hasSavedAddresses = savedAddresses.length > 0;
      
      sendResponse({ isValid, isMatched, addressType, hasSavedAddresses });
    });
    return true;
  }
});

function getAddressType(address) {
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return "Ethereum";
  } else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return "Solana";
  }
  return "Unknown";
}

chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create({
    url: chrome.runtime.getURL("window.html"),
    type: "popup",
    width: 400,
    height: 600
  });
});