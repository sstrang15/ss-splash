// subscribe.js

import { Resend } from 'resend';


// const resend = new Resend(
//     process.env.strangnewsletter_RESEND_API_KEY
// );

// console.log({
//     hasResendKey: !!process.env.strangnewsletter_RESEND_API_KEY
// });

// export default async function subscribe(request, response) {
// 	console.log("SUBSCRIBE.JS WAS CALLED");
//     const { email } = request.body;

//     console.log("received email:", email);

//     return response.status(200).json({
//         ok: true
//     });
// }

export default async function subscribe(request, response) {

    const resend = new Resend(
        process.env.strangnewsletter_RESEND_API_KEY
    );

    // const email = getEmail(request);
    const { email } = request.body;

    // sendWelcomeEmail(email)

    // if (request.method !== "POST") {
    //     return response.status(405).json({ ok: false});
    // }
    
    return response.status(200).json({
        ok: true
    });
}

// function getEmail(request) {
//     const { email } = request.body;

//     if (!email) {
//         return response.status(400).json({
//             ok: false
//         });

//     const cleanEmail = email.trim();
// }

async function sendWelcomeEmail(email) {
    return await resend.emails.send({
        from: "hello@stephenstrang.dev",
        to: email,
        subject: "Welcome",
        text: "Thanks for signing up."
    });
}