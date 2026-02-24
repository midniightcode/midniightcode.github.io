// Scroll fade background
window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;
    const shade = Math.floor(scrollPercent * 255);
    document.body.style.backgroundColor = `rgb(${shade}, ${shade}, ${shade})`;
});

// Hamburger toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

// Dropdown toggle for mobile
document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
    toggle.addEventListener("click", e => {
        // prevent default link behavior
        e.preventDefault();
        const parent = toggle.parentElement;

        // close other dropdowns
        document.querySelectorAll(".dropdown").forEach(drop => {
            if (drop !== parent) drop.classList.remove("open");
        });

        // toggle current dropdown
        parent.classList.toggle("open");
    });
});

function animateWishlist() {
    const cards = document.querySelectorAll(".wishlist-card");
    cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;

        if (inView && !card.classList.contains("visible")) {
            card.classList.add("visible");
            card.style.animation = `fadeInUp 0.8s ease forwards ${index * 0.2}s`;
        }
    });
}

window.addEventListener("scroll", animateWishlist);
window.addEventListener("load", animateWishlist);



