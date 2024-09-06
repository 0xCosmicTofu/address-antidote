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
  const notification = document.getElementById('notification');

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
              ${deleteIcon}
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

  function showNotification(message) {
    const notification = document.getElementById('notification');
    if (!notification) {
      const newNotification = document.createElement('div');
      newNotification.id = 'notification';
      newNotification.className = 'notification hidden';
      document.body.appendChild(newNotification);
    }
    
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;
    notificationElement.classList.remove('hidden');
    
    setTimeout(() => {
      notificationElement.classList.add('hidden');
    }, 3000); // Hide after 3 seconds
  }

  saveButton.addEventListener('click', function() {
    const address = addressInput.value.trim();
    if (address) {
      chrome.storage.sync.get(['savedAddresses'], function(result) {
        const savedAddresses = result.savedAddresses || [];
        if (savedAddresses.includes(address)) {
          showNotification('This address is already saved.');
        } else {
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

const deleteIcon = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.25 4.5H3.75C3.55109 4.5 3.36032 4.57902 3.21967 4.71967C3.07902 4.86032 3 5.05109 3 5.25C3 5.44891 3.07902 5.63968 3.21967 5.78033C3.36032 5.92098 3.55109 6 3.75 6H4.5V19.5C4.5 19.8978 4.65804 20.2794 4.93934 20.5607C5.22064 20.842 5.60218 21 6 21H18C18.3978 21 18.7794 20.842 19.0607 20.5607C19.342 20.2794 19.5 19.8978 19.5 19.5V6H20.25C20.4489 6 20.6397 5.92098 20.7803 5.78033C20.921 5.63968 21 5.44891 21 5.25C21 5.05109 20.921 4.86032 20.7803 4.71967C20.6397 4.57902 20.4489 4.5 20.25 4.5ZM18 19.5H6V6H18V19.5ZM7.5 2.25C7.5 2.05109 7.57902 1.86032 7.71967 1.71967C7.86032 1.57902 8.05109 1.5 8.25 1.5H15.75C15.9489 1.5 16.1397 1.57902 16.2803 1.71967C16.421 1.86032 16.5 2.05109 16.5 2.25C16.5 2.44891 16.421 2.63968 16.2803 2.78033C16.1397 2.92098 15.9489 3 15.75 3H8.25C8.05109 3 7.86032 2.92098 7.71967 2.78033C7.57902 2.63968 7.5 2.44891 7.5 2.25Z" fill="black"/>
</svg>

`;
