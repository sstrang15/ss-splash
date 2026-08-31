import { initializeTyping } from "./typing.js";


const state = {
    initialized: false,
    status: "ready",
    currentQuestion: 0
};

const answers = {};

let questionTrack = [];

async function loadQuestions() {
	const response = await fetch("/assets/data/questions.csv");
	const csv = await response.text();

	console.log("Csv Loaded")
	return csv
}

function parseQuestions(csv){
	let questions = [];
	const rows = csv.trim().split("\n");
	const headers = rows[0].split(",")
	let insideQuotes = false;
	let question = {};
	let text = "";
	for (let i = 1; i < rows.length; i++) {

		let row = rows[i]
		let comma_counter = 0;

		for (const character of row) {
			// console.log(character)
			if (character == "\"" && !insideQuotes) {
				// console.log(character)
				insideQuotes = true;

			} else if (character == "\"" && insideQuotes) {

				insideQuotes = false;

				question[headers[comma_counter]] = text
				text = ""

			} else if (character == "," && !insideQuotes) {
				comma_counter++;

			} else {
				text += character

			}
		}
		questions.push(question)
		question = {}
	}

	console.log("Questions parsed", questions)

	return questions;
}

export async function initializeQuestions() {

    console.log("questions initialized");

    const csv = await loadQuestions();

    questionTrack = parseQuestions(csv);

    state.initialized = true;

    const consent = await createQuestionIntro();

    if (consent === "yes") {

        state.status = "questions";

        const question = questionTrack[state.currentQuestion];

        createFollowupQuestion(question);
        createFollowupInput(question);
    } else {

        state.status = "declined";
    }
}

function createQuestionIntro() {

    const splashMessage = document.querySelector(".splash-message");

    const introForm = document.createElement("form");
    introForm.id = "question-intro-form";

    const intro = document.createElement("div");
    intro.id = "question-intro";

    const message = document.createElement("div");
    message.className = "followup-question";

    message.textContent =
        "We're putting together something cool and would like to ask you a few quick questions.";

    const prompt = document.createElement("span");
    prompt.className = "email-prompt";
    prompt.textContent = "> Enter";

    const choices = document.createElement("div");
    choices.className = "question-intro-choices";


    const yes = document.createElement("input");
    yes.type = "radio";
    yes.name = "question-consent";
    yes.value = "yes";
    yes.id = "question-consent-yes";


    const yesLabel = document.createElement("label");
    yesLabel.htmlFor = "question-consent-yes";
    yesLabel.textContent = "Yes";


    const no = document.createElement("input");
    no.type = "radio";
    no.name = "question-consent";
    no.value = "no";
    no.id = "question-consent-no";


    const noLabel = document.createElement("label");
    noLabel.htmlFor = "question-consent-no";
    noLabel.textContent = "No";


    choices.appendChild(prompt);

    choices.appendChild(yes);
    choices.appendChild(yesLabel);

    choices.appendChild(no);
    choices.appendChild(noLabel);

    intro.appendChild(message);
    intro.appendChild(choices);

    introForm.appendChild(intro);

    splashMessage.appendChild(introForm);

    console.log("Question intro created");

    return new Promise((resolve) => {

        introForm.addEventListener("change", (event) => {

            const consent = handleQuestionIntro(event);

            if (consent) {
                introForm.remove();
                console.log("Question was resolved.")
                resolve(consent);
            }
        });
    });
}


function handleQuestionIntro(event) {

    if (event.target.name !== "question-consent") {
        return;
    }

    const choice = event.target.value;

    console.log("Question consent:", choice);

    return choice;
}

function handleQuestionSubmit(event) {

    event.preventDefault();

    const followup = document.querySelector("#followup");
    const form = document.querySelector("#followup-form")
    const input = followup.querySelector("input");
    const answer = input.value.trim();
    const question = questionTrack[state.currentQuestion];
    const status = document.querySelector("#status")

    if (!answer) {
    	status.textContent = "Answer not provided."
        return;
    } else {
    	status.textContent = `${question.key} been provided`
    }

    // answers[question.key] = answer;

    state.currentQuestion++

    form.reset()

    console.log("Question answer:", answer);
}


function createFollowupQuestion(question) {
	console.log(question)
    const followupForm = document.createElement("form");
    const splashMessage = document.querySelector(".splash-message")
    followupForm.id = "followup-form";


    const followup = document.createElement("div");
    followup.id = "followup";

    const questionElement = document.createElement("div");
    questionElement.className = "followup-question";
    questionElement.textContent = question.prompt;

    followup.appendChild(questionElement);
    followupForm.appendChild(followup);
    splashMessage.appendChild(followupForm);

    followupForm.addEventListener("submit", handleQuestionSubmit);
    console.log("Followup form created")
}


function createFollowupInput(question) {

    const followup = document.querySelector("#followup");

    const row = document.createElement("div");
    row.className = "followup-answer";

    const prompt = document.createElement("span");
    prompt.className = "email-prompt";
    prompt.textContent = "> Enter";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = question.key;

    const questionStatus = document.createElement("div");
    questionStatus.id = "status";

    row.appendChild(prompt);
    row.appendChild(input);
    row.appendChild(questionStatus);

    followup.appendChild(row);

    input.focus();

    console.log("Input has been provided");
}


async function submitFollowup(email, answers) {
    // fetch(...)
}