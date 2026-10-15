export function exemplarComparison(answer, exemplar) {
    const input = String(answer).trim().toLowerCase();
    const target = String(exemplar).trim().toLowerCase();

    if (!input || !target) return 0;
    if (input === target) return 1;

    let score = 0;
    const available = [...target];

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        // Shared characters
        const index = available.indexOf(char);

        if (index !== -1) {
            score += 1;
            available.splice(index, 1);
        }
    }

    // Longest common subsequence
    score += 4 * longestCommonSubsequence(input, target);

    return score / (5 * Math.max(input.length, target.length));
}

function longestCommonSubsequence(input, target) {
    let previous = new Array(target.length + 1).fill(0);
    let current = new Array(target.length + 1).fill(0);

    for (const char of input) {
        current[0] = 0;

        for (let j = 0; j < target.length; j++) {
            if (char === target[j]) {
                current[j + 1] = previous[j] + 1;
            } else {
                current[j + 1] = Math.max(
                    previous[j + 1],
                    current[j]
                );
            }
        }

        [previous, current] = [current, previous];
    }

    return previous[target.length];
}
