// subscribe.js

export default async function subscribe(request, response) {
	console.log("SUBSCRIBE.JS WAS CALLED");
    const { email } = request.body;

    console.log("received email:", email);

    return response.status(200).json({
        ok: true
    });
}