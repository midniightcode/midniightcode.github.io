/*
  Student Name: Ngan Dinh
  File Name: script.js
  Date: 11/09/2025
  Description: Smooth scroll, modals, hero rotation, show/hide, and form validation.
*/

// ===============================
// Smooth Scroll for Navigation
// ===============================
document.querySelectorAll('.main-nav a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.hash && this.pathname === window.location.pathname) {
      const target = document.querySelector(this.hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ===============================
// Resource Card Modals
// ===============================
document.querySelectorAll('.resource-card img').forEach(img => {
  img.addEventListener('click', () => {
    const modalId = img.getAttribute('data-bs-target');
    const modalImg = document.querySelector(`${modalId} img`);
    if (modalImg) modalImg.src = img.src;
  });
});

// ===============================
// Lightbox Modal
// ===============================
document.querySelectorAll('.gallery-img').forEach(img => {
  img.addEventListener('click', () => {
    const modalImage = document.getElementById('lightboxImage');
    const modalTitle = document.getElementById('lightboxModalLabel');
    const modalCaption = document.getElementById('lightboxCaption');

    if (modalImage) modalImage.src = img.src;
    if (modalTitle) modalTitle.textContent = img.dataset.title || "";
    if (modalCaption) modalCaption.textContent = img.dataset.caption || "";
  });
});

// ===============================
// Bootstrap 5 Form Validation
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
});

// ===============================
// Hero Background Image Rotator
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const heroImages = document.querySelectorAll(".hero-img");
  if (heroImages.length > 1) {
    let currentHeroIndex = 0;

    setInterval(() => {
      heroImages[currentHeroIndex].classList.remove("active");
      currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
      heroImages[currentHeroIndex].classList.add("active");
    }, 4000);
  }
});

// ===============================
// Show / Hide Club Info Box
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-btn');
  const clubInfo = document.getElementById('club-info');

  if (toggleBtn && clubInfo) {
    toggleBtn.addEventListener('click', () => {
      clubInfo.classList.toggle('d-none');
      toggleBtn.textContent =
        clubInfo.classList.contains('d-none') ? 'Show Info' : 'Hide Info';
    });
  }
});
