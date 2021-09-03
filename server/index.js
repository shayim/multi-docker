const keys = require("./keys");

// postgres client setup
const { Pool } = require("pg");
const pool = new Pool({
  user: keys.pgUser,
  password: keys.pgPassword,
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase,
});

(async () => {
  const pgClient = await pool.connect();
  await pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)");

  pgClient.release();
})();

// redis client setup
const redisClient = require("redis").createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// express setup
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("hi"));
app.get("/fibs/queried-indexes", async (req, res) => {
  const pgClient = await pool.connect();
  const values = await pgClient.query("SELECT * from values");
  res.send(values.rows);
  pgClient.release();
});
app.get("/fibs", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});
app.post("/fibs", async (req, res) => {
  const { index } = req.body;

  if (parseInt(index) > 40) return res.status(422).send("index too hight");

  redisClient.hset("values", index, "Please be patient, nothing yet!");
  redisPublisher.publish("insert", index);

  const pgClient = await pool.connect();
  await pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({ working: true });
  pgClient.release();
});
app.listen(5000, () => console.log("fibs app is listening..."));
