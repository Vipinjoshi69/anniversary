/*=========================================
        CHAT ENGINE
=========================================*/

const chatContainer =
    document.getElementById("chatContainer");

const typingIndicator =
    document.getElementById("typingIndicator");

let currentMessageIndex = 0;

let storyFinished = false;


/*=========================================
        START STORY
=========================================*/

async function startWhatsAppStory() {

    currentMessageIndex = 0;

    chatContainer.innerHTML = "";

    lockChat();

    await renderStory();

}


/*=========================================
        STORY LOOP
=========================================*/

async function renderStory() {

    for (const item of chatMessages) {

        switch (item.type) {

            case "date":

                addDateDivider(item);

                await delay(700);

                break;

            case "message":

                await showTyping();

                await addMessage(item);

                await delay(900);

                break;

            case "image":

                await delay(700);

                addImageMessage(item);

                await delay(1500);

                break;

            case "voice":

                await delay(700);

                addVoiceMessage(item);

                await delay(1400);

                break;

            case "transition":

                await showTransition(item.text);
                break;

        }

    }

    unlockChat();

}

function delay(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

function lockChat() {

    chatContainer.style.overflowY = "hidden";

}

function unlockChat() {

    chatContainer.style.overflowY = "auto";

    storyFinished = true;

    showMemoryToast();

}

function showMemoryToast() {

    const toast = document.createElement("div");

    toast.className = "memory-toast";

    toast.innerHTML = "❤️ Explore our memories";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

    }, 4000);

}

// const chatContainer =
//     document.getElementById("chatContainer");

// const typingIndicator =
//     document.getElementById("typingIndicator");

// async function startChat() {

//     chatContainer.innerHTML = "";

//     for (const item of chatMessages) {

//         switch (item.type) {

//             case "date":

//                 addDateDivider(item);

//                 await delay(900);

//                 break;

//             case "message":

//                 await showTyping();

//                 await addMessage(item);

//                 await delay(700);

//                 break;
//             case "image":

//                 await delay(600);

//                 addImageMessage(item);

//                 await delay(1200);

//                 break;
//             case "voice":

//                 await delay(800);

//                 addVoiceMessage(item);

//                 await delay(1500);

//                 break;

//             case "transition":

//                 await showTransition(item.text);

//                 break;

//         }

//     }

// }

function showTyping() {

    return new Promise(resolve => {

        typingIndicator.classList.add("show");

        chatContainer.scrollTop = chatContainer.scrollHeight;

        setTimeout(() => {

            typingIndicator.classList.remove("show");

            resolve();

        }, 1500);

    });

}

async function addMessage(msg) {

    const bubble = document.createElement("div");

    bubble.className = `message ${msg.sender}`;

    // bubble.innerHTML = `
    //     <div class="msg-text"></div>
    //     <small>${msg.time}</small>
    // `;
    bubble.innerHTML = `
    <div class="msg-text"></div>

    <div class="msg-footer">

        <span class="msg-time">
            ${msg.time}
        </span>

        ${msg.sender === "vipin"
            ? `<span class="ticks">✓✓</span>`
            : ""
        }

    </div>
`;

    chatContainer.appendChild(bubble);

    bubble.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });

    const textContainer = bubble.querySelector(".msg-text");

    await typeMessage(textContainer, msg.text);

}

function addDateDivider(item) {

    const div = document.createElement("div");

    div.className = "date-divider";

    div.innerHTML = `

        <strong>${item.text}</strong>

        <small>${item.subtitle}</small>

    `;

    chatContainer.appendChild(div);

    div.scrollIntoView({
        behavior: "smooth"
    });

}

function typeMessage(element, text) {

    return new Promise(resolve => {

        let i = 0;

        const timer = setInterval(() => {

            element.textContent += text.charAt(i);

            i++;

            chatContainer.scrollTop = chatContainer.scrollHeight;

            if (i >= text.length) {

                clearInterval(timer);

                resolve();

            }

        }, 40);

    });

}
const transition = document.getElementById("storyTransition");
const transitionText = document.getElementById("transitionText");

function showTransition(text) {

    return new Promise(resolve => {

        transitionText.textContent = text;

        transition.classList.add("show");

        setTimeout(() => {

            transition.classList.remove("show");

            resolve();

        }, 2500);

    });

}

function addImageMessage(item) {

    const bubble = document.createElement("div");

    bubble.className = `message ${item.sender}`;

    bubble.innerHTML = `

        <img class="chat-photo"
             src="${item.image}">

        <div class="caption">

            ${item.caption}

        </div>

        <small>

            ${item.time}

        </small>

    `;

    chatContainer.appendChild(bubble);

    bubble.scrollIntoView({

        behavior: "smooth"

    });

}

const viewer =
    document.getElementById("imageViewer");

const viewerImage =
    document.getElementById("viewerImage");

const closeImage =
    document.getElementById("closeImage");

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("chat-photo")) {

        viewer.classList.add("show");

        viewerImage.src = e.target.src;

    }

});

closeImage.onclick = () => {

    viewer.classList.remove("show");

};

function addVoiceMessage(item) {

    const bubble = document.createElement("div");

    bubble.className = `message ${item.sender}`;

    bubble.innerHTML = `
<div class="voice-note">

    <button class="voice-play">▶</button>

    <div class="voice-wave">
        <div></div><div></div><div></div>
        <div></div><div></div><div></div>
        <div></div>
    </div>

    <span class="voice-duration">
        ${item.duration}
    </span>

</div>

<div class="msg-footer">

    <span class="msg-time">${item.time}</span>

    ${item.sender === "vipin"
            ? `<span class="ticks">✓✓</span>`
            : ""
        }

</div>
`;

    const audio = new Audio(item.audio);

    const playBtn = bubble.querySelector(".voice-play");

    playBtn.addEventListener("click", () => {

        if (audio.paused) {

            audio.play();

            playBtn.textContent = "⏸";

            bubble.classList.add("playing");
            pauseTheme();

        } else {

            audio.pause();

            playBtn.textContent = "▶";

            bubble.classList.remove("playing");
            playTheme();

        }

    });

    audio.addEventListener("ended", () => {

        playBtn.textContent = "▶";

        bubble.classList.remove("playing");

    });

    chatContainer.appendChild(bubble);

    bubble.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });

}