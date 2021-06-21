require('source-map-support').install();
import express from "express";
import {Client} from "pg";
import cors from "cors";
const app = express();
const port = process.env.PORT || 8080;

let client: Client;
let hasClientInit: boolean = false;

app.use(cors());

app.get('/connect', async function (req, res) {
	if (hasClientInit) {
		client.end();
		hasClientInit = false;
	}
	client = new Client({
		user: req.query.username as string,
		host: req.query.host as string,
		database: req.query.db as string,
		password: req.query.password as string,
		port: parseInt(req.query.port as string),
		query_timeout: 5000,
	});
	client.connect()
		.then(() => {
			hasClientInit = true;
			console.log("Connected to db!");
			res.send("Connected to db!");
		}).catch(err => {
			console.error("Failed to connect to db.", err.stack);
			res.json(new Error("Failed to connect to db."));
		});
});

app.get('/query', async function (req, res) {
	let queryString: string = req.query.query as string;

	console.log(`Got queryString: ${queryString}`);

	await client
		.query(queryString)
		.then(queryRes => {
			console.log("Query returned!");
			res.json(queryRes);
		})
		.catch(err => {
			console.error(`Failed to query: ${err}`);
			res.json({err: err});
		});
});

app.listen(port, () => {
	console.log(`Server listening at port ${port}`);
});
