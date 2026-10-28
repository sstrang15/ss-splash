export const prompts = {
    college: [
        "Identify the college or university.",
        "Only recognize colleges and universities as valid institutions.",
        "Exclude examinations, entrance tests, certifications, and other educational assessments.",
        "Expand abbreviations.",
        "Return its official name.",
        "If the input is not a college or university, return UNKNOWN.",
        "Return only the normalized answer."
    ],

    birth: [
        "Identify the intended calendar month."
    ],

    state: [
        "Identify the intended U.S. state.",
        "Correct recognizable spelling mistakes.",
        "Return only its official two-letter postal abbreviation.",
        "If the state cannot be identified, return UNKNOWN."
    ],

    car: [
        "Identify the vehicle the user owned.",
        "Return the manufacturer and model when identifiable.",
        "Preserve trim levels and model years when provided.",
        "Expand recognizable manufacturer abbreviations.",
        "Correct spelling and capitalization.",
        "Do not invent missing vehicle details.",
        "Return only the normalized vehicle name.",
        "If the vehicle cannot be identified, return UNKNOWN."
    ],

    color: [
        "Identify and standardize the color the user intended.",
        "Preserve specific shades such as Navy, Burgundy, and Forest Green.",
        "When multiple colors are mentioned, prioritize the first color.",
        "Return only the normalized name of that color.",
        "Correct spelling and capitalization.",
        "Never explain your reasoning."
    ]
};

export const exemplarPrompts = {
    strict: [
        "Return only the exact exemplar.",
        "If the answer cannot be determined, return UNKNOWN."
    ],

    flexible: [
        "Preserve the specificity of the user's answer.",
        "Do not reduce a specific answer to a broader category.",
        "Return only the normalized answer.",
        "Never explain your reasoning.",
        "Never ask questions.",
        "If the answer cannot be identified, return UNKNOWN."
    ]
};