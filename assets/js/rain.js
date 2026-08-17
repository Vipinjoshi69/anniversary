/*=========================================
    OUR UNIVERSE ❤️
    RAIN SCENE (Chapter Two - First Meet)
=========================================*/

const rainScene = document.getElementById("rainScene");
const barbaadSong = document.getElementById("barbaadSong");
const rainAudio = document.getElementById("rainAudio");
const rainCanvas = document.getElementById("rainCanvas");
const rainCtx = rainCanvas.getContext("2d");
const lightningFlash = document.getElementById("lightningFlash");

const thunderSounds = [
    document.getElementById("thunder1"),
    document.getElementById("thunder2")
].filter(Boolean);

let raindrops = [];
let splashes = [];
let glassDrops = [];
let rainAnimationId = null;
let rainRunning = false;

let lightningTimeoutId = null;
let sceneTimeoutIds = [];

let meetPhotos = [];
let meetPhotoIndex = 0;
let meetPhotoIntervalId = null;

const RAIN_COUNT = 380;
const GLASS_DROP_COUNT = 34;

/*=========================================
    CANVAS SIZING
=========================================*/

function resizeRainCanvas() {

    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;

}

resizeRainCanvas();

window.addEventListener("resize", resizeRainCanvas);

/*=========================================
    RAINDROP PARTICLES
    (depth is 0-1: closer drops are bigger,
    faster, and more opaque - gives the
    storm real depth instead of a flat wash.
    Speeds are tuned down from the original
    pass for a calmer, more romantic fall.)
=========================================*/

function createRaindrop() {

    const depth = Math.random();

    return {

        x: Math.random() * rainCanvas.width,
        y: Math.random() * rainCanvas.height,
        length: depth * 20 + 11,
        speed: depth * 6 + 4.5,
        drift: depth * 1.2 + 0.4,
        width: depth * 1.6 + 0.6,
        opacity: depth * 0.45 + 0.35

    };

}

function initRaindrops() {

    raindrops = [];
    splashes = [];
    glassDrops = [];

    for (let i = 0; i < RAIN_COUNT; i++) {

        raindrops.push(createRaindrop());

    }

    for (let i = 0; i < GLASS_DROP_COUNT; i++) {

        glassDrops.push(createGlassDrop(true));

    }

}

/*=========================================
    SPLASHES
    A small ring + a couple of droplets that
    pop briefly where a raindrop lands.
=========================================*/

function spawnSplash(x, y) {

    splashes.push({

        x, y,
        radius: 1,
        maxRadius: Math.random() * 5 + 5,
        opacity: 0.55

    });

}

function drawSplashes() {

    splashes.forEach(s => {

        rainCtx.globalAlpha = s.opacity;
        rainCtx.strokeStyle = "rgba(210,225,245,0.8)";
        rainCtx.lineWidth = 1;

        rainCtx.beginPath();
        rainCtx.ellipse(s.x, s.y, s.radius * 1.8, s.radius * 0.6, 0, 0, Math.PI * 2);
        rainCtx.stroke();

        s.radius += (s.maxRadius - s.radius) * 0.25 + 0.3;
        s.opacity -= 0.045;

    });

    rainCtx.globalAlpha = 1;

    splashes = splashes.filter(s => s.opacity > 0);

}

/*=========================================
    GLASS DROPLETS

    Clearly-visible, glossy beads of water
    that cling to the "glass" and trickle
    down slowly with a faint wet trail -
    a different effect from the fast
    streaking background rain above, meant
    to read as water right on the screen.
=========================================*/

function createGlassDrop(randomStart) {

    const size = Math.random() * 3.2 + 2.4;

    return {

        x: Math.random() * rainCanvas.width,
        y: randomStart ? Math.random() * rainCanvas.height : -20,
        radius: size,
        speed: Math.random() * 0.9 + 0.35,
        wobble: (Math.random() - 0.5) * 0.6,
        wobblePhase: Math.random() * Math.PI * 2,
        trail: [],
        holdTime: Math.random() * 90 + 30, // pauses briefly like real drops clinging to glass
        holding: Math.random() > 0.5

    };

}

