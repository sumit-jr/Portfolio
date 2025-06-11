// Load saved theme from localStorage on page load
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  body.classList.add('dark-theme');
  toggleSwitch.checked = true;
} else {
  body.classList.remove('dark-theme');
  toggleSwitch.checked = false;
}

toggleSwitch.addEventListener('change', () => {
  if (toggleSwitch.checked) {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
});


// === HAMBURGER MENU TOGGLE ===
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when a nav link is clicked (optional, good UX)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
});
