import { initializeTyping } from "./typing.js";


const state = {
    initialized: false,
    status: "ready",
    currentQuestion: 0
};

const answers = {};

let questionTrack = [];

let subscriberEmail = "";

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

        for (let j = 0; j < row.length; j++) {

            const character = row[j];
            const nextCharacter = row[j + 1];

			if (character === "\"" && insideQuotes && nextCharacter === "\"") {

                text += "\"";
                j++;

            } else if (character == "\"" && !insideQuotes) {

				insideQuotes = true;

			} else if (character == "\"" && insideQuotes) {

				insideQuotes = false;

			} else if (character == "," && !insideQuotes) {
                
                question[headers[comma_counter]] = text
                text = ""
				comma_counter++;

			} else {
				
                text += character
			}
		}

        question[headers[comma_counter]] = text
        text = ""

		questions.push(question)
		question = {}
	}
	return questions;
}

export async function initializeQuestions(email) {

    subscriberEmail = email;
    console.log("questions initialized");
    const csv = await loadQuestions();
    questionTrack = parseQuestions(csv);
    state.initialized = true;
    const consent = await createQuestionIntro();

    if (consent === "yes") {

        state.status = "questions";
        await loadCurrentQuestion();
    } else {

        state.status = "declined";
    }

}

async function loadCurrentQuestion() {

    const question = questionTrack[state.currentQuestion];

    await createFollowupQuestion(question);
    await createFollowupInput(question);
}

async function createQuestionIntro() {

    const splashMessage = document.querySelector(".splash-message");

    const introForm = document.createElement("form");
    introForm.id = "question-intro-form";

    const intro = document.createElement("div");
    intro.id = "question-intro";

    const message = document.createElement("div");
    message.className = "followup-question";

    const prompt = document.createElement("span");
    prompt.className = "email-prompt";

    const choices = document.createElement("div");
    choices.className = "question-intro-choices";

    const yes = document.createElement("input");
    yes.type = "radio"
    yes.name = "question-consent";
    yes.value = "yes";
    yes.id = "question-consent-yes";

    const yesLabel = document.createElement("label");
    yesLabel.htmlFor = "question-consent-yes";

    const no = document.createElement("input");
    no.type = "radio";
    no.name = "question-consent";
    no.value = "no";
    no.id = "question-consent-no";

    const noLabel = document.createElement("label");
    noLabel.htmlFor = "question-consent-no";

    choices.appendChild(prompt);

    intro.appendChild(message);
    intro.appendChild(choices);

    introForm.appendChild(intro);

    splashMessage.appendChild(introForm);

    await initializeTyping(message, "We're putting together something cool and would like to ask you a few quick questions.", 1)

    await initializeTyping(prompt, "> Enter", 2)

    choices.appendChild(yesLabel);
    choices.appendChild(yes);

    await initializeTyping(yesLabel, "yes", 1)

    choices.appendChild(noLabel);
    choices.appendChild(no);

    await initializeTyping(noLabel, "no", 1)

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

async function handleQuestionSubmit(event) {

    event.preventDefault();

    const followup = document.querySelector("#followup");
    const form = document.querySelector("#followup-form")
    const input = followup.querySelector("input");

    const answer = input.value.trim().toLowerCase();

    const question = questionTrack[state.currentQuestion];
    
    const status = document.querySelector("#status")

    if (!answer) {
    	status.textContent = "Answer not provided."
        return;
    }

    input.remove();

    answers[question.key] = answer;

    const submission = {
        key: question.key,
        answer: answer
    };

    submitFollowup(submission);

    state.currentQuestion++;

    if (questionTrack[state.currentQuestion]) {
        form.remove();
        await loadCurrentQuestion()
    } else {
        await new Promise(resolve => setTimeout(resolve, 700));

        form.replaceChildren();

        const finalStatus = document.createElement("div");
        finalStatus.className = "success";
        finalStatus.textContent = "Thank you for your submissions.";

        form.appendChild(finalStatus);
    }
}


async function createFollowupQuestion(question) {
	console.log(question)
    const followupForm = document.createElement("form");
    const splashMessage = document.querySelector(".splash-message")
    followupForm.id = "followup-form";


    const followup = document.createElement("div");
    followup.id = "followup";

    const questionElement = document.createElement("div");
    questionElement.className = "followup-question";

    followup.appendChild(questionElement);
    followupForm.appendChild(followup);
    splashMessage.appendChild(followupForm);

    await initializeTyping(questionElement, question.prompt, 1);

    followupForm.addEventListener("submit", handleQuestionSubmit);
    console.log("Followup form created")
}


async function createFollowupInput(question) {

    const followup = document.querySelector("#followup");

    const row = document.createElement("div");
    row.className = "followup-answer";

    const inputRow = document.createElement("div");
    inputRow.className = "followup-input-row";

    const prompt = document.createElement("span");
    prompt.className = "input-prompt";
    
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = question.format;
    input.style.visibility = "hidden";

    const questionStatus = document.createElement("div");
    questionStatus.id = "status";

    inputRow.appendChild(prompt);
    inputRow.appendChild(input);
    
    row.appendChild(inputRow)
    row.appendChild(questionStatus);

    followup.appendChild(row);

    await initializeTyping(prompt, "> ", 2)

    input.style.visibility = "visible";
    input.focus();

    // console.log("Input has been provided");
}


function submitFollowup(answer) {

    console.log("Followup submitted");

    const submission = {
        type: "followup",
        email: subscriberEmail,
        key: answer.key,
        answer: answer.answer
    };

    fetch("/api/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submission)
    });
}