function updateGlassDrop(drop) {

    if (drop.holding) {

        drop.holdTime -= 1;

        if (drop.holdTime <= 0) drop.holding = false;

        return;

    }

    drop.wobblePhase += 0.05;

    drop.y += drop.speed;
    drop.x += Math.sin(drop.wobblePhase) * drop.wobble;

    if (Math.random() > 0.75) {

        drop.trail.push({ x: drop.x, y: drop.y, opacity: 0.35 });

        if (drop.trail.length > 14) drop.trail.shift();

    }

    drop.trail.forEach(t => t.opacity -= 0.006);
    drop.trail = drop.trail.filter(t => t.opacity > 0);

    // occasionally clings again for a beat before continuing to fall
    if (Math.random() > 0.994) {

        drop.holding = true;
        drop.holdTime = Math.random() * 60 + 20;

    }

    if (drop.y > rainCanvas.height + 20) {

        Object.assign(drop, createGlassDrop(false));

    }

}

function drawGlassDrop(drop) {

    // wet trickle trail
    drop.trail.forEach(t => {

        rainCtx.globalAlpha = t.opacity;
        rainCtx.fillStyle = "rgba(200,220,245,0.5)";
        rainCtx.beginPath();
        rainCtx.arc(t.x, t.y, drop.radius * 0.35, 0, Math.PI * 2);
        rainCtx.fill();

    });

    rainCtx.globalAlpha = 1;

    // glossy bead body
    const gradient = rainCtx.createRadialGradient(

        drop.x - drop.radius * 0.35, drop.y - drop.radius * 0.35, drop.radius * 0.1,
        drop.x, drop.y, drop.radius * 1.4

    );

    gradient.addColorStop(0, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.35, "rgba(215,230,250,0.65)");
    gradient.addColorStop(1, "rgba(150,175,205,0.15)");

    rainCtx.beginPath();
    rainCtx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
    rainCtx.fillStyle = gradient;
    rainCtx.fill();

    // small bright highlight for the glassy look
    rainCtx.beginPath();
    rainCtx.arc(drop.x - drop.radius * 0.3, drop.y - drop.radius * 0.35, drop.radius * 0.28, 0, Math.PI * 2);
    rainCtx.fillStyle = "rgba(255,255,255,0.85)";
    rainCtx.fill();

}

function drawGlassDrops() {

    glassDrops.forEach(drop => {

        updateGlassDrop(drop);
        drawGlassDrop(drop);

    });

}

function drawRain() {

    rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);

    rainCtx.strokeStyle = "rgba(200,215,235,0.85)";
    rainCtx.lineCap = "round";

    const groundY = rainCanvas.height - 6;

    raindrops.forEach(drop => {

        rainCtx.globalAlpha = drop.opacity;
        rainCtx.lineWidth = drop.width;

        rainCtx.beginPath();
        rainCtx.moveTo(drop.x, drop.y);
        rainCtx.lineTo(drop.x - drop.drift * 3, drop.y + drop.length);
        rainCtx.stroke();

        drop.y += drop.speed;
        drop.x -= drop.drift;

        if (drop.y > rainCanvas.height) {

            // splash only for drops landing in the lower part of the
            // screen - keeps it feeling grounded rather than everywhere
            if (drop.y - drop.speed < groundY && Math.random() > 0.55) {

                spawnSplash(drop.x, rainCanvas.height - Math.random() * 40);

            }

            drop.y = -drop.length;
            drop.x = Math.random() * rainCanvas.width;

        }

        if (drop.x < 0) {

            drop.x = rainCanvas.width;

        }

    });

    rainCtx.globalAlpha = 1;

    drawSplashes();
    drawGlassDrops();

    if (rainRunning) {

        rainAnimationId = requestAnimationFrame(drawRain);

    }

}

function startRainAnimation() {

    initRaindrops();
    rainRunning = true;
    drawRain();

}

function stopRainAnimation() {

    rainRunning = false;

    splashes = [];
    glassDrops = [];

    if (rainAnimationId) {

        cancelAnimationFrame(rainAnimationId);
        rainAnimationId = null;

    }

    rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);

}

/*=========================================
    LIGHTNING + THUNDER

    Light "strikes" first (flash + screen
    shake), thunder claps 150-550ms later -
    mirrors how light outruns sound.
=========================================*/

function scheduleLightning() {

    const delay = Math.random() * 5500 + 3500; // next strike in 3.5s-9s

    lightningTimeoutId = setTimeout(() => {

        strikeLightning();
        scheduleLightning();

    }, delay);

}

