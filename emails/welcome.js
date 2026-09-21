import { readFile } from "node:fs/promises";

export async function getWelcomeTemplate() {

    const template = await readFile(
        new URL("./welcome.html", import.meta.url),
        "utf8"
    );

    return template;
}

export function buildWelcomeEmail(template, subscriber) {

    let body = template;

    for (const [key, value] of Object.entries(subscriber)) {

        body = body.replaceAll(
            `{{${key}}}`,
            value ?? ""
        );
    }

    return body;
}