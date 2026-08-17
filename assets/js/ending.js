/*=========================================
    OUR UNIVERSE ❤️
    ENDING (Forever)
=========================================*/

const endingScene = document.getElementById("ending");
const endingHomeBtn = document.getElementById("endingHomeBtn");
const fireworksCanvas = document.getElementById("fireworksCanvas");
const fireworksCtx = fireworksCanvas.getContext("2d");

let fireworksRunning = false;
let fireworksAnimId = null;
let particles = [];
let rockets = [];
let fireworksSpawnId = null;
let fireworksTimeouts = [];

// A wider, warmer palette - keeps the pink/gold/purple theme but adds a
// few extra hues so the finale actually looks "colorful" rather than a
// 4-color loop repeating all night.
const FIREWORK_COLORS = [
    "255,77,141",   // pink
    "255,209,102",  // gold
    "138,99,255",   // purple
    "255,255,255",  // white
    "108,225,255",  // sky blue
    "255,140,105",  // coral
    "170,255,190",  // mint
    "255,105,180"   // hot pink
];

const MAX_PARTICLES = 480; // hard cap - keeps the animation smooth however
                            // many fireworks are on screen at once

/*=========================================
    CANVAS SIZING
=========================================*/

function resizeFireworksCanvas() {

    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;

}

resizeFireworksCanvas();

window.addEventListener("resize", resizeFireworksCanvas);

/*=========================================
    ROCKETS
    (a bright point climbs from the bottom
    of the screen to a target height, trailing
    a soft spark, then bursts into particles -
    reads as a real firework launch instead of
    an explosion just appearing mid-air)
=========================================*/

function launchRocket(targetX, targetY, color) {

    rockets.push({

        x: targetX + (Math.random() * 60 - 30),
        y: fireworksCanvas.height + 10,
        targetY,
        color,
        speed: Math.random() * 2.5 + 7.5,
        trail: []

    });

}

function updateAndDrawRockets() {

    rockets.forEach(r => {

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 10) r.trail.shift();

        r.y -= r.speed;
        r.x += Math.sin(r.y * 0.02) * 0.4; // gentle drift, not a straight laser line

    });

    rockets.forEach(r => {

        fireworksCtx.strokeStyle = `rgba(${r.color},0.55)`;
        fireworksCtx.lineWidth = 2;
        fireworksCtx.beginPath();

        r.trail.forEach((point, i) => {

            if (i === 0) fireworksCtx.moveTo(point.x, point.y);
            else fireworksCtx.lineTo(point.x, point.y);

        });

        fireworksCtx.lineTo(r.x, r.y);
        fireworksCtx.stroke();

        fireworksCtx.shadowBlur = 12;
        fireworksCtx.shadowColor = `rgb(${r.color})`;
        fireworksCtx.fillStyle = `rgb(${r.color})`;
        fireworksCtx.beginPath();
        fireworksCtx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        fireworksCtx.fill();
        fireworksCtx.shadowBlur = 0;

    });

    // Burst any rocket that reached its target height
    rockets = rockets.filter(r => {

        if (r.y <= r.targetY) {

            spawnBurst(r.x, r.y, r.color);
            return false;

        }

        return true;

    });

}

/*=========================================
    PARTICLES / BURSTS
=========================================*/

function spawnBurst(x, y, color) {

    // Occasionally a bigger "peony" burst, mostly medium bursts -
    // keeps the sky varied instead of every firework looking identical
    const isGrand = Math.random() < 0.3;
    const count = isGrand ? 70 : 42;

    for (let i = 0; i < count; i++) {

        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.08;
        const speed = (isGrand ? Math.random() * 4.2 + 2 : Math.random() * 3.2 + 1.4);

        particles.push({

            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            alpha: 1,
            size: Math.random() * 2.2 + 1.4,
            decay: Math.random() * 0.008 + 0.010,
            glow: true

        });

    }

    trimParticles();

    // A soft secondary sparkle-crackle, like real gunpowder fireworks
    if (Math.random() < 0.65) {

        const crackleId = setTimeout(() => spawnCrackle(x, y), 220 + Math.random() * 200);
        fireworksTimeouts.push(crackleId);

    }

}

function spawnCrackle(x, y) {

    for (let i = 0; i < 16; i++) {

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.6 + 0.3;

        particles.push({

            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: "255,255,255",
            alpha: 0.9,
            size: Math.random() * 1.1 + 0.6,
            decay: 0.022,
            glow: true

        });

    }

    trimParticles();

}

function trimParticles() {

    if (particles.length > MAX_PARTICLES) {

        particles.splice(0, particles.length - MAX_PARTICLES);

    }

}

