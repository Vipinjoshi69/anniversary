/*=========================================
    OUR UNIVERSE ❤️
    LETTER (Chapter Four)

    Every quoted line below is real, pulled
    from the actual WhatsApp export, in the
    order it happened. Edit freely - this is
    meant to sound like you, not like me.
=========================================*/

const letterParagraphs = [

    "It's strange to think our whole story began with something as small as one word. On 25th April 2022, at 12:12 in the afternoon, you typed <em>'Hi.'</em> Fifteen minutes later I finally replied, <em>'Hello.'</em> Neither of us knew that those few minutes would become the beginning of the most beautiful chapter of our lives.",

    "For months we were just two people talking about jobs and YouTube channels. Then on 25th July, you asked me something that changed everything without either of us realizing it yet: <em>'Help krdoge meri?'</em> I said yes without thinking twice. Looking back now, I realize I wasn't just helping you with work... I was slowly falling in love with the most beautiful soul I'd ever met.",

    "18th August, almost midnight. You were teasing me about getting married, and I said something I meant far more than I let on - <em>'Kab leke aani hai baarat.'</em> You laughed and replied, <em>'Kb la re ho.'</em> It sounded like a joke, but somewhere deep inside my heart, I had already started imagining a future where that joke would become our reality.",

    "A little later I confessed that my heartbeat had gone from 72 to 120. You smiled and asked, <em>'Sach m?'</em> I answered, <em>'Haan ji.'</em> The funny thing is... after all these years, nothing has changed. You still make my heart race exactly the same way.",

    "The next morning, and every morning after that, 'Good Morning' was never just another greeting. Every message from you became the best part of my day. By 20th August you had already become my <em>'Baby Doll'</em>, and every conversation made me realize that happiness had quietly found its way into my life through you.",

    "Before I even realized it, missing you had become a habit. Seeing your name on my phone brought a smile I couldn't hide, and whenever you disappeared for a while, everything felt strangely incomplete. Somewhere between those endless chats, late-night conversations, and silly jokes... you became my home.",

    "Then came 10th September. It was raining that evening. I still remember typing <em>'Barish aa gyi yrr'</em> while waiting for you. And then... you arrived. In that single moment, everything around us faded away. The rain, the crowd, the noise... nothing mattered anymore. All I could see was you. Meeting you for the first time felt like finally finding someone I'd been waiting for without even knowing it.",

    "Twelve days later, on 22nd September, I wrote something I'll never forget - <em>'Finally apni baby ko hug kar liya.'</em> And your reply, <em>'Hug ni bht kch krlia'</em>, still makes me smile every single time. Some memories never grow old, no matter how many years pass.",

    "As time passed, our conversations became longer, our bond became stronger, and our love became quieter but deeper. We laughed over the smallest things, argued over the silliest reasons, teased each other endlessly, and somehow, every single moment only made us closer. Loving you never felt like a choice... it simply became the most natural part of my life.",

    "Even today, whenever something good happens, you're the first person I want to tell. Whenever life feels difficult, you're the first person I want beside me. No matter how much time passes, one thing never changes... my heart still looks for you in every beautiful moment.",

    "Manisha, from one simple <em>'Hi'</em> to thousands of messages, countless smiles, endless memories, and dreams of forever... you've given my life a meaning I never knew it was missing. Thank you for every laugh, every hug, every late-night conversation, every 'Good Morning', every 'Miss You', and every little moment that slowly became the most precious memories of my life.",

    "I don't just love you because you're beautiful. I love you because you've become my peace, my happiness, my safest place, and the person I want beside me in every chapter still waiting to be written. If I had the chance to live this life again, I'd still choose you... every single time. ❤️"

];

const letterScene = document.getElementById("letter");
const letterBody = document.getElementById("letterBody");
const letterBackBtn = document.getElementById("letterBackBtn");
const letterContinueBtn = document.getElementById("letterContinueBtn");

let letterRevealed = false;
let letterTimeoutIds = [];

/*=========================================
    BUILD (runs once)
=========================================*/

function initLetter() {

    letterParagraphs.forEach(text => {

        const p = document.createElement("p");

        p.className = "letter-line";

        // innerHTML is safe here - content is authored entirely by us above,
        // not user input - and it's what lets the <em> quotes render nicely.
        p.innerHTML = text;

        letterBody.appendChild(p);

    });

    letterBackBtn.addEventListener("click", goHome);

    letterContinueBtn.addEventListener("click", handleLetterContinue);

}

function handleLetterContinue() {

    if (typeof unlockApp === "function") unlockApp("forever");

    hideLetter();

    // Continue directly into the next chapter instead of dropping back
    // to the home screen - matches openForever()'s own transition timing.
    setTimeout(() => {

        if (typeof showEnding === "function") showEnding();

    }, 400);

}

/*=========================================
    REVEAL (paragraphs fade in one by one,
    like reading a letter unfold)

    Stagger is capped so the reveal always
    finishes in a reasonable window (roughly
    4.5s) no matter how many paragraphs the
    letter has - a long letter should never
    make the Continue button take forever
    to appear.
=========================================*/

function revealLetter() {

    if (letterRevealed) return;

    letterRevealed = true;

    const lines = document.querySelectorAll(".letter-line");

    const stagger = Math.max(180, Math.min(500, 4500 / Math.max(lines.length, 1)));

    lines.forEach((line, i) => {

        const id = setTimeout(() => {

            line.classList.add("show");

        }, stagger * i);

        letterTimeoutIds.push(id);

    });

    const signatureId = setTimeout(() => {

        document.querySelector(".letter-signature").classList.add("show");

        letterContinueBtn.classList.add("show");

    }, stagger * lines.length + 500);

    letterTimeoutIds.push(signatureId);

}

/*=========================================
    SHOW / HIDE
=========================================*/

function showLetter() {

    letterScene.classList.add("show");
    revealLetter();

}

function hideLetter() {

    letterScene.classList.remove("show");

}

document.addEventListener("DOMContentLoaded", initLetter);
