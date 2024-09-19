const fs = require("fs");
// const { Pool } = require("pg");

const createDB = async () => {
    try {
        const schema = fs.readFile("../db/schema.sql", "utf8");
        await pool.query(schema, (err, res) => {if (err) { throw err }});
        const seeds = fs.readFile("../db/seeds.sql", "utf8");
        await pool.query(seeds, (err, res) => {if (err) {throw err}});

    } catch (error) {
        console.error('Error creating database', error)
    }
};

async (err) => {
  if (err) {
    throw err; //stop execution if there's an error
  }
  // run the schema.sql file
  fs.readFile("./db/schema.sql", "utf8", (err, schemaData) => {
    if (err) {
      throw err;
    }
    pool.query(schemaData, (err, res) => {if (err) {throw err};

      // run the seeds.sql file
      fs.readFile("./db/seeds.sql", "utf8", (err, seedsData) => {
        if (err) {
          throw err;
        }
        pool.query(seedsData, (err, res) => {
          if (err) {
            throw err;
          }
          // release client back to the connection pool after database is created
     
        });
      });
    });
  });
};



