/*=========================================
    OUR UNIVERSE ❤️
    MUSIC (theme song for the Forever chapter)
=========================================*/

const bgMusic = document.getElementById("bgMusic");
const bgMusic2 = document.getElementById("bgMusic2");
const bgMusic3 = document.getElementById("bgMusic3");

function playTheme() {

    bgMusic.volume = 0.6;
    bgMusic.currentTime = 0;

    bgMusic.play().catch(err => {

        console.warn(
            "Theme song could not play - most likely assets/music/bg.mp3 is missing, or the browser blocked autoplay:",
            err.message
        );

    });

}

function pauseTheme() {
    bgMusic.pause();
}

function playBg2() {

    bgMusic2.volume = 0.6;
    bgMusic2.currentTime = 0;

    bgMusic2.play().catch(err => {

        console.warn(
            "Theme song could not play - most likely assets/music/Barbaad.mp3 is missing, or the browser blocked autoplay:",
            err.message
        );

    });

}

function pauseBg2() {
    bgMusic2.pause();
}

function playBg3() {

    bgMusic3.volume = 0.6;
    bgMusic3.currentTime = 0;

    bgMusic3.play().catch(err => {

        console.warn(
            "Theme song could not play - most likely assets/music/Letter.mp3 is missing, or the browser blocked autoplay:",
            err.message
        );

    });

}

function pauseBg3() {
    bgMusic3.pause();
}