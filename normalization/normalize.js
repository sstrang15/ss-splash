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
        	    "January", "Jan", "Janu",
        	    "February", "Feb", "Febr",
        	    "March", "Mar", "Marc",
        	    "April", "Apr", "Apri",
        	    "May",
        	    "June", "Jun",
        	    "July", "Jul",
        	    "August", "Aug", "Augu",
        	    "September", "Sep", "Sept",
        	    "October", "Oct", "Octo",
        	    "November", "Nov", "Nove",
        	    "December", "Dec", "Dece"
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
        	    "Identify the vehicle the user owned.",
        	    "Return the manufacturer and model when identifiable.",
        	    "Preserve trim levels and model years when provided.",
        	    "Expand recognizable manufacturer abbreviations.",
        	    "Correct spelling and capitalization.",
        	    "Do not invent missing vehicle details.",
        	    "Return only the normalized vehicle name.",
        	    "If the vehicle cannot be identified, return UNKNOWN."
        	],
            false
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
                "Identify and standardize the color the user intended.",
                "Preserve specific shades such as Navy, Burgundy, and Forest Green.",
                "When multiple colors are mentioned, prioritize the first color.",
                "Return only the normalized name of that color.",
                "Correct spelling and capitalization.",
                "Never explain your reasoning."
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
		    "These exemplars are references, not an exhaustive list:",
		    exemplars.join(", "),
		    "Preserve the specificity of the user's answer.",
		    "Do not reduce a specific answer to a broader category.",
		    "Return only the normalized answer.",
		    "Never explain your reasoning.",
		    "Never ask questions.",
		    "If the answer cannot be identified, return UNKNOWN."
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