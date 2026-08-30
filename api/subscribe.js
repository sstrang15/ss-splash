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
    console.log("SUBSCRIBE.JS WAS CALLED");

    console.log({
        hasResendKey: !!process.env.strangnewsletter_RESEND_API_KEY
    });

    return response.status(200).json({
        ok: true
    });
}