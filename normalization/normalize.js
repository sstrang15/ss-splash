import { exemplarComparison } from "./exemplar.js";
import { askOpenAI } from "./openai.js";


export async function normalizeAnswer(key, answer) {
    switch (key) {
        case "name":
            return answer
                .trim()
                .toLowerCase()
                .replace(/\b\w/g, character => character.toUpperCase());

        case "college":
            return await askOpenAI(answer, [
                "Identify the college or university.",
                "Expand abbreviations.",
                "Return its official name.",
                "Return only the normalized answer."
            ]);

        case "birth": {
            const exemplars = [
                "January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December"
            ];

            return await normalizeWithExemplars(
                answer,
                exemplars,
                ["Identify the month the user intended."],
                true
            );
        }

    case "car": {
        const exemplars = [
            "Toyota", "Honda", "Ford", "Chevrolet",
            "BMW", "Mercedes-Benz", "Audi", "Volkswagen",
            "Nissan", "Hyundai", "Kia", "Mazda",
            "Subaru", "Lexus", "Porsche", "Tesla"
        ];

        return await normalizeWithExemplars(
            answer,
            exemplars,
            [
                "Identify the car manufacturer the user intended.",
                "Recognize common abbreviations and misspellings."
            ],
            true
        );
    }

    case "color": {
        const exemplars = [
            "Red", "Orange", "Yellow", "Green",
            "Blue", "Purple", "Pink", "Brown",
            "Black", "White", "Gray"
        ];

        return await normalizeWithExemplars(
            answer,
            exemplars,
            [
                "Identify the color the user intended.",
                "Recognize common synonyms and shades.",
                "Choose the closest matching color from the exemplars."
            ],
            false
        );
    }


        default:
            return answer;
    }
}

async function normalizeWithExemplars(
    answer,
    exemplars,
    instructions = [],
    color = true
) {

    if (!exemplars.length) return null;

    // 1. Check for an exact match
    const exactMatch = exemplars.find(
        exemplar => exemplar.toLowerCase() === String(answer).trim().toLowerCase()
    );

    if (exactMatch) return exactMatch;

    // 2. Rank exemplars by similarity
    const ranked = exemplars
        .map(exemplar => ({
            exemplar,
            score: exemplarComparison(answer, exemplar)
        }))
        .sort((a, b) => b.score - a.score);

    const bestMatch = ranked[0];
    const secondMatch = ranked[1];

    // 3. Evaluate confidence
    const minimumScore = 0.75;
    const minimumMargin = 0.15;

  	if (
      color &&
      bestMatch.score >= minimumScore &&
        (!secondMatch || bestMatch.score - secondMatch.score >= minimumMargin)
    ) {
        return bestMatch.exemplar;
    }

    // 4. Ask OpenAI when confidence is insufficient
    console.log(`[OpenAI fallback] ${answer}`);

    const result = await askOpenAI(answer, color
        ? [
            ...instructions,
            "Choose the intended value from these exemplars:",
            exemplars.join(", "),
            "Return only the exact exemplar.",
            "If the answer cannot be determined, return UNKNOWN."
        ]
        : [
            ...instructions,
            "The following are examples of valid values, not categories:",
            exemplars.join(", "),
            "Preserve the specificity of the user's answer.",
            "Do not replace a specific shade with a broader color.",
            "For example: Navy must remain Navy, not Blue.",
            "Burgundy must remain Burgundy, not Red.",
            "Correct spelling and capitalization only when necessary.",
            "When multiple colors are mentioned, prioritize the first color.",
            "Return only the normalized name of that color, without explanation.",
            "Return UNKNOWN only if the input is not recognizable."
        ]
    );

    if (!color) {
    	return result.trim().toUpperCase() === "UNKNOWN"
    	    ? null
    	    : result.trim();
    }

    const match = exemplars.find(
        exemplar => exemplar.toLowerCase() === result.trim().toLowerCase()
    );

    return match ?? null;

}