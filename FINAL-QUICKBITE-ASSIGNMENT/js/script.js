// Add scroll event listener to header
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// Hamburger menu toggle
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav-links");

console.log("Hamburger loaded:", hamburger);

hamburger.addEventListener("click", () => {
    console.log("clicked");
    nav.classList.toggle("active");
});

// hero section slide
const heroOrderBtn = document.getElementById("hero-order-btn");

const slides = [
    {
        image: "images/bbq.jpg",
        title: "QuickBite’s Legendary Loaded BBQ Potatoes",
        desc: "Stuffed with smoked brisket, melted cheese, and house BBQ sauce",
        item: "potato-loaded1"
    },
    {
        image: "images/brisket.jpg",
        title: "Slow Smoked Brisket",
        desc: "14-hour smoked beef, tender and full of flavor",
        item: "brisket-plate"
    },
    {
        image: "images/ribs.jpg",
        title: "Fall-Off-The-Bone Ribs",
        desc: "Smoky, juicy ribs glazed with our signature sauce",
        item: "ribs-plate"
    }
];

let current = 0;

const layers = document.querySelectorAll(".bg-layer");
const title = document.getElementById("hero-title");
const desc = document.getElementById("hero-desc");

let activeLayer = 0;

function updateHero() {
    const nextLayer = (activeLayer + 1) % 2;
    const slide = slides[current];

    // 1. Set next image
    layers[nextLayer].style.backgroundImage = `url(${slide.image})`;

    // 2. Fade layers
    layers[nextLayer].classList.add("active");
    layers[activeLayer].classList.remove("active");

    // 3. Update text
    title.textContent = slide.title;
    desc.textContent = slide.desc;

    // 4. Update the button link - ENSURE BACKTICKS ARE USED
    if (heroOrderBtn) {
        heroOrderBtn.href = `menu.html?item=${slide.item}`;
    }

    activeLayer = nextLayer;
}

// FIX: Run this function ONCE immediately to set Slide 0 (Potato) 
// so the link works before the first 4-second timer starts.
function initializeHero() {
    layers[0].style.backgroundImage = `url(${slides[0].image})`;
    layers[0].classList.add("active");
    title.textContent = slides[0].title;
    desc.textContent = slides[0].desc;
    heroOrderBtn.href = `menu.html?item=${slides[0].item}`;
}

// Function to set the initial state
function initializeHero() {
    if (layers[0]) {
        layers[0].style.backgroundImage = `url(${slides[0].image})`;
        layers[0].classList.add("active");
    }
    if (title) title.textContent = slides[0].title;
    if (desc) desc.textContent = slides[0].desc;
    if (heroOrderBtn) heroOrderBtn.href = `menu.html?item=${slides[0].item}`;
}

// Call it once
initializeHero();

// Start the timer
setInterval(() => {
    current = (current + 1) % slides.length;
    updateHero();
}, 4000);

/* --- SIGNATURE ANIMATION --- */
// (The rest of your observer code follows here...)

/*SIGNATURE ANIMATION*/
const elements = document.querySelectorAll(".signature-intro, .signature-card, .about-text, .about-image-wrapper, .menu-item, .menu-cta");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.2
});

elements.forEach(el => observer.observe(el));

/* --- LOCAL STORAGE (PREFERENCES) --- */

function loadPreferences() {
    const savedName = localStorage.getItem('qb-userName');
    const savedFav = localStorage.getItem('qb-favoriteItem');
    const display = document.getElementById('saved-info-display');
    const nameInput = document.getElementById('pref-name');
    const favInput = document.getElementById('pref-favorite');

    if (savedName && savedFav) {
        if (display) {
            display.innerHTML = `Welcome back, <strong>${savedName}</strong>! Your favorite <strong>${savedFav}</strong> is waiting for you!`;
            // Add a little highlight animation
            display.style.color = 'var(--secondary)';
            setTimeout(() => { display.style.color = 'var(--muted-foreground)'; }, 1500);
        }
        if (nameInput) nameInput.value = savedName;
        if (favInput) favInput.value = savedFav;
    }
}

function savePreferences() {
    const nameInput = document.getElementById('pref-name');
    const favInput = document.getElementById('pref-favorite');

    if (!nameInput || !favInput) return;

    const nameVal = nameInput.value.trim();
    const favVal = favInput.value;

    if (nameVal && favVal) {
        localStorage.setItem('qb-userName', nameVal);
        localStorage.setItem('qb-favoriteItem', favVal);

        // This acts as our 3rd saved piece of data for the assignment requirement
        localStorage.setItem('qb-lastPreferenceUpdate', new Date().toISOString());

        loadPreferences();
        alert('Preferences saved successfully!');
    } else {
        alert('Please enter your name and select a favorite item.');
    }
}

// Load preferences on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
});
