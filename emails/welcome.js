import { readFile } from "node:fs/promises";
import { resolveColor, generateColorway } from "./colors.js";

export async function getWelcomeTemplate() {

    const template = await readFile(
        new URL("./templates/welcome.html", import.meta.url),
        "utf8"
    );

    return template;
}

export async function buildWelcomeEmail(template, subscriber) {

    const color = subscriber.color ?? "White";

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

    // Replace subscriber placeholders.

    for (const [key, value] of Object.entries(subscriber)) {

        body = body.replaceAll(
            `{{${key}}}`,
            String(value ?? "")
        );
    }

    return body;
}