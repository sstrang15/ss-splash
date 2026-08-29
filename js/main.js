import { initializeTyping } from "./typing.js";
import { initializeSound } from "./sound.js";
import { initializeNewsletter } from "./newsletter.js";



const response = await fetch("/assets/text/splash.txt");
const splashText = await response.text();

const statusCommand = document.querySelector("#status-command");
const statusValue = document.querySelector("#status-value");
const splashOutput = document.querySelector("#splash-text");
const emailPrompt = document.querySelector(".email-prompt");
const emailInput = document.querySelector("#email-input");

await initializeTyping(statusCommand, "> site_status");
await initializeTyping(statusValue, "under construction");
await initializeTyping(splashOutput, splashText);
await initializeTyping(emailPrompt, "> Enter");

emailInput.style.visibility = "visible";

initializeNewsletter();
// main.js
// │
// ├── DOM elements
// ├── page initialization
// ├── updates interaction
// ├── animation sequence
// ├── interaction state
// ├── calls typing functions
// ├── calls sound functions
// └── coordinates everything

// await typeText("stephenstrang.com", fast);

// await pause(300);

// await typeText("> checking status", fast);

// await pause(700);

// await typeText("...", slow);

// await pause(1000);

// await typeText("under construction", fast);