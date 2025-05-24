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

  // Function to set active menu item based on URL
  function setActiveMenuItem() {
    const menuItems = document.querySelectorAll('.menu-item');
    const currentPage = window.location.pathname.split("/").pop().split('.')[0].toLowerCase();

    menuItems.forEach(item => {
      item.classList.remove('active');
      const itemText = item.textContent.trim().toLowerCase().replace(/\s+/g, '');

      if (itemText.includes(currentPage)) {
        item.classList.add('active');
      }
    });
  }

  // Initial active menu item based on URL
  setActiveMenuItem();

  // Add click listeners to menu items to update active class dynamically
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

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
