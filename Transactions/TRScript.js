// Wait for DOM to fully load before running JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const menuToggle = document.getElementById('menu-toggle');
    
    // Sidebar toggle functionality
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('shifted');
    });
    
    // Default to showing sidebar on larger screens
    function checkWindowSize() {
        if (window.innerWidth > 992) {
            sidebar.classList.add('active');
            mainContent.classList.add('shifted');
        } else {
            sidebar.classList.remove('active');
            mainContent.classList.remove('shifted');
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
});