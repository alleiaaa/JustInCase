document.addEventListener("DOMContentLoaded", () => {
    // Load sidebar
    fetch('fragments.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            initializeSidebar();
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
        });

    // Initialize tabs with filtering
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterTableRows(filter);
        });
    });

    // Filter table rows based on status
    function filterTableRows(filter) {
        const rows = document.querySelectorAll('.returns-table tbody tr');
        
        rows.forEach(row => {
            const statusBadge = row.querySelector('.status-badge');
            const status = statusBadge ? statusBadge.textContent.trim() : '';
            
            if (filter === 'All') {
                row.style.display = '';
            } else {
                row.style.display = status === filter ? '' : 'none';
            }
        });
        
        // Update tab counts (example - you would replace with real data)
        updateTabCounts();
    }

    // Example function to update tab counts
    function updateTabCounts() {
        const counts = {
            overdue: document.querySelectorAll('.status-badge.status-overdue').length,
            pending: document.querySelectorAll('.status-badge.status-pending').length
        };
        
        document.querySelector('.tab[data-filter="Overdue"] .tab-count').textContent = counts.overdue;
        document.querySelector('.tab[data-filter="Pending"] .tab-count').textContent = counts.pending;
    }

    // Initialize modals with new structure
        const editModal = document.getElementById('edit-modal');
        const deleteModal = document.getElementById('delete-modal');
        const closeButtons = document.querySelectorAll('.modal-close, .modal-button-cancel');

        // Show modal function
        function showModal(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Hide modal function
        function hideModal(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Edit functionality
        document.querySelectorAll('.edit-icon').forEach(icon => {
            icon.addEventListener('click', function(e) {
                const row = e.target.closest('tr');
                const cells = row.querySelectorAll('td');
                
                document.getElementById('edit-student-id').value = cells[0].textContent;
                document.getElementById('edit-student-name').value = cells[1].textContent;
                document.getElementById('edit-device-id').value = cells[2].textContent;
                
                // Format date for input
                const checkoutDate = new Date(cells[3].textContent);
                document.getElementById('edit-checkout-date').valueAsDate = checkoutDate;
                
                // Format time for input
                const timeParts = cells[4].textContent.split(' ');
                const [hours, minutes] = timeParts[0].split(':');
                const period = timeParts[1];
                let hours24 = period === 'PM' ? parseInt(hours) + 12 : hours;
                if (hours24 === 24) hours24 = 12;
                if (period === 'AM' && hours === '12') hours24 = 0;
                
                document.getElementById('edit-due-time').value = `${hours24.toString().padStart(2, '0')}:${minutes}`;
                
                // Set status
                const status = cells[6].querySelector('.status-badge').textContent;
                document.getElementById('edit-status').value = status;
                
                showModal(editModal);
            });
        });

        // Delete functionality
        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', function(e) {
                const row = e.target.closest('tr');
                const cells = row.querySelectorAll('td');
                
                document.getElementById('delete-student-id').textContent = cells[0].textContent;
                document.getElementById('delete-student-name').textContent = cells[1].textContent;
                document.getElementById('delete-device-id').textContent = cells[2].textContent;
                
                showModal(deleteModal);
                deleteModal.dataset.row = row.rowIndex;
            });
        });

        // Close modals
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal-overlay');
                hideModal(modal);
            });
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    hideModal(this);
                }
            });
        });

        // Save edit form
        document.getElementById('edit-form').addEventListener('submit', function(e) {
            e.preventDefault(); 
        
        const studentId = document.getElementById('edit-student-id').value;
        const studentName = document.getElementById('edit-student-name').value;
        const deviceId = document.getElementById('edit-device-id').value;
        const checkoutDate = document.getElementById('edit-checkout-date').valueAsDate;
        const dueTime = document.getElementById('edit-due-time').value;
        const status = document.getElementById('edit-status').value;
        
        // Format date
        const formattedDate = checkoutDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Format time
        const [hours, minutes] = dueTime.split(':');
        let hours12 = hours % 12 || 12;
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours12}:${minutes} ${period}`;
        
        // Find and update the row
        document.querySelectorAll(`.student-id`).forEach(cell => {
            if (cell.textContent === studentId) {
                const row = cell.closest('tr');
                row.querySelector('td:nth-child(2)').textContent = studentName;
                row.querySelector('td:nth-child(3)').textContent = deviceId;
                row.querySelector('td:nth-child(4)').textContent = formattedDate;
                row.querySelector('td:nth-child(5)').textContent = formattedTime;
                
                // Update status
                const statusBadge = row.querySelector('.status-badge');
                statusBadge.textContent = status;
                statusBadge.className = 'status-badge'; // Reset classes
                
                if (status === 'Overdue') {
                    statusBadge.classList.add('status-overdue');
                } else if (status === 'Pending') {
                    statusBadge.classList.add('status-pending');
                } else if (status === 'Resolved') {
                    statusBadge.classList.add('status-resolved');
                }
            }
        });
        
        editModal.style.display = 'none';
        updateTabCounts(); // Update counts after edit
    });
    

            // Confirm deletion
            document.querySelector('.confirm-delete-btn').addEventListener('click', function() {
                const rowIndex = deleteModal.dataset.row;
                const table = document.querySelector('.returns-table');
                
                if (table && rowIndex) {
                    table.deleteRow(rowIndex);
                }
                
                hideModal(deleteModal);
                updateTabCounts();
            });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
    
    // Search functionality
    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('.returns-table tbody tr');
        
        rows.forEach(row => {
            if (row.style.display === 'none') return; // Skip hidden rows
            
            let found = false;
            const cells = row.querySelectorAll('td');
            
            cells.forEach(cell => {
                if (cell.textContent.toLowerCase().includes(searchTerm)) {
                    found = true;
                }
            });
            
            row.style.display = found ? '' : 'none';
        });
    });
});

function initializeSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    if (menuToggle && sidebar && mainContent) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('shifted');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    mainContent.classList.remove('shifted');
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('shifted');
            }
        });
    }
}