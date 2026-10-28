import pg from "pg";
import fs from "node:fs";
import { parseCSV } from "../api/utils.js";


export function createDatabaseClient() {

    const databaseConfig = {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT || 5432),
        database: "postgres",
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD,
        ssl: {
        	ca: fs.readFileSync(
        	    new URL("../certs/prod-ca-2021.crt", import.meta.url),
        	    "utf8"
        	),
            rejectUnauthorized: true
        }
    };

    console.log("Database connection:", {
        host: databaseConfig.host,
        port: databaseConfig.port,
        database: databaseConfig.database,
        user: databaseConfig.user
    });

    return new pg.Client(databaseConfig);
}

function getSubscriberFields() {

    const csv = fs.readFileSync(
        new URL("../public/assets/data/questions.csv", import.meta.url),
        "utf8"
    );

    const questions = parseCSV(csv);

    return questions.map(question => question.key);
}


export async function insertSubscriber(email) {

	const database = createDatabaseClient();
	await database.connect();

    const insertQuery = `
        INSERT INTO newsletter.subscribers (email)
        VALUES ($1);
    `;

    await database.query(insertQuery, [email]);
    console.log("Subscriber inserted:", email);
    await database.end();
}

export async function insertSubscriberInfo(email, followup) {

	const database = createDatabaseClient();

	const key = followup.key;
	const answer = followup.answer;

	const subscriberFields = getSubscriberFields();

	if (!subscriberFields.includes(key)) {
	    throw new Error(`Invalid subscriber field: ${key}`);
	}

	await database.connect();
    const updateQuery = `
        UPDATE newsletter.subscribers
        SET ${key} = COALESCE($1, 'N/A')
        WHERE email = $2;
    `;

    await database.query(updateQuery, [answer ?? "N/A", email]);
    console.log(`Subscriber updated: ${email}, ${key} = ${answer}`);
    await database.end();
}

export async function deleteSubscriber(email) {

    const database = createDatabaseClient();

    await database.connect();

    const deleteQuery = `
        DELETE FROM newsletter.subscribers
        WHERE email = $1;
    `;

    await database.query(deleteQuery, [email]);

    console.log("Subscriber deleted:", email);

    await database.end();
}

// await deleteSubscriber("strangstep11@gmail.com");


export async function markWelcomeSent(email) {

    const database = createDatabaseClient();

    await database.connect();

    const updateQuery = `
        UPDATE newsletter.subscribers
        SET welcome_sent = TRUE
        WHERE email = $1;
    `;

    await database.query(updateQuery, [email]);

    await database.end();
}


export async function getDueWelcomeSubscribers(cutoff) {

	const database = createDatabaseClient();
	await database.connect();

	const dueWelcomeQuery = `
	    SELECT *
	    FROM newsletter.subscribers
	    WHERE welcome_sent = FALSE
	    AND subscribed_at <= $1;
	`;

	const result = await database.query(
	    dueWelcomeQuery,
	    [cutoff]
	);

	await database.end();

	return result.rows;
}
