console.log("Background script loaded");

const initialAddresses = [
  "FoAQ4pZiSDNyn7xtgL1LmpaZAvyTNZEKXHsYsxfEjuH1",  // Solana address
  "0x3b3496De6dd5A12a3FAc430fAB1cbB68FaE5eFc8"     // Ethereum address
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ savedAddresses: initialAddresses }, () => {
    console.log("Initial addresses saved:", initialAddresses);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  if (request.action === "validateAddress") {
    chrome.storage.sync.get("savedAddresses", (data) => {
      const savedAddresses = data.savedAddresses || [];
      console.log("Saved addresses:", savedAddresses);
      const isValid = savedAddresses.includes(request.address);
      const addressType = getAddressType(request.address);
      console.log("Validation result:", { isValid, addressType });
      sendResponse({ isValid, addressType });
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