import { exemplarComparison } from "./exemplar.js";
import { askOpenAI } from "./openai.js";
import { prompts, exemplarPrompts } from "./prompts.js";

const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California",
    "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
    "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
    "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
    "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
    "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const stateAbbreviations = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const carExemplars = [
    "Acura", "Alfa Romeo", "AMC", "Aston Martin", "Audi",
    "Bentley", "BMW", "Buick", "Cadillac", "Chevrolet",
    "Chrysler", "Citroën", "Daewoo", "Daihatsu", "Datsun",
    "Dodge", "Ferrari", "Fiat", "Fisker", "Ford",
    "Genesis", "Geo", "GMC", "Honda", "Hummer",
    "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep",
    "Kia", "Lamborghini", "Lancia", "Land Rover", "Lexus",
    "Lincoln", "Lotus", "Lucid", "Maserati", "Mazda",
    "McLaren", "Mercedes-Benz", "Mercury", "Mini", "Mitsubishi",
    "Nissan", "Oldsmobile", "Opel", "Peugeot", "Plymouth",
    "Polestar", "Pontiac", "Porsche", "Ram", "Renault",
    "Rivian", "Rolls-Royce", "Saab", "Saturn", "Scion",
    "Seat", "Škoda", "Smart", "Subaru", "Suzuki",
    "Tesla", "Toyota", "Volkswagen", "Volvo"
];

export async function normalizeAnswer(key, answer) {
    switch (key) {
        case "name":
            return answer
                .trim()
                .toLowerCase()
                .replace(/\b\w/g, character => character.toUpperCase());

        case "college": {
            console.log(`[OpenAI fallback] ${input}`);
            const result = await askOpenAI(answer, prompts.college);

            return result.trim().toUpperCase() === "UNKNOWN"
                ? null
                : result.trim();
        }

        case "birth": {
            const months = [
                "January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December"
            ];

            const input = String(answer).trim();

            // Numeric months: 1–12, including leading zeros
            if (/^0?[1-9]$|^1[0-2]$/.test(input)) {
                return months[Number(input) - 1];
            }

            // Full month names and abbreviations
            const match = months.find(
                month =>
                    month.toLowerCase() === input.toLowerCase() ||
                    month.slice(0, 3).toLowerCase() === input.toLowerCase()
            );

            if (match) return match;

            // Existing exemplar/OpenAI fallback for misspellings
            const result = await normalizeWithExemplars(
                input,
                months,
                prompts.birth,
                true
            );

            return result && months.includes(result) ? result : null;
        }

        case "state": {
            const input = String(answer).trim();

            const index = states.findIndex(
                state => state.toLowerCase() === input.toLowerCase()
            );

            if (index !== -1) return stateAbbreviations[index];

            if (stateAbbreviations.includes(input.toUpperCase())) {
                return input.toUpperCase();
            }
            console.log(`[OpenAI fallback] ${input}`);
            const result = await askOpenAI(input, prompts.state);

            const abbreviation = result.trim().toUpperCase();

            return stateAbbreviations.includes(abbreviation)
                ? abbreviation
                : null;
        }

        case "car":
            return await normalizeWithExemplars(
                answer,
                carExemplars,
                prompts.car,
                false
            );
  
        case "color": {
            const exemplars = [
                "Red", "Orange", "Yellow", "Green",
                "Blue", "Purple", "Pink", "Brown",
                "Black", "White", "Gray"
            ];

            return await normalizeWithExemplars(
                answer,
                exemplars,
                prompts.color,
                false
            );
        }

        case "carname": {
            const name = String(answer).trim();

            if (name.length <= 2 && name === name.toLowerCase()) {
                return "No";
            }

            return name
                .toLowerCase()
                .replace(/\b\w/g, character => character.toUpperCase());
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
            ...exemplarPrompts.strict
        ]
        : [
            ...instructions,
            "These exemplars are references, not an exhaustive list:",
            exemplars.join(", "),
            ...exemplarPrompts.flexible
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