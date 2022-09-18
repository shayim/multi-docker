const express = require('express')
const cors = require('cors')
const { Client } = require('pg')
const { createClient } = require('redis')

const pgHost = process.env.PG_HOST || 'localhost'
const pgClient = new Client({
  connectionString: `postgresql://postgres:postgres@${pgHost}:5432/fibvalues`
})
;(async () => {
  await pgClient.connect()
  await pgClient.query('CREATE TABLE IF NOT EXISTS values (n INT)')
})()

const redisHost = process.env.REDIS_HOST || 'localhost'
const redisClient = createClient({
  url: `redis://${redisHost}:6379`
})

const pub = redisClient.duplicate()
const sub = redisClient.duplicate()
;(async () => {
  await redisClient.connect()
  await pub.connect()
  await sub.connect()
})()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Hi There!'))
app.get('/values/pg', async (req, res) => {
  const values = (await pgClient.query('SELECT * from values')).rows

  res.send(values)
})
app.get('/values/redis', async (req, res) => {
  const values = await redisClient.hGetAll('values')

  res.send(values)
})

app.post('/values/new-value', async (req, res) => {
  const { value } = req.body

  if (isNaN(parseInt(value)))
    return res.status(422).send({ errMsg: 'value is not a number' })
  if (+value > 40) return res.status(422).send('value too high.')

  await pub.publish('new-value', value)
  await pgClient.query('INSERT INTO values(n) VALUES($1)', [value])

  res.json({ workerInProgress: true })
})

app.listen(5000, () => console.log('server is listening at port 5000', pgHost, redisHost， process.env ))
