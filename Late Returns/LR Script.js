document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const menuToggle = document.createElement('button');
    
    
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.style.display = 'none';
    menuToggle.style.position = 'fixed';
    menuToggle.style.top = '15px';
    menuToggle.style.left = '15px';
    menuToggle.style.zIndex = '1001';
    menuToggle.style.backgroundColor = '#0066ff';
    menuToggle.style.color = 'white';
    menuToggle.style.border = 'none';
    menuToggle.style.borderRadius = '5px';
    menuToggle.style.padding = '8px 12px';
    menuToggle.style.cursor = 'pointer';
    menuToggle.style.fontSize = '18px';
    
    document.body.appendChild(menuToggle);
    
    
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('shifted');
    }
    
    menuToggle.addEventListener('click', toggleSidebar);
    
    // TAB
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            
            tabs.forEach(t => t.classList.remove('active'));
            
            
            this.classList.add('active');
            
            let tabName = this.textContent.split(' ')[0];
            if (tabName.includes('Current')) {
                tabName = 'Current Overdue';
            }
        });
    });
    
    const editIcons = document.querySelectorAll('.edit-icon');
    const deleteIcons = document.querySelectorAll('.delete-icon');
    
    editIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            const studentId = row.querySelector('.student-id').textContent;
            alert(`Edit record for student: ${studentId}`);
        });
    });
    
    deleteIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            const studentId = row.querySelector('.student-id').textContent;
            if (confirm(`Are you sure you want to delete record for student: ${studentId}?`)) {
                row.remove();
            }
        });
    });
    
    const searchBar = document.querySelector('.search-bar');
    
    searchBar.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const tableRows = document.querySelectorAll('.returns-table tbody tr');
        
        tableRows.forEach(row => {
            let found = false;
            const cells = row.querySelectorAll('td');
            
            cells.forEach(cell => {
                if (cell.textContent.toLowerCase().includes(searchTerm)) {
                    found = true;
                }
            });
            
            if (found) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    function checkWindowSize() {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
            mainContent.classList.remove('shifted');
            menuToggle.style.display = 'block';
        } else {
            sidebar.classList.add('active');
            mainContent.classList.add('shifted');
            menuToggle.style.display = 'none';
        }
    }
    
    checkWindowSize();
    
    window.addEventListener('resize', checkWindowSize);
    
    const table = document.querySelector('.returns-table');
    
    function makeTableResponsive() {
        if (window.innerWidth < 768) {
            table.style.display = 'block';
            table.style.overflowX = 'auto';
        } else {
            table.style.display = '';
            table.style.overflowX = '';
        }
    }
    
    makeTableResponsive();
    
    window.addEventListener('resize', makeTableResponsive);
});