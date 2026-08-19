import { initializeTyping } from "./typing.js";
import { initializeSound } from "./sound.js";
import { initializeNewsletter } from "./newsletter.js";
/* =========================================================
   ELEMENTS
   ========================================================= */


const updatesTrigger = document.querySelector(
    ".updates-trigger"
);

const updatesForm = document.querySelector(
    ".updates-form"
);


/* =========================================================
   UPDATES INTERACTION
   ========================================================= */


/**
 * Opens and closes the updates form.
 */
updatesTrigger.addEventListener("click", () => {

    const isOpen =
        updatesTrigger.getAttribute("aria-expanded") === "true";

    updatesTrigger.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );

    updatesForm.hidden = isOpen;

});

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

await typeText("stephenstrang.com", fast);

await pause(300);

await typeText("> checking status", fast);

await pause(700);

await typeText("...", slow);

await pause(1000);

await typeText("under construction", fast);