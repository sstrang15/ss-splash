import { initializeTyping } from "./typing.js";
import { initializeSound } from "./sound.js";
import { initializeNewsletter } from "./newsletter.js";
import { initializeQuestions } from "./questions.js";



const response = await fetch("/assets/text/splash.txt");
const splashText = await response.text();

const statusCommand = document.querySelector("#status-command");
const statusValue = document.querySelector("#status-value");
const splashOutput = document.querySelector("#splash-text");
const emailPrompt = document.querySelector(".email-prompt");
const emailInput = document.querySelector("#email-input");

await initializeTyping(statusCommand, "> site_status", 1);
await initializeTyping(statusValue, "under construction", 1);
await initializeTyping(splashOutput, splashText, 1);
await initializeTyping(emailPrompt, "> Enter", 1);

emailInput.style.visibility = "visible";

initializeNewsletter();

