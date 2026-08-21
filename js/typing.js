const pauseScale = {
    1: 75,
    2: 100,
    3: 125,
    4: 150,
    5: 200,
    6: 250,
    7: 300,
    8: 400,
    9: 500,
    10: 650,
    11: 800,
    12: 1000,
    13: 1250,
    14: 1500,
    15: 1800,
    16: 2200,
    17: 2700,
    18: 3200,
    19: 3800,
    20: 4500
};

const firstSentenceSpeed = 25;
const normalSpeed = 35;
const firstSentencePause = 1200;
const sentencePause = 300;



export async function initializeTyping(element, text) {
	
	let firstSentence = true;
	element.textContent = "";

	for (let index=0; index < text.length; index++) {
		if (text[index] === "{") {
			const remainingText = text.slice(index);
			const pauseMatch = remainingText.match(/^\{([1-9]|1[0-9]|20)\}/);

			if (pauseMatch) {
				const pauseLevel = Number(pauseMatch[1]);

				await new Promise(resolve => 
					setTimeout(resolve, pauseScale[pauseLevel]));
				index += pauseMatch[0].length - 1;
				continue;
			}
		}

		const character = text[index];

		await new Promise(resolve =>
		    setTimeout(
		        resolve,
		        firstSentence ? firstSentenceSpeed : normalSpeed
		    )
		);

		element.textContent += character;

		const nextCharacter = text[index + 1];

		if (
		    (character === "." ||
		     character === "!" ||
		     character === "?") &&
		    /\s/.test(nextCharacter)
		) {
		    await new Promise(resolve =>
		        setTimeout(
		            resolve,
		            firstSentence
		                ? firstSentencePause
		                : sentencePause
		        )
		    );

		    firstSentence = false;
		}

	}
	console.log(element)
	return element
}