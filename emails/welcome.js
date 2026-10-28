import { readFile } from "node:fs/promises";
import { resolveColor, generateColorway } from "./colors.js";
import { askOpenAI } from "../normalization/openai.js";

export async function getWelcomeTemplate() {

    const template = await readFile(
        new URL("./templates/welcome.html", import.meta.url),
        "utf8"
    );

    return template;
}

function hasAnswer(value) {
    return value != null &&
        String(value).trim() !== "" &&
        String(value).trim().toUpperCase() !== "N/A";
}

export async function buildWelcomeEmail(template, subscriber) {

    const color = hasAnswer(subscriber.color)
        ? subscriber.color
        : "White";

    let hex;

    if (color.trim().toLowerCase() === "white") {
        hex = "#FFFFFF";
    } else if (color.trim().toLowerCase() === "black") {
        hex = "#000000";
    } else if (["gray", "grey"].includes(color.trim().toLowerCase())) {
        hex = "#808080";
    } else {
        hex = await resolveColor(color);
    }

    const colorway = await generateColorway(hex ?? "#FFFFFF");
    
    const stylesheet = await readFile(
        new URL("./templates/welcome.css", import.meta.url),
        "utf8"
    );

    // Replace CSS variables with generated colors.

    let css = stylesheet;

    for (const [key, value] of Object.entries(colorway)) {

        const variable = `--color-${key.replace(/[A-Z]/g, letter =>
            `-${letter.toLowerCase()}`
        )}`;

        css = css.replaceAll(
            `var(${variable})`,
            value
        );
    }

    // Insert the personalized stylesheet.

    let body = template.replace(
        "</head>",
        `<style>${css}</style>\n</head>`
    );

    // Generate personalized observations before rendering.

    const collegeCheer = hasAnswer(subscriber.college)
        ? await askOpenAI(subscriber.college, [
            "Identify the most recognizable traditional cheer for this college.",
            "Examples: Georgia Tech → Go Jackets!, Alabama → Roll Tide!, Auburn → War Eagle!",
            "Use the authentic expression, not generic football commentary.",
            "Return only the cheer.",
            "If uncertain, return UNKNOWN."
        ])
        : null;

    const stateReference = hasAnswer(subscriber.state)
        ? await askOpenAI(subscriber.state, [
            "Identify the strongest recognizable person, place, thing, or cultural association with this U.S. state.",
            "Write one brief, conversational observation about it.",
            "Prefer distinctive associations such as Georgia peaches or Maine lobster.",
            "Avoid generic praise and invented facts.",
            "Return only the observation.",
            "If uncertain, return UNKNOWN."
        ])
        : null;

    const personalized = {
        ...subscriber,
        collegeCheer: collegeCheer?.trim().toUpperCase() === "UNKNOWN"
            ? ""
            : collegeCheer ?? "",
        stateReference: stateReference?.trim().toUpperCase() === "UNKNOWN"
            ? ""
            : stateReference ?? ""
    };

    const content = {
        greeting: hasAnswer(subscriber.name)
            ? `Hey ${subscriber.name}!`
            : "Hey there!",

        birthMessage: hasAnswer(subscriber.birth)
            ? `You are a ${subscriber.birth} baby.`
            : "",

        collegeMessage: personalized.collegeCheer,
        
        stateMessage: personalized.stateReference,

        colorMessage: hasAnswer(subscriber.color)
            ? "I also took note of your favorite color. Maybe this says something about your personality ;)"
            : "",

        carMessage: hasAnswer(subscriber.car)
            ? `Your first car was a ${subscriber.car}.`
            : " Dont you miss your first car, I still remember my first car a Volvo V70",

        carnameMessage: !hasAnswer(subscriber.carname)
            ? ""
            : subscriber.carname.toLowerCase() === "no"
                ? "No nickname? Fair enough!"
                : `And you named it ${subscriber.carname}!`
    };

    // Replace subscriber placeholders.

    for (const [key, value] of Object.entries({
        ...subscriber,
        ...personalized,
        ...content
    })) {

        body = body.replaceAll(
            `{{${key}}}`,
            String(value ?? "")
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&#39;")
        );
    }

    // Remove unanswered sections.

    body = body.replace(
        /<div class="welcome-section" id="(?:birth|state|college|color)">\s*<p>\s*<\/p>\s*<\/div>/g,
        ""
    );

    // Remove empty paragraphs.

    body = body.replace(/<p>\s*<\/p>/g, "");

    return body;
}