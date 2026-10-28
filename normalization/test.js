import { normalizeAnswer } from "../normalization/normalize.js";

const tests = [
    ["birth", "Jul"],
    ["birth", "7"],
    ["birth", "Jule"],
    ["state", "gah"],
    ["state", "Georgia"],
    ["state", "ga"],
    ["carname", "Ni"],
    ["carname", "no"],
    ["college", "SAT"],
    ["college", "GT"],
    ["car", "volvo v70"],
    ["color", "navy blue"]
];

for (const [key, answer] of tests) {
    try {
        const result = await normalizeAnswer(key, answer);
        console.log(`${key}: "${answer}" → "${result}"`);
    } catch (error) {
        console.error(`${key}: "${answer}" → ERROR:`, error.message);
    }
}