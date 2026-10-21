import { getWelcomeTemplate, buildWelcomeEmail } from "../emails/welcome.js";
import { sendWelcomeEmail } from "../api/subscribe.js";


console.log("sendemail.js started");

const testSubscribers = [
    {
        name: "Stephen",
        birth: "July",
        college: "Georgia Tech",
        color: "Black",
        state: "Georgia"
    },
    {
        name: "Stephen",
        birth: "July",
        college: "Georgia Tech",
        color: "White",
        state: "Georgia"
    },
    {
        name: "Stephen",
        birth: "July",
        college: "Georgia Tech",
        color: "Gray",
        state: "Georgia"
    },
    {
        name: "Stephen",
        birth: "July",
        college: "Georgia Tech",
        color: "Forest Green",
        state: "Georgia"
    },
    {
        name: "Stephen",
        birth: "July",
        college: "Georgia Tech",
        color: "Midnight Blue",
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