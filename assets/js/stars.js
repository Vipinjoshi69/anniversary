/*=========================================
    OUR UNIVERSE ❤️
    GALAXY ENGINE
=========================================*/

const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");

const stars = [];

const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

const STAR_COUNT = 350;

let warpMode = false;

/*=========================================
    RESIZE
=========================================*/

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", e => {

    mouse.x = e.clientX;
    mouse.y = e.clientY;

});

/*=========================================
    STAR CLASS
=========================================*/

class Star {

    constructor() {

        this.reset();

    }

    reset() {

        this.x = Math.random() * canvas.width;

        this.y = Math.random() * canvas.height;

        this.radius = Math.random() * 2 + .4;

        this.depth = Math.random() * 3 + 1;

        this.opacity = Math.random();

        this.speed = Math.random() * .02 + .004;

    }

    update() {

        this.opacity += this.speed;

        if (this.opacity >= 1 || this.opacity <= .25) {

            this.speed *= -1;

        }

    }

    draw() {

        const offsetX =
            (mouse.x - canvas.width / 2) /
            (this.depth * 25);

        const offsetY =
            (mouse.y - canvas.height / 2) /
            (this.depth * 25);

        const drawX = this.x + offsetX;
        const drawY = this.y + offsetY;

        ctx.beginPath();

        ctx.arc(

            drawX,

            drawY,

            this.radius,

            0,

            Math.PI * 2

        );

        ctx.fillStyle =
            `rgba(255,255,255,${this.opacity})`;

        ctx.fill();

        /* Warp Effect */

        if (warpMode) {

            ctx.beginPath();

            ctx.moveTo(drawX, drawY);

            ctx.lineTo(

                drawX,

                drawY + this.depth * 18

            );

            ctx.strokeStyle =
                `rgba(255,255,255,.15)`;

            ctx.lineWidth = this.radius;

            ctx.stroke();

        }

    }

}

/*=========================================
    CREATE STARS
=========================================*/

for (let i = 0; i < STAR_COUNT; i++) {

    stars.push(new Star());

}

/*=========================================
    SHOOTING STARS
    (a small pool, so several can streak
    across the sky at once instead of
    waiting for one meteor to finish)
=========================================*/

const shootingStars = [];

const METEOR_POOL_SIZE = 5;

class ShootingStar {

    constructor() {

        this.active = false;

        this.reset();

    }

    reset() {

        this.length = Math.random() * 110 + 70;

        this.speed = Math.random() * 10 + 8;

        this.angle = (Math.random() * 20 + 35) * (Math.PI / 180); // 35-55deg, slight natural variance

        this.width = Math.random() * 1.6 + 1.2;

        this.opacity = Math.random() * 0.3 + 0.7;

        this.active = false;

    }

    start() {

        this.reset();

        this.active = true;

        this.x = Math.random() * canvas.width;
        this.y = -60;

    }

    update() {

        if (!this.active) return;

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.y > canvas.height + 100 || this.x < -150) {

            this.active = false;

        }

    }

    draw() {

        if (!this.active) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);

        gradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();

        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";

        ctx.stroke();

    }

}

for (let i = 0; i < METEOR_POOL_SIZE; i++) {

    shootingStars.push(new ShootingStar());

}

function launchMeteor() {

    // find a star currently idle in the pool and send it out
    const idle = shootingStars.find(s => !s.active);

    if (idle) idle.start();

}

function scheduleMeteors() {

    // occasionally launch 2 close together so they cross paths,
    // otherwise it never reads as "multiple stars" even with a pool
    launchMeteor();

    if (Math.random() > 0.55) {

        setTimeout(launchMeteor, Math.random() * 500 + 150);

    }

    setTimeout(scheduleMeteors, Math.random() * 2500 + 2000);

}

scheduleMeteors();

/*=========================================
    ANIMATE
=========================================*/

function animate() {

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

    stars.forEach(star => {

        star.update();

        star.draw();

    });

    shootingStars.forEach(star => {

        star.update();
        star.draw();

    });

    requestAnimationFrame(animate);

}

animate();

/*=========================================
    WARP MODE
=========================================*/

function startWarp() {

    warpMode = true;

}

function stopWarp() {

    warpMode = false;

}