/*=========================================
    OUR UNIVERSE ❤️
    LOADER
=========================================*/

const bootLines = [

    "Initializing Memory Engine...",

    "Loading 4 Years Of Memories...",

    "Decrypting Happiness...",

    "Searching For Manisha...",

    "Identity Confirmed ❤️",

    "Welcome Back, Manisha."

];

const loaderText = document.getElementById("loaderText");
const progressBar = document.getElementById("progressBar");

let currentLine = 0;
let currentChar = 0;

document.addEventListener("DOMContentLoaded", () => {

    typeNextCharacter();

});

function typeNextCharacter(){

    if(currentLine >= bootLines.length){

        finishLoader();

        return;

    }

    const line = bootLines[currentLine];

    if(currentChar < line.length){

        loaderText.innerHTML += line.charAt(currentChar);

        currentChar++;

        updateProgress();

        setTimeout(typeNextCharacter,35);

    }

    else{

        loaderText.innerHTML += "<br>";

        currentLine++;

        currentChar = 0;

        setTimeout(typeNextCharacter,350);

    }

}

function updateProgress(){

    const totalCharacters =
        bootLines.join("").length;

    const typedCharacters =
        loaderText.innerText.replace(/\n/g,"").length;

    const percent =
        (typedCharacters / totalCharacters) * 100;

    progressBar.style.width = percent + "%";

}

function finishLoader(){

    progressBar.style.width = "100%";

    setTimeout(()=>{

        showLanding();

    },800);

}