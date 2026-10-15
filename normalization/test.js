import { exemplarComparison } from "./exemplar.js";

import { normalizeAnswer } from "./normalize.js";

const tests = [
    ["name", "sTEPHEN sTRANG"],
    ["college", "gatech"],
    ["birth", "September"],
    ["birth", "septmber"],
    ["birth", "sept"],
    ["birth", "banana"],
    ["car", "toytoa"],
    ["car", "vw"],
    ["color", "blu"],
    ["color", "navy"],
    ["color", "grey"],
    ["color", "samon blue"],
    ["car", "camry"],
    ["car", "bmw 328i"],
    ["car", "ford f150"],
    ["car", "911 carrera"],
    ["car", "98 mustang gt"]
];

for (const [key, answer] of tests) {
    const result = await normalizeAnswer(key, answer);

    console.log(
        key.padEnd(10),
        answer.padEnd(20),
        "→",
        result
    );
}