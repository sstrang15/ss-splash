import { readFile } from "node:fs/promises";
import { generateColorway } from "./colors.js";

export async function getWelcomeTemplate() {

    const template = await readFile(
        new URL("./templates/welcome.html", import.meta.url),
        "utf8"
    );

    return template;
}

export async function buildWelcomeEmail(template, subscriber) {

    const colorway = await generateColorway(
        subscriber.color ?? "white"
    );

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