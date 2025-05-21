// TOGGLE SIDEBAR
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('shifted');
});

// FILTER BUTTONS
const filterButtons = document.querySelectorAll('.add-button');
const deviceCards = document.querySelectorAll('.device-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked
        button.classList.add('active');

        const filter = button.dataset.filter.toLowerCase();

        deviceCards.forEach(card => {
            const availabilityText = card.querySelector('.availability').textContent.toLowerCase();

            if (filter === 'all' || availabilityText === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Edit Modal Logic
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

editButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.device-card');
    currentDeviceCard = card;

    // Get values
    editDeviceName.value = card.querySelector('.device-name').textContent.trim();

    const specs = card.querySelectorAll('.device-specs li');
    editSpecCPU.value = specs[0]?.textContent.trim().split(' ').slice(1).join(' ') || '';
    editSpecStorage.value = specs[1]?.textContent.trim().split(' ').slice(1).join(' ') || '';
    editSpecDisplay.value = specs[2]?.textContent.trim().split(' ').slice(1).join(' ') || '';
    editSpecBattery.value = specs[3]?.textContent.trim().split(' ').slice(1).join(' ') || '';

    editAvailability.value = card.querySelector('.availability').textContent.trim().toLowerCase();

    editModal.style.display = 'block';
  });
});

cancelEditBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentDeviceCard) return;

  // Update device card values
  currentDeviceCard.querySelector('.device-name').textContent = editDeviceName.value;
  const specItems = currentDeviceCard.querySelectorAll('.device-specs li');
  specItems[0].innerHTML = `<span class="spec-icon blue">💻</span> ${editSpecCPU.value}`;
  specItems[1].innerHTML = `<span class="spec-icon red">💾</span> ${editSpecStorage.value}`;
  specItems[2].innerHTML = `<span class="spec-icon blue">🖥️</span> ${editSpecDisplay.value}`;
  specItems[3].innerHTML = `<span class="spec-icon green">🔋</span> ${editSpecBattery.value}`;

  currentDeviceCard.querySelector('.availability').textContent = editAvailability.value.charAt(0).toUpperCase() + editAvailability.value.slice(1);

  editModal.style.display = 'none';
});

