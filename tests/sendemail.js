import { getWelcomeTemplate, buildWelcomeEmail } from "../emails/welcome.js";
import { sendWelcomeEmail } from "../api/subscribe.js";


console.log("sendemail.js started");

const testSubscribers = [
    {
        name: "Stephen",
        birth: "July",
        college: "Georgia Tech",
        color: "black",
        state: "Georgia"
    },
    {
        name: "Stephen",
        birth: "July",
        college: "Georgia Tech",
        color: "white",
        state: "Georgia"
    },
    {
        name: "Stephen",
        birth: "July",
        college: "Georgia Tech",
        color: "gray",
        state: "Georgia"
    },
    {
        name: "Stephen",
        birth: "July",
        college: "Georgia Tech",
        color: "#228B22",
        state: "Georgia"
    },
    {
        name: "Stephen",
        birth: "July",
        college: "Georgia Tech",
        color: "#191970",
        state: "Georgia"
    }
];

export async function sendEmail(recipient) {

    const template = await getWelcomeTemplate();

    for (const subscriber of testSubscribers) {

        console.log(`Generating email for ${subscriber.color}...`);

        const body = await buildWelcomeEmail(
            template,
            subscriber
        );

        const result = await sendWelcomeEmail(
            recipient,
            body
        );

        if (result.error) {
            console.error(
                `Failed to send ${subscriber.color}:`,
                result.error
            );
            continue;
        }

        console.log(`Sent ${subscriber.color} successfully.`);
    }
}

const recipient = process.env.TEST_EMAIL;

if (!recipient) {
    throw new Error("Missing TEST_EMAIL environment variable");
}

await sendEmail(process.env.TEST_EMAIL);