// Load sidebar dynamically from fragments.html
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