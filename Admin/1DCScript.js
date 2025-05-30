// 1DCScript.js - Cleaned version (no delete button, no auto modal popup)

// Load sidebar dynamically from fragments.html
document.addEventListener("DOMContentLoaded", () => {
    fetch('fragments.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            initializeSidebar();
            setActiveNavigation('Device Catalog'); // Set active for Device Catalog
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

function initializeModals() {
    const filterButtons = document.querySelectorAll('.add-button');
    const deviceCards = document.querySelectorAll('.device-card');

    // FILTER BUTTON FUNCTIONALITY
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter.toLowerCase();

            deviceCards.forEach(card => {
                const availabilityElement = card.querySelector('.availability');
                if (availabilityElement) {
                    const availabilityText = availabilityElement.textContent.toLowerCase();
                    if (filter === 'all' ||
                        (filter === 'available' && availabilityText === 'available') ||
                        (filter === 'unavailable' && availabilityText === 'unavailable')) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    
    // SEARCH FUNCTIONALITY
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            deviceCards.forEach(card => {
                const deviceName = card.querySelector('.device-name').textContent.toLowerCase();
                const specs = Array.from(card.querySelectorAll('.device-specs li'))
                    .map(spec => spec.textContent.toLowerCase())
                    .join(' ');

                if (deviceName.includes(searchTerm) || specs.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // DROPDOWN FILTER FUNCTIONALITY
    const typeFilter = document.querySelector('.filter-dropdown:first-child');
    const statusFilter = document.querySelector('.filter-dropdown:last-child');

    function applyFilters() {
        const selectedType = typeFilter ? typeFilter.value.toLowerCase() : 'all types';
        const selectedStatus = statusFilter ? statusFilter.value.toLowerCase() : 'all';

        deviceCards.forEach(card => {
            const deviceImage = card.querySelector('.device-image div').textContent.toLowerCase();
            const availability = card.querySelector('.availability').textContent.toLowerCase();

            let showCard = true;

            if (selectedType !== 'all types') {
                if (selectedType === 'laptops' && !deviceImage.includes('laptop')) showCard = false;
                if (selectedType === 'tablets' && !deviceImage.includes('tablet')) showCard = false;
                if (selectedType === 'phones' && !deviceImage.includes('phone')) showCard = false;
            }

            if (selectedStatus !== 'all') {
                if (selectedStatus === 'available' && availability !== 'available') showCard = false;
                if (selectedStatus === 'checked out' && availability !== 'checked out') showCard = false;
            }

            card.style.display = showCard ? 'flex' : 'none';
        });
    }

    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);

    // EDIT MODAL FUNCTIONALITY
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const cancelButtons = document.querySelectorAll('.modal-button-cancel');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const editButtons = document.querySelectorAll('.edit-button');

    let currentDeviceCard = null;

    // Show modal only on edit button click
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.device-card');
            currentDeviceCard = card;

            if (card) {
                const deviceName = card.querySelector('.device-name');
                if (deviceName) {
                    document.getElementById('edit-device-name').value = deviceName.textContent.trim();
                }

                const specs = card.querySelectorAll('.device-specs li');
                if (specs.length >= 4) {
                    document.getElementById('edit-spec-cpu').value = specs[0].textContent.replace(/.*?\s/, '').trim();
                    document.getElementById('edit-spec-storage').value = specs[1].textContent.replace(/.*?\s/, '').trim();
                    document.getElementById('edit-spec-display').value = specs[2].textContent.replace(/.*?\s/, '').trim();
                    document.getElementById('edit-spec-battery').value = specs[3].textContent.replace(/.*?\s/, '').trim();
                }

                const availability = card.querySelector('.availability');
                if (availability) {
                    document.getElementById('edit-availability').value = availability.textContent.trim().toLowerCase();
                }

                showModal(editModal);
            }
        });
    });

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    function showModal(modal) {
        closeAllModals();
        modal.style.display = 'flex';
    }

    cancelButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!currentDeviceCard) return;

            const deviceNameElement = currentDeviceCard.querySelector('.device-name');
            if (deviceNameElement) {
                deviceNameElement.textContent = document.getElementById('edit-device-name').value;
            }

            const specItems = currentDeviceCard.querySelectorAll('.device-specs li');
            if (specItems.length >= 4) {
                specItems[0].innerHTML = `<span class="spec-icon blue">💻</span> ${document.getElementById('edit-spec-cpu').value}`;
                specItems[1].innerHTML = `<span class="spec-icon red">💾</span> ${document.getElementById('edit-spec-storage').value}`;
                specItems[2].innerHTML = `<span class="spec-icon blue">🖥️</span> ${document.getElementById('edit-spec-display').value}`;
                specItems[3].innerHTML = `<span class="spec-icon green">🔋</span> ${document.getElementById('edit-spec-battery').value}`;
            }

            const availabilityElement = currentDeviceCard.querySelector('.availability');
            if (availabilityElement) {
                const newAvailability = document.getElementById('edit-availability').value;
                availabilityElement.textContent = newAvailability.charAt(0).toUpperCase() + newAvailability.slice(1);

                if (newAvailability === 'available') {
                    availabilityElement.style.backgroundColor = '#e8f5e9';
                    availabilityElement.style.color = '#137333';
                } else {
                    availabilityElement.style.backgroundColor = '#fce8e6';
                    availabilityElement.style.color = '#d93025';
                }
            }

            closeAllModals();
            console.log('Device updated successfully!');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}
