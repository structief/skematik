const uuidV1 = require('uuid/v1');
const moment = require('moment');

exports.getSchema = async (pg, schemaUUID, res) => {
  let result = {};

  console.log(schemaUUID)
  if (schemaUUID == "new"){
    result = {
      "uuid": "new",
      "title": "A new scheme",
      "headers": ['A string', 11, 'Click me!', '13:00', 14, 'Tomorrow'],
      "rows": [
      {
        "name": "New row",
        "cells": [{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0}]
      },
      {
        "name": "Another one, I swear",
        "cells": [{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0},{"current": [],"max": 0}]
      }
      ],
      "status": 0,
      "publication": {
        "from": new Date(),
        "to": new Date()
      },
      "roles": [],
      "consumer": {
        "index": null
      }
    };
    res.status(200).send(result);
  }
  else {
    const rowstructure = [];

    let answers = [];
    await pg.select("answers.cellID", "answers.participant", "answers.created_at", "answers.activated", "answers.updated_at", "cells.row", "cells.col").table("answers").where({"answers.tableID": schemaUUID}).join('cells', 'cells.uuid', '=', 'answers.cellID').then(function(a) {
      answers = a;
    })

      // @TODO: make sure param 'uuid' is of type uuid
      await pg.select()
      .table('schema')
      .where({'schema.uuid': schemaUUID})
      .leftJoin('cells', 'schema.id', '=', 'cells.tableID')
      .then(async function (r) {
        if (r.length > 0) {
          result['uuid'] = schemaUUID;
          result['title'] = r[0].title;
          result['consumer'] = r[0].consumer;
          result['status'] = r[0].published;
          result['roles'] = r[0].roles.roles.map((role) => { return role.type });
          result['publication'] = {
            from: moment(r[0].opens).format(),
            to: moment(r[0].closes).format()
          };
          const temp = [];
          Object.keys(r[0].headers).map((key, index) => {
            temp.push(key);
          });
          result['headers'] = temp;


          result['created_at'] = r[0].created_at;
          result['updated_at'] = r[0].updated_at;

          Object.keys(r[0].rows).map((key, index) => {
            const found = [];
            for (let i = 0; i < r.length; i++) {
              if (r[i]['row'] === key) {
                const num = answers.filter(answer => answer.cellID === r[i].uuid);
                found.push({
                  max: r[i].max,
                  current: num,
                  col: r[i].col,
                  uuid: r[i].uuid
                })
              }
            }

            const intermediary = [];

            for (let i = 0; i < temp.length; i++) {
              for (let j = 0; j < found.length; j++) {
                if (found[j].col === temp[i]) {
                  intermediary.push(found[j])
                }
              }
            }

            rowstructure.push({
              name: key,
              cells: intermediary
            });
          });


          result['rows'] = rowstructure;

          result['answers'] = answers;
          res.status(200).send(result);
        }
        else {
          res.status(404).send({error: 'something went wrong'});
        }
      });
    }
  }