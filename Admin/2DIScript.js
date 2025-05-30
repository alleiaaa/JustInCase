document.addEventListener("DOMContentLoaded", () => {
    fetch('fragments.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            initializeSidebar();
            setActiveNavigation('Device Inventory'); // Set active for Device Inventory
            initializeModals();
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
        });
});
// SHARED FUNCTION - Add this to each script file
function setActiveNavigation(pageName) {
    // Remove any existing active classes
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    // Find and activate the corresponding menu item
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        const linkText = link.textContent.trim();
        
        if (linkText.includes(pageName)) {
            const menuItem = link.closest('.menu-item');
            if (menuItem) {
                menuItem.classList.add('active');
            }
        }
    });
}

function initializeSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    if (menuToggle && sidebar && mainContent) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('shifted');
        });

        document.addEventListener('click', e => {
            const isClickInside = sidebar.contains(e.target) || menuToggle.contains(e.target);
            if (!isClickInside || e.target.closest('.menu-item')) {
                sidebar.classList.remove('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    mainContent.classList.remove('shifted');
                }
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('shifted');
            }
        });
    }
}

  // Device Inventory page row hover effect
  if (document.body.id === 'device-inventory-page') {
    const tableRows = document.querySelectorAll('.inventory-table tbody tr');
    tableRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = '#f8fafc';
      });
      row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = '';
      });
    });
  }

  // Updated Device Functions to use fragments templates

// Add Device Function
function addDevice() {
    const template = document.getElementById('device-modal-template');
    if (!template) {
        console.error('Modal template not found');
        return;
    }
    
    const modal = template.cloneNode(true);
    modal.id = 'active-modal';
    modal.style.display = 'block';
    
    // Set modal title
    modal.querySelector('#modal-title').textContent = 'Add New Device';
    modal.querySelector('.submit-btn').textContent = 'Add Device';
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('.device-form');
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    form.addEventListener('submit', submitNewDevice);
    
    // Close modal when clicking overlay
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    document.body.appendChild(modal);
}

// Submit new device function
function submitNewDevice(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const deviceData = {
        name: formData.get('deviceName'),
        type: formData.get('deviceType'),
        specs: formData.get('deviceSpecs'),
        status: formData.get('deviceStatus')
    };
    
    // Generate new device ID
    const existingRows = document.querySelectorAll('#device-inventory-table tbody tr');
    const deviceId = `DEV-${String(existingRows.length + 1).padStart(3, '0')}`;
    
    // Create new table row
    const newRow = createDeviceRow(deviceId, deviceData);
    
    // Add to table
    const tableBody = document.querySelector('#device-inventory-table tbody');
    tableBody.appendChild(newRow);
    
    // Close modal
    closeModal();
    
    // Show success message
    showNotification('Device added successfully!', 'success');
}

// Edit Device Function - FIXED for removed serial number column
function editDevice(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');
    
    // Extract current data (updated indices after removing serial number column)
    const deviceId = cells[0].textContent;
    const deviceName = cells[1].querySelector('.device-name').textContent;
    const deviceSpecs = cells[1].querySelector('.device-specs').textContent;
    const deviceType = cells[2].textContent;
    const currentStatus = cells[3].querySelector('.status-badge').textContent; // Updated index
    
    const template = document.getElementById('device-modal-template');
    if (!template) {
        console.error('Modal template not found');
        return;
    }
    
    const modal = template.cloneNode(true);
    modal.id = 'active-modal';
    modal.style.display = 'block';
    
    // Set modal title and button text
    modal.querySelector('#modal-title').textContent = `Edit Device - ${deviceId}`;
    modal.querySelector('.submit-btn').textContent = 'Update Device';
    
    // Pre-fill form with current data (removed serial number field)
    modal.querySelector('#deviceName').value = deviceName;
    modal.querySelector('#deviceType').value = deviceType;
    modal.querySelector('#deviceSpecs').value = deviceSpecs === 'No specs provided' ? '' : deviceSpecs;
    modal.querySelector('#deviceStatus').value = currentStatus;
    
    // Hide serial number field if it exists in the modal
    const serialNumberField = modal.querySelector('#serialNumber');
    if (serialNumberField) {
        const serialNumberContainer = serialNumberField.closest('.form-group');
        if (serialNumberContainer) {
            serialNumberContainer.style.display = 'none';
        }
    }
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('.device-form');
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    form.addEventListener('submit', function(e) {
        submitEditDevice(e, deviceId);
    });
    
    // Close modal when clicking overlay
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    document.body.appendChild(modal);
}

