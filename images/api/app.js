const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidV1 = require('uuid/v1');
const faker = require("faker");

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
		request.cells[i]["uuid"] = uuidV1();
		await pg("cells").insert(request.cells[i]);
	}
	
	res.send(200)
})

app.post('/schema/:uuid/answer', async (req, res, next) => {
	const insert = {};
	insert["cellID"] = req.body["cellID"];
	insert["tableID"] = req.params.uuid;
	insert["userID"] = uuidV1();
	insert["username"] = faker.name.firstName().toLowerCase() + "." + faker.name.lastName().toLowerCase();
	insert["usermail"] = req.body["participant"];
	
	insert["created_at"] = new Date();
	insert["updated_at"] = new Date();
	
	// asses if can register
	let go = false;
	await pg.select().table('answers').where({ cellID: insert['cellID']}).join('cells', 'cells.uuid', '=', 'answers.cellID').then(function(d) {
		if(d.length > 0 && d.length >= d[0].max) {
			//do not allow
			res.send(401);
		} else {
			go = true;
		}
	})
	
	// add to answers
	if( go ) {
		await pg("answers").insert(insert).returning("id").then(function(id) {
			res.send(200, id)
		}).catch(function(error) {
			res.send("error" + error)
		})
	}
})

app.get('/schema/:uuid', async (req, res, next) => {
	let result = {};
	const rowstructure = [];
	
	let answers = [];
	await pg.select().table("answers").where({tableID: req.params.uuid}).then(function(a) {
		answers = a;
	})

	// @TODO: make sure param 'uuid' is of type uuid 
	
	await pg.select()
		.table("schema")
		.where({"schema.uuid": req.params.uuid})
		.join('cells', 'schema.id', "=", "cells.tableID")
		.then( function (r) {
			// @TODO: send 404 if schema is not found

			result["uuid"] = req.params.uuid;
			result["title"] = r[0].title;
			const temp = [];
			Object.keys(r[0].headers).map((key, index) => {
				temp.push(key);
			});
			result["headers"] = temp;
			
			result["created_at"] = r[0].created_at;
			result["created_at"] = r[0].created_at;
			result["updated_at"] = r[0].updated_at;
			
			
			Object.keys( r[0].rows ).map((key, index) => {
				const found = [];
				for( let i = 0; i<r.length; i++ ) {
					if(r[i]["row"] === key) {
						const num = answers.filter(answer => answer.cellID === r[i].uuid);
						console.log(num)
						found.push({
							max: r[i].max,
							current: num,
							col: r[i].col,
							uuid: r[i].uuid
						})
					}
				}
				rowstructure.push({
					name: key,
					cells: found
				});
			});
		}).then(function() {
			result["rows"] = rowstructure;
			result["answers"] = answers;
			res.send(result);
		}).catch(function(error) {
			res.send(error);
		})
});

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
		table.uuid("uuid");
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
		table.uuid("uuid");
	}).then(function() {
		console.log("created cells")
	});
	
	
	await pg.schema.createTableIfNotExists('answers', function (table) {
		table.increments();
		table.uuid("cellID");
		table.uuid("userID");
		table.uuid("tableID");
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