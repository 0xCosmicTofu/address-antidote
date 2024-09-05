function handleScroll() {
  const stickyContainer = document.querySelector('.sticky-container');
  if (window.scrollY > 0) {
    stickyContainer.classList.add('scrolled');
  } else {
    stickyContainer.classList.remove('scrolled');
  }
}

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

  const tabButtons = document.querySelectorAll('.tab-button');
  const tabSlider = document.querySelector('.tab-slider');
  let currentFilter = 'all';

  function updateTabSlider(button) {
    const index = Array.from(tabButtons).indexOf(button);
    tabSlider.style.transform = `translateX(${index * 100}%)`;
  }

  function filterAddresses() {
    const addresses = document.querySelectorAll('.address-item');
    addresses.forEach(address => {
      const addressType = address.querySelector('.address-tag').textContent.toLowerCase();
      if (currentFilter === 'all' || addressType === currentFilter) {
        address.style.display = '';
      } else {
        address.style.display = 'none';
      }
    });
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      updateTabSlider(this);
      filterAddresses();
    });
  });

  // Initialize slider position
  updateTabSlider(document.querySelector('.tab-button.active'));

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
          const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
          li.innerHTML = `
            <div class="address-content">
              <span class="wallet-address" title="${address}">${shortAddress}</span>
              <span class="address-tag ${addressType.toLowerCase()}-tag">${addressType}</span>
            </div>
            <button class="delete-button" data-address="${address}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          `;
          savedAddressesList.appendChild(li);
        });
        addDeleteListeners();
        filterAddresses();
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

  window.addEventListener('scroll', handleScroll);
});
