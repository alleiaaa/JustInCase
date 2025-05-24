// Wait for DOM to fully load before running JavaScript
document.addEventListener("DOMContentLoaded", () => {
    fetch('fragments.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            initializeSidebar();
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
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
    
    // Run on page load
    checkWindowSize();
    
    // Run whenever window resizes
    window.addEventListener('resize', checkWindowSize);
    
    // Transaction navigation tabs functionality
    const navItems = document.querySelectorAll('.transaction-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all tabs
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Here you could add code to show/hide different content based on the selected tab
            // For example:
            // const tabName = this.textContent.trim().split(' ')[0].toLowerCase();
            // showTabContent(tabName);
        });
    });
    
    // Add hover effect to table rows for better UX
    const tableRows = document.querySelectorAll('.transaction-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f5f7fe';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    // Action buttons functionality (Edit and Delete)
    const editButtons = document.querySelectorAll('.action-button.edit');
    const deleteButtons = document.querySelectorAll('.action-button.delete');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the transaction ID from the row
            const row = this.closest('tr');
            const transactionId = row.querySelector('.transaction-id').textContent;
            
            // For demonstration purposes, just log the action
            console.log(`Edit transaction: ${transactionId}`);
            
            // Here you could add code to open an edit modal/form
            // or navigate to an edit page with the transaction ID
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the transaction ID from the row
            const row = this.closest('tr');
            const transactionId = row.querySelector('.transaction-id').textContent;
            
            // For demonstration purposes, just log the action
            console.log(`Delete transaction: ${transactionId}`);
            
            // Here you could add code to show a confirmation dialog
            // and then perform the delete operation if confirmed
        });
    });