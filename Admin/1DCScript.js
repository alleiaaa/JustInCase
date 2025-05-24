// 1DCScript.js - Fixed JavaScript

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

// FILTER BUTTONS FUNCTIONALITY
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.add-button');
    const deviceCards = document.querySelectorAll('.device-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.dataset.filter.toLowerCase();

            deviceCards.forEach(card => {
                const availabilityElement = card.querySelector('.availability');
                if (availabilityElement) {
                    const availabilityText = availabilityElement.textContent.toLowerCase();
                    
                    // Show/hide cards based on filter
                    if (filter === 'all') {
                        card.style.display = 'flex';
                    } else if (filter === 'available' && availabilityText === 'available') {
                        card.style.display = 'flex';
                    } else if (filter === 'unavailable' && availabilityText === 'unavailable') {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
});

// SEARCH FUNCTIONALITY
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.search-bar');
    const deviceCards = document.querySelectorAll('.device-card');

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
});

// DROPDOWN FILTERS FUNCTIONALITY
document.addEventListener('DOMContentLoaded', () => {
    const typeFilter = document.querySelector('.filter-dropdown:first-child');
    const statusFilter = document.querySelector('.filter-dropdown:last-child');
    const deviceCards = document.querySelectorAll('.device-card');

    function applyFilters() {
        const selectedType = typeFilter ? typeFilter.value.toLowerCase() : 'all types';
        const selectedStatus = statusFilter ? statusFilter.value.toLowerCase() : 'all';

        deviceCards.forEach(card => {
            const deviceImage = card.querySelector('.device-image div').textContent.toLowerCase();
            const availability = card.querySelector('.availability').textContent.toLowerCase();
            
            let showCard = true;

            // Type filter
            if (selectedType !== 'all types') {
                if (selectedType === 'laptops' && !deviceImage.includes('laptop')) showCard = false;
                if (selectedType === 'tablets' && !deviceImage.includes('tablet')) showCard = false;
                if (selectedType === 'phones' && !deviceImage.includes('phone')) showCard = false;
            }

            // Status filter
            if (selectedStatus !== 'all') {
                if (selectedStatus === 'available' && availability !== 'available') showCard = false;
                if (selectedStatus === 'checked out' && availability !== 'checked out') showCard = false;
            }

            card.style.display = showCard ? 'flex' : 'none';
        });
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
});

// EDIT MODAL FUNCTIONALITY
document.addEventListener('DOMContentLoaded', () => {
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const cancelEditBtn = document.getElementById('cancel-edit');

    const editDeviceName = document.getElementById('edit-device-name');
    const editSpecCPU = document.getElementById('edit-spec-cpu');
    const editSpecStorage = document.getElementById('edit-spec-storage');
    const editSpecDisplay = document.getElementById('edit-spec-display');
    const editSpecBattery = document.getElementById('edit-spec-battery');
    const editAvailability = document.getElementById('edit-availability');

    const editButtons = document.querySelectorAll('.edit-button');
    let currentDeviceCard = null;

    // Open edit modal
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.device-card');
            currentDeviceCard = card;

            // Populate form with current device data
            if (card) {
                const deviceName = card.querySelector('.device-name');
                if (deviceName && editDeviceName) {
                    editDeviceName.value = deviceName.textContent.trim();
                }

                const specs = card.querySelectorAll('.device-specs li');
                if (specs.length >= 4) {
                    if (editSpecCPU) {
                        editSpecCPU.value = specs[0].textContent.replace(/.*?\s/, '').trim();
                    }
                    if (editSpecStorage) {
                        editSpecStorage.value = specs[1].textContent.replace(/.*?\s/, '').trim();
                    }
                    if (editSpecDisplay) {
                        editSpecDisplay.value = specs[2].textContent.replace(/.*?\s/, '').trim();
                    }
                    if (editSpecBattery) {
                        editSpecBattery.value = specs[3].textContent.replace(/.*?\s/, '').trim();
                    }
                }

                const availability = card.querySelector('.availability');
                if (availability && editAvailability) {
                    editAvailability.value = availability.textContent.trim().toLowerCase();
                }

                if (editModal) {
                    editModal.style.display = 'block';
                }
            }
        });
    });

    // Close modal on cancel
    if (cancelEditBtn && editModal) {
        cancelEditBtn.addEventListener('click', () => {
            editModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                editModal.style.display = 'none';
            }
        });
    }

    // Handle form submission
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!currentDeviceCard) return;

            // Update device name
            const deviceNameElement = currentDeviceCard.querySelector('.device-name');
            if (deviceNameElement && editDeviceName) {
                deviceNameElement.textContent = editDeviceName.value;
            }

            // Update specifications
            const specItems = currentDeviceCard.querySelectorAll('.device-specs li');
            if (specItems.length >= 4) {
                if (editSpecCPU) {
                    specItems[0].innerHTML = `<span class="spec-icon blue">💻</span> ${editSpecCPU.value}`;
                }
                if (editSpecStorage) {
                    specItems[1].innerHTML = `<span class="spec-icon red">💾</span> ${editSpecStorage.value}`;
                }
                if (editSpecDisplay) {
                    specItems[2].innerHTML = `<span class="spec-icon blue">🖥️</span> ${editSpecDisplay.value}`;
                }
                if (editSpecBattery) {
                    specItems[3].innerHTML = `<span class="spec-icon green">🔋</span> ${editSpecBattery.value}`;
                }
            }

            // Update availability
            const availabilityElement = currentDeviceCard.querySelector('.availability');
            if (availabilityElement && editAvailability) {
                const newAvailability = editAvailability.value;
                availabilityElement.textContent = newAvailability.charAt(0).toUpperCase() + newAvailability.slice(1);
                
                // Update availability styling
                if (newAvailability === 'available') {
                    availabilityElement.style.backgroundColor = '#e8f5e9';
                    availabilityElement.style.color = '#137333';
                } else {
                    availabilityElement.style.backgroundColor = '#fce8e6';
                    availabilityElement.style.color = '#d93025';
                }
            }

            // Close modal
            editModal.style.display = 'none';
            
            // Show success message (optional)
            console.log('Device updated successfully!');
        });
    }
});

// Handle ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const editModal = document.getElementById('edit-modal');
        if (editModal && editModal.style.display === 'block') {
            editModal.style.display = 'none';
        }
    }
});