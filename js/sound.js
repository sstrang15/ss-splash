const typingSound = new Audio("/assets/audio/thin-classic-today.wav");


typingSound.preload = "auto";
typingSound.volume = 0.2;
typingSound.loop = true;

export async function loadSound() {
    await typingSound.play();
    typingSound.pause();
    typingSound.currentTime = 0;

    console.log("typing sound loaded");
}

export function playSound() {
    typingSound.play();
}

export function stopSound() {
    typingSound.pause();
    typingSound.currentTime = 0;
}

export function restartSound() {
    typingSound.pause();
    typingSound.currentTime = 0;
    typingSound.play();
}
