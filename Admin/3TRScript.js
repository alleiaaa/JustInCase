// Wait for DOM to fully load before running JavaScript
// 3TRScript.js - Transactions Script
document.addEventListener("DOMContentLoaded", () => {
    fetch('fragments.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            initializeSidebar();
            setActiveNavigation('Transactions'); // ← This makes Transactions active
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

function initializeTransactionPage() {
    // Transaction navigation tabs functionality
    const navItems = document.querySelectorAll('.transaction-nav-item');
    const transactionTable = document.querySelector('.transaction-table tbody');
    
    // Sample data for different tabs (in a real app, this would come from an API)
    const tabData = {
        active: [
            {
                id: 'TRX-001',
                user: 'Juan Dela Cruz',
                device: 'DEV-001',
                status: 'Available',
                pickup: '11:00 AM',
                due: '5:00 PM'
            },
            {
                id: 'TRX-002',
                user: 'Mang Kanor',
                device: 'DEV-002',
                status: 'In Use',
                pickup: '11:00 AM',
                due: '5:00 PM'
            }
        ],
        reservations: [
            {
                id: 'TRX-005',
                user: 'Reserved User',
                device: 'DEV-005',
                status: 'Reserved',
                pickup: 'Tomorrow 9:00 AM',
                due: 'Tomorrow 3:00 PM'
            }
        ],
        history: [
            {
                id: 'TRX-006',
                user: 'Past User',
                device: 'DEV-006',
                status: 'Returned',
                pickup: 'May 20, 11:00 AM',
                due: 'May 20, 5:00 PM',
                returned: 'May 20, 4:30 PM'
            },
            {
                id: 'TRX-007',
                user: 'Another User',
                device: 'DEV-007',
                status: 'Cancelled',
                pickup: 'May 18, 10:00 AM',
                due: 'May 18, 4:00 PM',
                returned: 'Cancelled'
            }
        ]
    };

    // Function to render table rows based on data
    function renderTableRows(data) {
        transactionTable.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Determine status class based on status text
            let statusClass = 'status-available';
            if (item.status === 'In Use') statusClass = 'status-in-use';
            else if (item.status === 'Maintenance') statusClass = 'status-maintenance';
            else if (item.status === 'Unavailable') statusClass = 'status-unavailable';
            else if (item.status === 'Reserved') statusClass = 'status-reserved';
            else if (item.status === 'Returned') statusClass = 'status-returned';
            else if (item.status === 'Cancelled') statusClass = 'status-cancelled';
            
            row.innerHTML = `
                <td class="transaction-id">${item.id}</td>
                <td>${item.user}</td>
                <td>${item.device}</td>
                <td><span class="status-pill ${statusClass}">${item.status}</span></td>
                <td>${item.pickup}</td>
                <td>${item.due}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-button edit"><i class="fas fa-edit"></i></button>
                        <button class="action-button delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            `;
            
            transactionTable.appendChild(row);
        });
        
        // Re-attach event listeners to the new buttons
        attachButtonListeners();
    }

    // Function to show tab content
    function showTabContent(tabName) {
        // In a real app, you would fetch this data from an API
        const data = tabData[tabName] || [];
        renderTableRows(data);
    }

    // Add click handlers to nav items
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all tabs
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show the appropriate content
            const tabName = this.textContent.trim().toLowerCase().split(' ')[0];
            showTabContent(tabName);
        });
    });

    // ... (keep all the existing code until the attachButtonListeners function)

    // Function to attach event listeners to action buttons
    function attachButtonListeners() {
        // Edit buttons functionality
        const editButtons = document.querySelectorAll('.action-button.edit');
        editButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const transactionId = row.querySelector('.transaction-id').textContent;
                const user = row.cells[1].textContent;
                const deviceId = row.cells[2].textContent;
                const status = row.cells[3].textContent;
                const pickupTime = row.cells[4].textContent;
                const dueTime = row.cells[5].textContent;
                
                showEditModal({
                    transactionId,
                    user,
                    deviceId,
                    status,
                    pickupTime,
                    dueTime
                });
            });
        });

        // Delete buttons functionality
        const deleteButtons = document.querySelectorAll('.action-button.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const transactionId = row.querySelector('.transaction-id').textContent;
                const user = row.cells[1].textContent;
                const deviceId = row.cells[2].textContent;
                
                showDeleteConfirmation({
                    transactionId,
                    user,
                    deviceId
                }, () => {
                    // This is the callback that runs when deletion is confirmed
                    row.remove();
                    console.log(`Deleted transaction: ${transactionId}`);
                });
            });
        });

        // Row click handler (optional - for viewing details)
        const rows = document.querySelectorAll('.transaction-table tbody tr');
        rows.forEach(row => {
            row.addEventListener('click', function(e) {
                // Don't trigger if clicking on action buttons
                if (!e.target.closest('.action-buttons')) {
                    const transactionId = row.querySelector('.transaction-id').textContent;
                    console.log(`View details for transaction: ${transactionId}`);
                    // Here you could open a details view/modal
                }
            });
        });
    }

    // Function to show edit modal
    function showEditModal(transactionData) {
        const modalHTML = `
            <div class="modal-overlay active" id="edit-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Edit Transaction</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-transaction-form">
                            <div class="modal-form-group">
                                <label for="transaction-id">Transaction ID</label>
                                <input type="text" id="transaction-id" class="modal-form-control" value="${transactionData.transactionId}" readonly>
                            </div>
                            <div class="modal-form-group">
                                <label for="user">User</label>
                                <input type="text" id="user" class="modal-form-control" value="${transactionData.user}">
                            </div>
                            <div class="modal-form-group">
                                <label for="device-id">Device ID</label>
                                <input type="text" id="device-id" class="modal-form-control" value="${transactionData.deviceId}">
                            </div>
                            <div class="modal-form-group">
                                <label for="status">Status</label>
                                <select id="status" class="modal-form-control">
                                    <option value="Available" ${transactionData.status === 'Available' ? 'selected' : ''}>Available</option>
                                    <option value="In Use" ${transactionData.status === 'In Use' ? 'selected' : ''}>In Use</option>
                                    <option value="Maintenance" ${transactionData.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                                    <option value="Unavailable" ${transactionData.status === 'Unavailable' ? 'selected' : ''}>Unavailable</option>
                                    <option value="Reserved" ${transactionData.status === 'Reserved' ? 'selected' : ''}>Reserved</option>
                                </select>
                            </div>
                            <div class="modal-form-group">
                                <label for="pickup-time">Pickup Time</label>
                                <input type="text" id="pickup-time" class="modal-form-control" value="${transactionData.pickupTime}">
                            </div>
                            <div class="modal-form-group">
                                <label for="due-time">Due Time</label>
                                <input type="text" id="due-time" class="modal-form-control" value="${transactionData.dueTime}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-button modal-button-cancel">Cancel</button>
                        <button class="modal-button modal-button-confirm">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('edit-modal');
        const closeButton = modal.querySelector('.modal-close');
        const cancelButton = modal.querySelector('.modal-button-cancel');
        const confirmButton = modal.querySelector('.modal-button-confirm');
        
        function closeModal() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        
        closeButton.addEventListener('click', closeModal);
        cancelButton.addEventListener('click', closeModal);
        
        confirmButton.addEventListener('click', () => {
            // Here you would typically send the updated data to your backend
            console.log('Saving changes for transaction:', transactionData.transactionId);
            alert('Changes saved successfully!');
            closeModal();
            
            // In a real app, you would update the table row with the new data
            // after receiving confirmation from the backend
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Function to show delete confirmation modal
    function showDeleteConfirmation(transactionData, onConfirm) {
        const modalHTML = `
            <div class="modal-overlay active" id="delete-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Delete Transaction</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="delete-confirmation-icon">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <div class="delete-confirmation-message">
                            Are you sure you want to delete this transaction? This action cannot be undone.
                        </div>
                        <div class="delete-confirmation-details">
                            <p><strong>Transaction ID:</strong> ${transactionData.transactionId}</p>
                            <p><strong>User:</strong> ${transactionData.user}</p>
                            <p><strong>Device ID:</strong> ${transactionData.deviceId}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-button modal-button-cancel">Cancel</button>
                        <button class="modal-button modal-button-delete">Delete</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add Font Awesome for the icon (if not already loaded)
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
            document.head.appendChild(faLink);
        }
        
        const modal = document.getElementById('delete-modal');
        const closeButton = modal.querySelector('.modal-close');
        const cancelButton = modal.querySelector('.modal-button-cancel');
        const deleteButton = modal.querySelector('.modal-button-delete');
        
        function closeModal() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        
        closeButton.addEventListener('click', closeModal);
        cancelButton.addEventListener('click', closeModal);
        
        deleteButton.addEventListener('click', () => {
            onConfirm();
            closeModal();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Initialize with the active tab content
    showTabContent('active');
    
    // Add hover effect to table rows for better UX
    document.querySelector('.transaction-table').addEventListener('mouseover', function(e) {
        const row = e.target.closest('tr');
        if (row && row.parentNode === transactionTable) {
            row.style.backgroundColor = '#f5f7fe';
        }
    });
    
    document.querySelector('.transaction-table').addEventListener('mouseout', function(e) {
        const row = e.target.closest('tr');
        if (row && row.parentNode === transactionTable) {
            row.style.backgroundColor = '';
        }
    });
}