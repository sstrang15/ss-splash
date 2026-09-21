import { processWelcomeEmails } from "../scheduler/scheduler.js";


export default async function scheduler(_, response) {

    console.log("Cron invoked scheduler");

    await processWelcomeEmails();

    return response.status(200).json({
        ok: true
    });
}