import { initializeQuestions } from "./questions.js"


export async function initializeNewsletter() {

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
    const emailInput = document.querySelector("#email-input");
    const newsletterStatus = document.querySelector("#newsletter-status");

    state.initialized = true;


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

        state.status = "submitting";
        newsletterStatus.textContent = "Submitting...";

        let response;

        try {

            response = await submitEmail(email);
            // console.log(response.ok)

            if (response.ok) {

                state.status = "success";
                newsletterStatus.textContent = "Successful submission.";
                newsletterStatus.classList.add("success");

                await new Promise(resolve => setTimeout(resolve, 1200));
                form.reset()
                form.remove();

                initializeQuestions();
    
                return;

            } else {

                state.status = "error";
            }

        } catch (error) {

            state.status = "error";
            console.error(error);
            console.log(response);
            newsletterStatus.textContent = "Something went wrong. Please try again.";
        }
    });
}


async function verifyEmail(email) {

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

    return data;
}