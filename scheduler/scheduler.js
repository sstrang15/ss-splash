
import { getWelcomeTemplate } from "../emails/welcome.js"
import { sendWelcomeEmail } from "../api/subscribe.js"

const welcomeDelay = .35 * 60 * 1000;
const checkInterval = 5 * 1000;
let masterTimer = []

console.log("scheduler.js loaded");

export async function welcomeTimer(email) {

	let timer = Date.now()

	masterTimer.push({
		"email": email,
		"start": timer
	})
}

async function processWelcomeTimers(masterTimer) {

	for (const timer of masterTimer) {

	    if (Date.now() - timer.start >= welcomeDelay) {

	    	console.log(`${timer.email} welcome timer completed!`);

	        const body = await getWelcomeTemplate();
		    await sendWelcomeEmail(timer.email, body);
	    
	        const position = masterTimer.indexOf(timer);

	        masterTimer.splice(position, 1);
	    }
	}
}


async function monitorWelcomeTimers() {

    while (masterTimer.length > 0) {

    	console.log("scheduler running");

        await processWelcomeTimers(masterTimer);
        await pause();
    }

}


function pause() {

    return new Promise(resolve => {
        setTimeout(resolve, checkInterval);
    });
}

welcomeTimer("test@example.com");

monitorWelcomeTimers();