function drawParticles() {

    particles.forEach(p => {

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.032; // gravity
        p.vx *= 0.992; // gentle air drag - keeps bursts from looking mechanical
        p.alpha -= p.decay;

        fireworksCtx.globalAlpha = Math.max(p.alpha, 0);
        fireworksCtx.fillStyle = `rgb(${p.color})`;

        if (p.glow) {

            fireworksCtx.shadowBlur = 9;
            fireworksCtx.shadowColor = `rgba(${p.color},${Math.max(p.alpha, 0)})`;

        }

        fireworksCtx.beginPath();
        fireworksCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fireworksCtx.fill();
        fireworksCtx.shadowBlur = 0;

    });

    fireworksCtx.globalAlpha = 1;

    particles = particles.filter(p => p.alpha > 0);

}

function drawFireworks() {

    fireworksCtx.fillStyle = "rgba(10,7,20,0.22)";
    fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    updateAndDrawRockets();
    drawParticles();

    if (fireworksRunning) {

        fireworksAnimId = requestAnimationFrame(drawFireworks);

    }

}

/*=========================================
    SCHEDULING
    Grand opening volley of several rockets
    together, then an ongoing show where 1-3
    fireworks launch at a time at varied
    intervals - never a single lonely burst
    on repeat.
=========================================*/

function fireRandomVolley() {

    const volleySize = Math.random() < 0.4 ? (Math.random() < 0.3 ? 3 : 2) : 1;

    for (let i = 0; i < volleySize; i++) {

        const delay = i * (90 + Math.random() * 90);

        const id = setTimeout(() => {

            const targetX = Math.random() * fireworksCanvas.width * 0.8 + fireworksCanvas.width * 0.1;
            const targetY = Math.random() * fireworksCanvas.height * 0.42 + fireworksCanvas.height * 0.12;
            const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

            launchRocket(targetX, targetY, color);

        }, delay);

        fireworksTimeouts.push(id);

    }

}

function scheduleFireworks() {

    fireRandomVolley();

    fireworksSpawnId = setTimeout(() => {

        scheduleFireworks();

    }, Math.random() * 1000 + 700);

}

function openingCelebration() {

    // Several rockets fired together right as the scene opens, so it reads
    // as a "grand celebration" moment rather than fireworks slowly starting up
    const opening = [0, 140, 260, 420, 520];

    opening.forEach(delay => {

        const id = setTimeout(() => {

            const targetX = Math.random() * fireworksCanvas.width * 0.7 + fireworksCanvas.width * 0.15;
            const targetY = Math.random() * fireworksCanvas.height * 0.35 + fireworksCanvas.height * 0.12;
            const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

            launchRocket(targetX, targetY, color);

        }, delay);

        fireworksTimeouts.push(id);

    });

}

function startFireworks() {

    particles = [];
    rockets = [];
    fireworksRunning = true;

    fireworksCtx.fillStyle = "#0a0714";
    fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    drawFireworks();
    openingCelebration();

    const scheduleId = setTimeout(scheduleFireworks, 1400);
    fireworksTimeouts.push(scheduleId);

}

function stopFireworks() {

    fireworksRunning = false;

    if (fireworksAnimId) {

        cancelAnimationFrame(fireworksAnimId);
        fireworksAnimId = null;

    }

    if (fireworksSpawnId) {

        clearTimeout(fireworksSpawnId);
        fireworksSpawnId = null;

    }

    fireworksTimeouts.forEach(id => clearTimeout(id));
    fireworksTimeouts = [];

    particles = [];
    rockets = [];

    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

}

/*=========================================
    JOURNEY GALLERY (staggered premium reveal)
=========================================*/

function revealJourneyGallery() {

    const photos = document.querySelectorAll(".journey-photo");

    photos.forEach((photo, i) => {

        photo.classList.remove("reveal");
        void photo.offsetWidth; // restart animation if the scene is reopened

        const id = setTimeout(() => {

            photo.classList.add("reveal");

        }, 150 + i * 160);

        fireworksTimeouts.push(id);

    });

}

function resetJourneyGallery() {

    document.querySelectorAll(".journey-photo").forEach(photo => {

        photo.classList.remove("reveal");

    });

}

/*=========================================
    SHOW / HIDE
=========================================*/

function showEnding() {

    resizeFireworksCanvas();

    endingScene.classList.add("show");

    startFireworks();
    revealJourneyGallery();

    if (typeof playTheme === "function") playTheme();

}

function hideEnding() {

    endingScene.classList.remove("show");

    stopFireworks();
    resetJourneyGallery();

    if (typeof pauseTheme === "function") pauseTheme();

}

document.addEventListener("DOMContentLoaded", () => {

    endingHomeBtn.addEventListener("click", goHome);

});
