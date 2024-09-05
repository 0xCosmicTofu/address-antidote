document.addEventListener('DOMContentLoaded', () => {
    const addressInput = document.getElementById('addressInput');
    const saveButton = document.getElementById('saveAddress');
    const savedAddressesDiv = document.getElementById('savedAddresses');
  
    loadSavedAddresses();
  
    saveButton.addEventListener('click', () => {
      const address = addressInput.value.trim();
      if (address) {
        chrome.storage.sync.get("savedAddresses", (data) => {
          const savedAddresses = data.savedAddresses || [];
          if (!savedAddresses.includes(address)) {
            savedAddresses.push(address);
            chrome.storage.sync.set({ savedAddresses }, () => {
              addressInput.value = '';
              loadSavedAddresses();
            });
          }
        });
      }
    });
  
    function loadSavedAddresses() {
      chrome.storage.sync.get("savedAddresses", (data) => {
        const savedAddresses = data.savedAddresses || [];
        savedAddressesDiv.innerHTML = '<h2>Saved Addresses:</h2>';
        savedAddresses.forEach(address => {
          savedAddressesDiv.innerHTML += `<p>${address}</p>`;
        });
      });
    }
  });