function strikeLightning() {

    lightningFlash.classList.remove("flash");
    void lightningFlash.offsetWidth; // restart CSS animation
    lightningFlash.classList.add("flash");

    // Roughly half of strikes shake the scene - keeps it from feeling repetitive
    if (Math.random() > 0.4) {

        rainScene.classList.remove("shake");
        void rainScene.offsetWidth;
        rainScene.classList.add("shake");

    }

    playThunder();

}

function playThunder() {

    if (thunderSounds.length === 0) return;

    const clip = thunderSounds[Math.floor(Math.random() * thunderSounds.length)];

    const delay = 10 //Math.random() * 400 + 150;

    setTimeout(() => {

        clip.currentTime = 0;
        clip.volume = 0.8;
        clip.play().catch(err => console.error(err));

    }, delay);

}

function stopLightning() {

    if (lightningTimeoutId) {

        clearTimeout(lightningTimeoutId);
        lightningTimeoutId = null;

    }

    lightningFlash.classList.remove("flash");
    rainScene.classList.remove("shake");

}

/*=========================================
    MEET PHOTO CAROUSEL
    (Ken Burns zoom + crossfade, 4 photos)
=========================================*/

function startMeetPhotoCarousel() {

    meetPhotos = document.querySelectorAll(".meet-photo-frame");

    if (meetPhotos.length === 0) return;

    meetPhotoIndex = 0;
    meetPhotos.forEach(p => p.classList.remove("active"));
    meetPhotos[0].classList.add("active");

    meetPhotoIntervalId = setInterval(() => {

        meetPhotos[meetPhotoIndex].classList.remove("active");

        meetPhotoIndex = (meetPhotoIndex + 1) % meetPhotos.length;

        // restart the Ken Burns zoom + shimmer cleanly on the incoming photo
        const next = meetPhotos[meetPhotoIndex];
        next.classList.remove("active");
        void next.offsetWidth;
        next.classList.add("active");

    }, 7000);

}

function stopMeetPhotoCarousel() {

    if (meetPhotoIntervalId) {

        clearInterval(meetPhotoIntervalId);
        meetPhotoIntervalId = null;

    }

    meetPhotos.forEach(p => p.classList.remove("active"));

}

/*=========================================
    CINEMATIC PARALLAX
    A few degrees of tilt toward the cursor -
    purely decorative, applied to the stack
    wrapper only, so it never interferes with
    the Ken Burns zoom/shimmer running on the
    frames and images inside it.
=========================================*/

const meetPhotoStackEl = document.getElementById("meetPhotoStack");

document.addEventListener("mousemove", (e) => {

    if (!meetPhotoStackEl || !rainScene.classList.contains("show")) return;

    const relX = (e.clientX / window.innerWidth - 0.5) * 2;
    const relY = (e.clientY / window.innerHeight - 0.5) * 2;

    meetPhotoStackEl.style.transform = `rotateY(${relX * 5}deg) rotateX(${relY * -5}deg)`;

});

/*=========================================
    SHOW / HIDE SCENE
=========================================*/

function showRainScene() {

    resizeRainCanvas();

    rainScene.classList.add("show");

    startRainAnimation();
    scheduleLightning();

    barbaadSong.currentTime = 0;
    barbaadSong.play().catch(() => { });

    sceneTimeoutIds.push(setTimeout(() => {

        startMeetPhotoCarousel();

    }, 900));

    rainAudio.currentTime = 0;
    rainAudio.volume = 0.45;
    rainAudio.play().catch(() => { });

    sceneTimeoutIds.push(setTimeout(() => {

        document.querySelector(".rain-content h2").classList.add("show");

    }, 2200));

    sceneTimeoutIds.push(setTimeout(() => {

        document.querySelector(".rain-content p").classList.add("show");

        // First Meet has been fully seen - unlock the next chapter
        if (typeof unlockApp === "function") unlockApp("memories");

    }, 2900));

}

function hideRainScene() {

    rainScene.classList.remove("show");

    barbaadSong.pause();
    rainAudio.pause();

    stopRainAnimation();
    stopLightning();
    stopMeetPhotoCarousel();

    if (meetPhotoStackEl) meetPhotoStackEl.style.transform = "";

    sceneTimeoutIds.forEach(id => clearTimeout(id));
    sceneTimeoutIds = [];

    document.querySelector(".rain-content h2").classList.remove("show");
    document.querySelector(".rain-content p").classList.remove("show");

}
