// subscribe.js

import { Resend } from "resend";
import { getWelcomeTemplate } from "../emails/welcome.js";

let subscribers = {};

const resend = new Resend(
    process.env.strangnewsletter_RESEND_API_KEY
);


export default async function subscribe(request, response) {

    const { type } = request.body;

    if (type === "email") {

        const email = getEmail(request);

        if (!email) {
            return response.status(400).json({
                ok: false
            });
        }

        createSubscriber(email);
        console.log("AFTER CREATE:", subscribers);

        return response.status(200).json({
            ok: true
        });
    }

    if (type === "followup") {


        const email = getEmail(request);
        const followup = getFollowup(request);
        console.log("AT FOLLOWUP:", subscribers);
        // console.log(followup)
        // console.log("email:", email);
        // console.log("followup:", followup);
        // console.log("subscriber:", subscribers[email]);

        if (!email || !followup || !subscribers[email]) {
            console.log("Something is off")
            return response.status(400).json({
                ok: false
            });
        }

        addFollowup(email, followup);
        return response.status(200).json({
            ok: true
        });
    }

    return response.status(400).json({
        ok: false
    });
}


function getEmail(request) {

    const { email } = request.body;

    if (!email) {
        return null;
    }

    return email.trim();
}


function getFollowup(request) {

    const { key, answer } = request.body;

    if (!key || !answer) {
        return null;
    }

    return {
        key,
        answer
    };
}


function createSubscriber(email) {

    subscribers[email] = {
        email: email,
        answers: {}
    };

    // console.log(
    //     "Subscriber created:",
    //     subscribers[email]
    // );
}


function addFollowup(email, followup) {
    console.log({
        email,
        followup
    });
    const key = followup.key;
    const answer = followup.answer;

    subscribers[email].answers[key] = answer;

    console.log(
        "Subscriber updated:", subscribers[email]
    );
}


async function sendWelcomeEmail(email, body) {

    const emailMessage = {
        from: "hello@stephenstrang.dev",
        to: email,
        subject: "A quick welcome from Stephen.",
        html: body
    };

    return await resend.emails.send(emailMessage);
}