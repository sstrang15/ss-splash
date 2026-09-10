import { initializeTyping } from "./typing.js";
import { initializeNewsletter } from "./newsletter.js";
import { initializeQuestions } from "./questions.js";
import { playSound, loadSound, restartSound } from "./sound.js";


const response = await fetch("/assets/text/splash.txt");
const splashText = await response.text();

const statusCommand = document.querySelector("#status-command");
const statusValue = document.querySelector("#status-value");
const splashOutput = document.querySelector("#splash-text");
const emailPrompt = document.querySelector(".input-prompt");
const emailInput = document.querySelector("#email-input");

const enterScreen = document.querySelector("#enter-screen");

enterScreen.addEventListener("click", async () => {

    
    await loadSound();

    playSound();

    enterScreen.remove();

    statusCommand.textContent = "> site_status";
    statusValue.textContent = "under construction";
    await initializeTyping(splashOutput, splashText, 1.2);
    await initializeTyping(emailPrompt, "> Enter", 1,2);

    emailInput.style.visibility = "visible";

    initializeNewsletter();
}, { once: true });
