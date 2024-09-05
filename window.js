document.addEventListener('DOMContentLoaded', function() {
  const addressInput = document.getElementById('addressInput');
  const saveButton = document.getElementById('saveButton');
  const savedAddresses = document.getElementById('savedAddresses');
  const savedAddressesList = document.getElementById('savedAddressesList');

  function isValidEthereumAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  function isValidSolanaAddress(address) {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }

  function getAddressType(address) {
    if (isValidEthereumAddress(address)) return 'Ethereum';
    if (isValidSolanaAddress(address)) return 'Solana';
    return 'Unknown';
  }

  function displaySavedAddresses() {
    chrome.storage.sync.get(['savedAddresses'], function(result) {
      const addresses = result.savedAddresses || [];
      if (addresses.length > 0) {
        savedAddresses.style.display = 'block';
        savedAddressesList.innerHTML = '';
        addresses.forEach(function(address) {
          const li = document.createElement('li');
          li.className = 'address-item';
          const addressType = getAddressType(address);
          li.innerHTML = `
            <div class="address-tag ${addressType.toLowerCase()}-tag">${addressType}</div>
            <div class="address-line">
              <span class="wallet-address">${address}</span>
              <button class="delete-button" data-address="${address}">Delete</button>
            </div>
          `;
          savedAddressesList.appendChild(li);
        });
        addDeleteListeners();
      } else {
        savedAddresses.style.display = 'none';
      }
    });
  }

  function addDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
        const addressToDelete = this.getAttribute('data-address');
        deleteAddress(addressToDelete);
      });
    });
  }

  function deleteAddress(addressToDelete) {
    chrome.storage.sync.get(['savedAddresses'], function(result) {
      let savedAddresses = result.savedAddresses || [];
      savedAddresses = savedAddresses.filter(address => address !== addressToDelete);
      chrome.storage.sync.set({savedAddresses: savedAddresses}, function() {
        displaySavedAddresses();
      });
    });
  }

  saveButton.addEventListener('click', function() {
    const address = addressInput.value.trim();
    if (address) {
      chrome.storage.sync.get(['savedAddresses'], function(result) {
        const savedAddresses = result.savedAddresses || [];
        if (!savedAddresses.includes(address)) {
          savedAddresses.push(address);
          chrome.storage.sync.set({savedAddresses: savedAddresses}, function() {
            addressInput.value = '';
            displaySavedAddresses();
          });
        }
      });
    }
  });

  displaySavedAddresses();
});
