console.log("Background script loaded");

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ savedAddresses: [] }, () => {
    console.log("Initial empty address list saved");
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  if (request.action === "validateAddress") {
    chrome.storage.sync.get("savedAddresses", (data) => {
      const savedAddresses = data.savedAddresses || [];
      console.log("Saved addresses:", savedAddresses);
      
      const addressType = getAddressType(request.address);
      const isValid = addressType !== "Unknown";
      const isMatched = savedAddresses.includes(request.address);
      const hasSavedAddresses = savedAddresses.length > 0;
      
      console.log("Validation result:", { isValid, isMatched, addressType, hasSavedAddresses });
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