// Sidebar toggle functionality
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('shifted');
});

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