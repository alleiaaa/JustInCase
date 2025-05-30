// Load sidebar dynamically from fragments.html
// 5ASScript.js - Account Settings Script
document.addEventListener("DOMContentLoaded", () => {
    fetch('fragments.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            initializeSidebar();
            setActiveNavigation('Account Settings'); // ← This makes Account Settings active
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

// Edit profile modal functionality
const editBtn = document.getElementById('edit-profile-btn');
const modal = document.getElementById('edit-modal');
const cancelBtn = document.getElementById('cancel-edit');
const form = document.getElementById('edit-form');

editBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('first-name').value;
    const middleName = document.getElementById('middle-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const program = document.getElementById('program').value;
    const room = document.getElementById('room').value;

    // Update profile display
    document.querySelector('.profile-name').textContent = `${firstName} ${lastName}`;
    document.querySelector('.profile-department').textContent = program;
    
    // Update info grid
    const infoValues = document.querySelectorAll('.info-value');
    infoValues[0].textContent = firstName;
    infoValues[1].textContent = middleName || 'N/A';
    infoValues[2].textContent = lastName;
    infoValues[3].textContent = email;
    infoValues[4].textContent = program;
    infoValues[5].textContent = room;

    // Close modal
    modal.style.display = 'none';
    
    // Show success message (optional)
    alert('Profile updated successfully!');
});