/*=========================================
    OUR UNIVERSE ❤️
    MAIN CONTROLLER
=========================================*/

const loader = document.getElementById("loader");
const landing = document.getElementById("landing");
const phoneScene = document.getElementById("phoneScene");
const beginBtn = document.getElementById("beginBtn");

const phoneTime = document.querySelector(".phone-time");
const phoneClock = document.getElementById("phoneClock");

const unlockArea = document.getElementById("unlockArea");
const lockScreen = document.getElementById("lockScreen");
const homeScreen = document.getElementById("homeScreen");
const whatsappScreen = document.getElementById("whatsappScreen");
const whatsappBackBtn = document.getElementById("whatsappBackBtn");
const appGrid = document.querySelector(".app-grid");

/*=========================================
    INIT
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    initClock();
    initEvents();

});

/*=========================================
    EVENTS
=========================================*/

function initEvents() {

    beginBtn.addEventListener("click", openPhoneScene);

    unlockArea.addEventListener("click", unlockPhone);

    whatsappBackBtn.addEventListener("click", handleWhatsAppBack);

    appGrid.addEventListener("click", handleAppTap);

    const rainBackBtn = document.getElementById("rainBackBtn");

    if (rainBackBtn) {

        rainBackBtn.addEventListener("click", goHome);

    }

}

/*=========================================
    PHONE SCENE (landing -> phone)
=========================================*/

function openPhoneScene() {

    startWarp();

    landing.style.opacity = "0";
    landing.style.pointerEvents = "none";

    setTimeout(() => {

        phoneScene.classList.add("show");
        stopWarp();

    }, 1200);

}

/*=========================================
    CLOCK
=========================================*/

function initClock() {

    updateClock();
    setInterval(updateClock, 1000);

}

function updateClock() {

    const now = new Date();

    let hour = now.getHours();
    let minute = now.getMinutes();

    minute = minute < 10 ? "0" + minute : minute;

    const time = `${hour}:${minute}`;

    if (phoneTime) phoneTime.textContent = time;
    if (phoneClock) phoneClock.textContent = time;

}

/*=========================================
    SHOW LANDING (called from loader.js)
=========================================*/

function showLanding() {

    loader.classList.add("hide");

    setTimeout(() => {

        landing.style.opacity = "1";
        landing.style.transform = "translateY(0)";
        loader.remove();

        const glassCard = document.querySelector(".glass-card");

        if (glassCard) glassCard.classList.add("reveal");

    }, 1000);

}

/*=========================================
    LOCK SCREEN -> HOME SCREEN
=========================================*/

function unlockPhone() {

    lockScreen.style.transform = "scale(1.15)";
    lockScreen.style.opacity = "0";

    setTimeout(() => {

        lockScreen.style.display = "none";
        homeScreen.classList.add("show");

    }, 500);

}

/*=========================================
    APP UNLOCK STATE MACHINE

    Every chapter app (whatsapp, firstMeet,
    memories, letter, forever) is tracked here.
    unlockApp() is the single entry point used
    by chatEngine.js, rain.js, gallery.js, and
    letter.js to progress the story.
=========================================*/

const appProgress = {
    whatsapp: "unlocked",
    firstMeet: "locked",
    memories: "locked",
    letter: "locked",
    forever: "locked"
};

const appUnlockMessages = {
    firstMeet: "❤️ First Meet unlocked",
    memories: "❤️ Memories unlocked",
    letter: "❤️ A Letter has arrived",
    forever: "❤️ Forever is waiting"
};

function unlockApp(appId) {

    if (!appProgress.hasOwnProperty(appId)) return;
    if (appProgress[appId] === "unlocked") return;

    appProgress[appId] = "unlocked";

    const el = document.querySelector(`[data-app="${appId}"]`);

    if (el) {

        el.classList.add("unlocking");

        setTimeout(() => {

            el.classList.remove("locked");
            el.classList.add("unlocked");
            el.classList.remove("unlocking");

        }, 900);

    }

    if (appUnlockMessages[appId]) {

        showUnlockToast(appUnlockMessages[appId]);

    }

}

function showUnlockToast(message) {

    const toast = document.createElement("div");

    toast.className = "unlock-toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);

    setTimeout(() => {

        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 500);

    }, 3500);

}

/*=========================================
    APP TAP HANDLER (event delegation)
=========================================*/

const appOpeners = {
    whatsapp: openWhatsApp,
    firstMeet: openFirstMeet,
    memories: openMemories,
    letter: openLetter,
    forever: openForever
};

function handleAppTap(e) {

    const appEl = e.target.closest(".app");

    if (!appEl) return;

    const appId = appEl.dataset.app;

    if (appEl.classList.contains("locked")) {

        appEl.classList.add("shake");

        setTimeout(() => appEl.classList.remove("shake"), 450);

        return;

    }

    const opener = appOpeners[appId];

    if (typeof opener === "function") opener();

}

/*=========================================
    NAVIGATION HELPERS
=========================================*/

function goHome() {

    if (whatsappScreen.classList.contains("show")) {

        whatsappScreen.classList.remove("show");

    }

    const rainScene = document.getElementById("rainScene");

    if (rainScene && rainScene.classList.contains("show")) {

        if (typeof hideRainScene === "function") hideRainScene();

    }

    const galleryScene = document.getElementById("gallery");

    if (galleryScene && galleryScene.classList.contains("show")) {

        if (typeof hideGallery === "function") hideGallery();

    }

    const letterScene = document.getElementById("letter");

    if (letterScene && letterScene.classList.contains("show")) {

        if (typeof hideLetter === "function") hideLetter();

    }

    const endingScene = document.getElementById("ending");

    if (endingScene && endingScene.classList.contains("show")) {

        if (typeof hideEnding === "function") hideEnding();

    }

    homeScreen.classList.add("show");

}

/*=========================================
    WHATSAPP (Chapter One)
=========================================*/

function openWhatsApp() {

    homeScreen.classList.remove("show");

    setTimeout(() => {

        whatsappScreen.classList.add("show");
        startWhatsAppStory();

        // Theme song plays under the chat too, not just the Forever finale
        if (typeof playTheme === "function") playTheme();

    }, 400);

}

function handleWhatsAppBack() {

    goHome();

    if (typeof pauseTheme === "function") pauseTheme();

    // storyFinished is set by chatEngine.js once the auto-story completes
    if (typeof storyFinished !== "undefined" && storyFinished) {

        unlockApp("firstMeet");

    }

}

/*=========================================
    FIRST MEET (Chapter Two - Rain Scene)
=========================================*/

function openFirstMeet() {

    homeScreen.classList.remove("show");

    setTimeout(() => {

        if (typeof showRainScene === "function") showRainScene();

    }, 400);

}

/*=========================================
    MEMORIES (Chapter Three - Gallery)
=========================================*/

function openMemories() {

    homeScreen.classList.remove("show");

    setTimeout(() => {

        if (typeof showGallery === "function") showGallery();

    }, 400);

}

/*=========================================
    LETTER (Chapter Four)
=========================================*/

function openLetter() {

    homeScreen.classList.remove("show");

    setTimeout(() => {

        if (typeof showLetter === "function") showLetter();

    }, 400);

}

/*=========================================
    FOREVER (Final Chapter)
=========================================*/

function openForever() {

    homeScreen.classList.remove("show");

    setTimeout(() => {

        if (typeof showEnding === "function") showEnding();

    }, 400);

}
