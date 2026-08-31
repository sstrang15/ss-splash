import { initializeTyping } from "./typing.js";


export async function initializeQuestions() {

    console.log("questions initialized");

    const answers = {};

    const state = {
        initialized: false,
        status: "ready",
        currentQuestion: 0
    };

    state.initialized = true;

    //generate form
    //populate form with first question
    //get input from each form
    //reset form and populate again using next question
}


function handleQuestionSubmit(event) {

    event.preventDefault();

    const followup = document.querySelector("#followup");
    const input = followup.querySelector("input");
    const answer = input.value.trim();
    const question = questionTrack[state.currentQuestion];


    if (!answer) {
        return;
    }

    answers[question.key] = answer;

    const newsletterStatus = document.querySelector("#newsletter-status");

    newsletterStatus.textContent = question.submittedText;

    // console.log(answers);
}


function createFollowupQuestion() {

    const newsletterForm = document.querySelector("#newsletter-form");
    const followupForm = document.createElement("form");

    followupForm.id = "followup-form";

    const followup = document.createElement("div");
    followup.id = "followup";

    const question = document.createElement("div");

    followup.appendChild(question);
    followupForm.appendChild(followup);

    newsletterForm.after(followupForm);


    return question;
}


function createFollowupInput() {

    const followup = document.querySelector("#followup");
    const answer = document.createElement("div");
    const prompt = document.createElement("span");
    prompt.textContent = "> Enter";

    const input = document.createElement("input");

    answer.appendChild(prompt);
    answer.appendChild(input);

    followup.appendChild(answer);

    return input;
}


async function submitFollowup(email, answers) {
    // fetch(...)
}