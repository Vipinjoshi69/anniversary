/*=========================================
    OUR UNIVERSE ❤️
    CUSTOM CURSOR (Desktop Only)
=========================================*/

const isTouchDevice =
    ("ontouchstart" in window) ||
    (navigator.maxTouchPoints > 0);

if (isTouchDevice) {

    document.body.classList.add("touch-device");

} else {

    document.body.classList.add("custom-cursor-active");

    initCustomCursor();

}

function initCustomCursor() {

    const cursor = document.getElementById("cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener("mousemove", (e) => {

        mouseX = e.clientX;
        mouseY = e.clientY;

    });

    function animateCursor() {

        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;

        cursor.style.left = currentX + "px";
        cursor.style.top = currentY + "px";

        requestAnimationFrame(animateCursor);

    }

    animateCursor();

    /* Hover Effect */

    const hoverElements = document.querySelectorAll(
        "button,a,.glass-card,.app"
    );

    hoverElements.forEach(el => {

        el.addEventListener("mouseenter", () => {

            cursor.style.width = "60px";
            cursor.style.height = "60px";
            cursor.style.background = "rgba(255,77,141,.18)";
            cursor.style.borderColor = "#ffffff";

        });

        el.addEventListener("mouseleave", () => {

            cursor.style.width = "24px";
            cursor.style.height = "24px";
            cursor.style.background = "rgba(255,77,141,.25)";
            cursor.style.borderColor = "rgba(255,255,255,.25)";

        });

    });

    /* Click Animation */

    window.addEventListener("mousedown", () => {

        cursor.style.transform =
            "translate(-50%,-50%) scale(.7)";

    });

    window.addEventListener("mouseup", () => {

        cursor.style.transform =
            "translate(-50%,-50%) scale(1)";

    });

}
