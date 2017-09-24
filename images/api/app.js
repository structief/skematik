const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidV1 = require('uuid/v1');

const pg = require('knex')({
	client: 'pg',
	connection: process.env.PG_CONNECTION_STRING,
	searchPath: 'knex,public'
});

pg.raw('select 1+1 as result').then(function () {
	initialiseTables();
});



const app = express();
const server = http.Server(app);
const PORT = 3000;

app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(cors({credentials: false, origin: '*'}))

app.post('/schema', async (req, res, next) => {
	const request = req.body;
	request["created_at"] = new Date();
	request["updated_at"] = new Date();
	request["uuid"] = uuidV1();
	const id = await pg("schema").insert(req.body).returning('id');
	res.send(id)
})
app.post('/cells', async (req, res, next) => {
	const request = req.body;
	console.log("request", request)
	for(let i = 0; i < request.cells.length; i++) {
		await pg("cells").insert(request.cells[i]);
	}
	
	res.send(200)
})

app.get('/schema/:uuid', async (req, res, next) => {
	let result = {};
	
	await pg.select().table("schema").where({uuid: req.param("uuid")}).then(function(r) {
		result = r[0];
		
		Object.keys(result["rows"]).map((key, index) => {
			result["rows"]  = [];
		})
	})
	
	res.json(result)
})

app.get('/', async (req, res, next) => {
	const result = {};
	
	await pg.select().table("schema").then(function(r) {
		result["schema"] = r;
	})
	await pg.select().table("cells").then(function(r) {
		result["cells"] = r;
	})
	await pg.select().table("answers").then(function(r) {
		result["answers"] = r;
	})
	
	res.send(result)
	console.log("tested")

})






server.listen(PORT, () => {
	console.log(`server up and listening on ${PORT}`)
})


async function initialiseTables() {
	
	await pg.schema.createTableIfNotExists('schema', function (table) {
		table.increments();
		table.string('title');
		table.json('headers');
		table.json('rows');
		table.dateTime("opens");
		table.dateTime("closes");
		table.string("creator");
		table.timestamps();
	}).then(function() {
		console.log("created tables")
	});
	
	await pg.schema.createTableIfNotExists('cells', function (table) {
		table.increments();
		table.integer("tableID");
		table.string("col");
		table.string("row");
		table.integer("max");
		table.integer("current");
	}).then(function() {
		console.log("created cells")
	});
	
	await pg.schema.createTableIfNotExists('answers', function (table) {
		table.increments();
		table.integer("cellID");
		table.integer("userID");
		table.string("username");
		table.string("usermail");
		table.timestamps();
	}).then(function() {
		console.log("created answers")
	});
	
	
	// // there is a valid connection in the pool
	// pg.schema.hasTable('schema').then(function(exists) {
	// 	pg.select().table('schema').then(function(result) {
	// 		console.log("exists", result)
	// 	});
	// });
	
}