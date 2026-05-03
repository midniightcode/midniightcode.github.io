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
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("nav-links");

    console.log("Hamburger loaded:", hamburger);

    if (!hamburger || !nav) return;

    hamburger.addEventListener("click", () => {
        console.log("clicked");
        nav.classList.toggle("active");
    });
});


// =========================
// CAMERA + BBQ WALL LOGIC
// =========================
let stream = null;
let countdownRunning = false;
let cameraState = "off";


//UPDATED UI
function updateUI() {
    const video = document.getElementById("video");
    const photo = document.getElementById("photo");
    const placeholder = document.querySelector(".camera-placeholder");

    if (!placeholder) return;

    if (cameraState === "off") {
        placeholder.style.display = "block";
        video.style.display = "none";
        photo.style.display = "none";
    }
    else if (cameraState === "preview") {
        placeholder.style.display = "none";
        video.style.display = "block";
        photo.style.display = "none";
    }
    else if (cameraState === "captured") {
        placeholder.style.display = "none"; // THIS fixes bug
        video.style.display = "none";
        photo.style.display = "block";
    }
}


// START CAMERA
function startCamera() {
    cameraState = "preview";

    // HARD RESET OLD STREAM
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "user"
        }
    })
        .then(s => {
            stream = s;

            const video = document.getElementById("video");
            const photo = document.getElementById("photo");
            const controls = document.querySelector(".polaroid-controls");

            video.srcObject = stream;
            video.style.display = "block";
            video.play();

            photo.style.display = "none";
            photo.src = "";

            if (controls) {
                controls.style.display = "flex";
            }

            showConfetti();
            updateUI();
        })
        .catch((err) => {
            console.error("Camera error:", err);
            alert("Camera error: " + err.name);
        });
}


// COUNTDOWN
function startCountdown() {
    if (countdownRunning) return; // prevent spam

    const countdownEl = document.getElementById("countdown");

    let count = 3;
    countdownRunning = true;

    countdownEl.textContent = count;

    const interval = setInterval(() => {
        count--;

        if (count > 0) {
            countdownEl.textContent = count;
        } else {
            countdownEl.textContent = "📸";
            clearInterval(interval);

            setTimeout(() => {
                countdownEl.textContent = "";
                capturePhoto();
                countdownRunning = false;
            }, 500);
        }
    }, 1000);
}

// CAPTURE PHOTO
function capturePhoto() {
    const video = document.getElementById("video");
    const photo = document.getElementById("photo");

    if (!stream) {
        alert("Camera is not active.");
        return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    photo.src = canvas.toDataURL("image/png");

    cameraState = "captured";
    updateUI();

    photo.style.display = "block";
    video.style.display = "none";
}

// RETAKE
function retakePhoto() {
    cameraState = "preview";
    const video = document.getElementById("video");
    const photo = document.getElementById("photo");

    photo.style.display = "none";
    photo.src = "";

    // restart camera if needed
    if (!stream) {
        startCamera();
    } else {
        video.style.display = "block";
    }

    updateUI();
}

// SUBMIT
function submitPhoto() {
    alert("🔥 Submitted! You might be featured on our BBQ Wall!");
    showConfetti();
}

// STOP CAMERA
function stopCamera() {
    cameraState = "off";
    const video = document.getElementById("video");
    const photo = document.getElementById("photo");
    const controls = document.querySelector(".polaroid-controls");

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    video.srcObject = null;
    video.style.display = "none";

    // reset photo (IMPORTANT FIX)
    photo.src = "";
    photo.style.display = "none";

    if (controls) {
        controls.style.display = "none";
    }

    // reset countdown if it exists
    const countdown = document.getElementById("countdown");
    if (countdown) countdown.textContent = "";

    updateUI();
}

function toggleCamera(toggle) {
    if (toggle.checked) {
        startCamera();
    } else {
        stopCamera();
    }
}


//CONFFETI ANIMATION//
function showConfetti() {
    const colors = ["#ff7b00", "#ff3b3b", "#ffd166", "#06d6a0"];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement("div");

        confetti.style.position = "fixed";
        confetti.style.width = "10px";
        confetti.style.height = "10px";
        confetti.style.background =
            colors[Math.floor(Math.random() * colors.length)];

        confetti.style.top = "-10px";
        confetti.style.left = Math.random() * window.innerWidth + "px";

        confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(confetti);

        let speed = Math.random() * 5 + 2;

        let fall = setInterval(() => {
            confetti.style.top =
                confetti.offsetTop + speed + "px";

            confetti.style.left =
                confetti.offsetLeft + Math.sin(confetti.offsetTop / 20) * 2 + "px";
        }, 20);

        setTimeout(() => {
            clearInterval(fall);
            confetti.remove();
        }, 2500);
    }
}

// MICROPHONE

let micStream = null;

function toggleMic(toggle) {
    if (toggle.checked) {
        startMic();
    } else {
        stopMic();
    }
}

function startMic() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(s => {
            micStream = s;
            alert("🎤 Microphone enabled!");
            showConfetti();
        })
        .catch(() => {
            alert("Microphone permission denied.");
        });
}

function stopMic() {
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
        micStream = null;
    }
}

//JS FOR BODY

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll(".fade-in, .slide-left, .slide-right")
    .forEach(el => observer.observe(el));


//CONTACT/DIRECTION PAGE//


//ACCESS TO GEOLOCATION
function getDirections() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported.");
        return;
    }

    console.log("Requesting location...");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            alert("Location retrieved!");
            console.log(position.coords);
        },
        (error) => {
            alert("Location access denied or unavailable.");
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

//PRESENT DATE
function highlightToday() {
    const today = new Date().getDay(); // 0–6
    const items = document.querySelectorAll("#hoursList li");

    items.forEach(li => {
        if (parseInt(li.dataset.day) === today) {
            li.classList.add("active");
        }
    });
}

highlightToday();