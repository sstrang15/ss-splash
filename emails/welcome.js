import { readFile } from "node:fs/promises";

export async function getWelcomeTemplate() {

    const template = await readFile(
        new URL("./welcome.html", import.meta.url),
        "utf8"
    );

    return template;
}