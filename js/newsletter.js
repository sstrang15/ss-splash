import { initializeTyping } from "./typing.js";


export async function initializeNewsletter() {

	const answers = {};

	console.log("newsletter initialized");

  	const state = {
        initialized: false,
        status: "ready",
        previousAttempt: null,
        currentEmail: "",
        verificationStatus: null,
        message: "",
        currentQuestion: 0
    };

	const form = document.querySelector("#newsletter-form");
	const emailInput = document.querySelector("#email-input")
	const newsletterStatus = document.querySelector("#newsletter-status");

	state.initialized = true;

	// console.log({
	//     state,
	//     form,
	//     emailInput,
	//     newsletterStatus
	// });


	form.addEventListener("submit", async (event) => {

		event.preventDefault();

		if (state.status === "questioning") {
		    // process QUESTION submission
		    return;
		}

		newsletterStatus.classList.remove("success");

		const email = emailInput.value.trim();


		if (!email) {
		    newsletterStatus.textContent = "Nothing was submitted.";
		    state.status = "empty";
		    return;
		}

		state.currentEmail = email;
		state.status = "verifying";

		newsletterStatus.textContent = "Checking...";

		const verification = await verifyEmail(email);

		state.verificationStatus = verification.status;


		if (verification.status !== "valid") {
		    state.status = "invalid";

		    newsletterStatus.textContent = "It appears this email is not working.";

		    return;   
		}


		state.status = "submitting"

		newsletterStatus.textContent = "Submitting...";

		try {

			const response = await submitEmail(email);


		    if (response.ok) {

		        state.status = "success";

		        newsletterStatus.textContent =
		            "Successful submission.";

	            newsletterStatus.classList.add("success");

	            form.reset();

	            const question = questionTrack[state.currentQuestion];

	            const questionElement = createFollowupQuestion();

	            await initializeTyping(questionElement,question.prompt);

	            createFollowupInput();

	            state.status = "questioning";

	            return

		    } else {
		        state.status = "error";

		        newsletterStatus.textContent = "It appears this email could not be submitted.";

		    }
		} catch (error) {
		    state.status = "error";

		    newsletterStatus.textContent = "It appears this email could not be submitted.";

		}

	})

	followupForm.addEventListener("submit", handleQuestionSubmit);

}

async function verifyEmail(email) {

    // send email to verification service

    // receive verification result

	const verification = {
	    status: "valid"
	};

    return verification;
}

async function submitEmail(email, answers) {
	console.log("email being submitted:", email);

    const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, answers })
    });
    const data = await response.json();

    console.log(data);

    return data;
}

function createFollowupInput() {

	const followup = document.querySelector("#followup");

	const answer = document.createElement("div");
	followup.id = "followup"

	const prompt = document.createElement("span");
	prompt.textContent = "> Enter";

	const input = document.createElement("input");

	answer.appendChild(prompt);
	answer.appendChild(input);
	
	followup.appendChild(answer)

	return input
}

function createFollowupQuestion() {

    const form = document.querySelector("#newsletter-form");

    const followup = document.createElement("div");
    followup.id = "followup";

    const question = document.createElement("div");

    followup.appendChild(question);
    form.appendChild(followup);

    return question;
}

async function handleQuestionSubmit(event) {
	const followup = document.querySelector("#followup")
}