// Submit edit device function - FIXED for removed serial number column
function submitEditDevice(event, deviceId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const deviceData = {
        name: formData.get('deviceName'),
        type: formData.get('deviceType'),
        specs: formData.get('deviceSpecs'),
        status: formData.get('deviceStatus')
    };
    
    // Find the row to update
    const rows = document.querySelectorAll('#device-inventory-table tbody tr');
    const targetRow = Array.from(rows).find(row => 
        row.querySelector('td').textContent === deviceId
    );
    
    if (targetRow) {
        const cells = targetRow.querySelectorAll('td');
        const deviceIcon = deviceData.type.charAt(0).toUpperCase();
        const statusClass = `status-${deviceData.status.toLowerCase().replace(' ', '-')}`;
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Update the row content (updated indices after removing serial number column)
        cells[1].innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="device-img">${deviceIcon}</div>
                <div>
                    <div class="device-name">${deviceData.name}</div>
                    <div class="device-specs">${deviceData.specs || 'No specs provided'}</div>
                </div>
            </div>
        `;
        cells[2].textContent = deviceData.type;
        cells[3].innerHTML = `<span class="status-badge ${statusClass}">${deviceData.status}</span>`;
        cells[4].textContent = currentDate; // Last Maintained (updated index)
        cells[5].textContent = currentDate; // Last Updated (updated index)
    }
    
    closeModal();
    showNotification('Device updated successfully!', 'success');
}

// Delete Device Function
function deleteDevice(button) {
    const row = button.closest('tr');
    const deviceId = row.querySelector('td').textContent;
    const deviceName = row.querySelector('.device-name').textContent;
    
    const template = document.getElementById('delete-modal-template');
    if (!template) {
        console.error('Delete modal template not found');
        return;
    }
    
    const modal = template.cloneNode(true);
    modal.id = 'active-modal';
    modal.style.display = 'block';
    
    // Fill in device information
    modal.querySelector('#delete-device-id').textContent = deviceId;
    modal.querySelector('#delete-device-name').textContent = deviceName;
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const deleteBtn = modal.querySelector('.delete-confirm-btn');
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    deleteBtn.addEventListener('click', function() {
        confirmDelete(deviceId);
    });
    
    // Close modal when clicking overlay
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    document.body.appendChild(modal);
}

// Confirm delete function
function confirmDelete(deviceId) {
    const rows = document.querySelectorAll('#device-inventory-table tbody tr');
    const targetRow = Array.from(rows).find(row => 
        row.querySelector('td').textContent === deviceId
    );
    
    if (targetRow) {
        targetRow.remove();
        closeModal();
        showNotification('Device deleted successfully!', 'success');
    }
}

// Create device row function - FIXED for removed serial number column
function createDeviceRow(deviceId, deviceData) {
    const row = document.createElement('tr');
    const deviceIcon = deviceData.type.charAt(0).toUpperCase();
    const statusClass = `status-${deviceData.status.toLowerCase().replace(' ', '-')}`;
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Updated row HTML without serial number column
    row.innerHTML = `
        <td>${deviceId}</td>
        <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="device-img">${deviceIcon}</div>
                <div>
                    <div class="device-name">${deviceData.name}</div>
                    <div class="device-specs">${deviceData.specs || 'No specs provided'}</div>
                </div>
            </div>
        </td>
        <td>${deviceData.type}</td>
        <td><span class="status-badge ${statusClass}">${deviceData.status}</span></td>
        <td>${currentDate}</td>
        <td>${currentDate}</td>
        <td>
            <div class="action-buttons">
                <button class="action-button" onclick="editDevice(this)"><i class="fas fa-edit"></i></button>
                <button class="action-button delete-button" onclick="deleteDevice(this)"><i class="fas fa-trash"></i></button>
            </div>
        </td>
    `;
    
    return row;
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('active-modal');
    if (modal) {
        modal.remove();
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for fragments to load first
    setTimeout(() => {
        // Add event listener to the Add Device button
        const addButton = document.querySelector('.add-button');
        if (addButton) {
            addButton.addEventListener('click', addDevice);
        }
        
        // Add event listeners to existing edit and delete buttons
        const editButtons = document.querySelectorAll('.action-button:not(.delete-button)');
        const deleteButtons = document.querySelectorAll('.delete-button');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                editDevice(this);
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                deleteDevice(this);
            });
        });
    }, 100); // Small delay to ensure fragments are loaded
});