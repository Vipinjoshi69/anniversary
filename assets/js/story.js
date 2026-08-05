let currentScene = 0;

function startStory() {

    currentScene = 0;

    renderScene(currentScene);

}

function renderScene(index) {

    const story = document.getElementById("storyContainer");

    const memory = memories[index];

    story.innerHTML = createScene(memory);

}

function nextScene() {

    currentScene++;

    if (currentScene >= memories.length) {

        showEnding();

        return;

    }

    renderScene(currentScene);

}