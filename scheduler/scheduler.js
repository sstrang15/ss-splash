
import { getWelcomeTemplate, buildWelcomeEmail } from "../emails/welcome.js"
import { sendWelcomeEmail } from "../api/subscribe.js"
import { getDueWelcomeSubscribers, markWelcomeSent } from "../db/database.js";

const welcomeDelay = 2 * 60 * 60 * 1000;
// const welcomeDelay = 0;

export async function processWelcomeEmails() {

    console.log("Scheduler checking for welcome emails...");

    const cutoff = new Date(Date.now() - welcomeDelay);

    const subscribers = await getDueWelcomeSubscribers(cutoff);

    console.log("Scheduler received due subscribers:", subscribers.length);

    for (const subscriber of subscribers) {

        console.log("Sending welcome:", subscriber.email);

        const template = await getWelcomeTemplate();

        const body = await buildWelcomeEmail(
            template,
            subscriber
        );

        const result = await sendWelcomeEmail(
            subscriber.email,
            body
        );

        if (result.error) {
            console.error("Welcome email failed:", result.error);
            continue;
        }

        await markWelcomeSent(subscriber.email);

        console.log("Welcome completed:", subscriber.email);
    }
}