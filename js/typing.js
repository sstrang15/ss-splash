import { playSound, restartSound, stopSound } from "./sound.js";

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

const firstSentenceSpeed = 20;
const normalSpeed = 30;
const firstSentencePause = 1200;
const sentencePause = 150;



export async function initializeTyping(element, text, speed) {
	
	let firstSentence = true;
	element.textContent = "";

	playSound();

	for (let index=0; index < text.length; index++) {
		if (text[index] === "{") {
			const remainingText = text.slice(index);
			const pauseMatch = remainingText.match(/^\{([1-9]|1[0-9]|20)\}/);

			if (pauseMatch) {
				const pauseLevel = Number(pauseMatch[1]);
				const pauseDuration = pauseScale[pauseLevel] * speed;
				
				await new Promise(resolve => 
					setTimeout(resolve, pauseScale[pauseDuration]));

				restartSound();

				index += pauseMatch[0].length - 1;
				continue;
			}
		}

		const character = text[index];

		// console.log(
		//     character,
		//     firstSentence,
		//     firstSentence ? firstSentenceSpeed : normalSpeed
		// );

		await new Promise(resolve =>
		    setTimeout(
		        resolve,
		        firstSentence ? firstSentenceSpeed*speed : normalSpeed*speed
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

		if (firstSentence) {
		    element.classList.add("message-small");
		}

		firstSentence = false;

		    firstSentence = false;
		}

	}
	stopSound();
	console.log({
	    element,
	    text
	});
	return element
}