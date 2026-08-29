// newsletter.js
// ├── validateEmail()
// ├── submitEmail()
// └── eventually communicate with service

export function initializeNewsletter() {
	console.log("newsletter initialized");
  	const state = {
        initialized: false,
        status: "ready",
        previousAttempt: null,
        currentEmail: "",
        verificationStatus: null,
        message: ""
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
		    // TEMPORARY until newsletter service is connected:
		    console.log(email)
			const response = await submitEmail(email);
		    // const response = await submitEmail(email);

		    if (response.ok) {
		        state.status = "success";

		        newsletterStatus.textContent =
		            "Successful submission.";

	            newsletterStatus.classList.add("success");

		        form.reset();
		    } else {
		        state.status = "error";

		        newsletterStatus.textContent = "It appears this email could not be submitted.";
		    }
		} catch (error) {
		    state.status = "error";

		    newsletterStatus.textContent = "It appears this email could not be submitted.";

		    console.log(error);
		}

	})

}

async function verifyEmail(email) {

    // send email to verification service

    // receive verification result

	const verification = {
	    status: "valid"
	};

    return verification;
}

async function submitEmail(email) {
	console.log("email being submitted:", email);

    const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    });
    const data = await response.json();

    console.log(data);

    return data;
}