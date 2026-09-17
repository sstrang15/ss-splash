// subscribe.js

import { Resend } from "resend";
import { getWelcomeTemplate } from "../emails/welcome.js";
import { insertSubscriber, insertSubscriberInfo} from "../db/database.js";

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

        await insertSubscriber(email);

        return response.status(200).json({
            ok: true
        });
    }

    if (type === "followup") {


        const email = getEmail(request);

        const followup = getFollowup(request);

        if (!email || !followup) {
            console.log("Something is off");

            return response.status(400).json({
                ok: false
            });
        }

        await insertSubscriberInfo(email, followup);

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

    const { email, key, answer } = request.body;

    if (!key || !answer) {
        return null;
    }

    return {
        key,
        answer
    };
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