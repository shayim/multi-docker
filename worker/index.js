const redisHost = process.env.REDIS_HOST || 'localhost'
const redisClient = require('redis').createClient({
  url: `redis://${redisHost}:6379`
})

redisClient.on('connect', () => console.log('redis connected'))

function fib(n) {
  if (n < 2) return 1
  return fib(n - 1) + fib(n - 2)
}

;(async () => {
  try {
    await redisClient.connect()
    const sub = redisClient.duplicate()
    const pub = redisClient.duplicate()
    await sub.connect()
    await pub.connect()

    await sub.subscribe('new-value', async (message) => {
      const n = parseInt(message)
      const result = fib(n)
      await redisClient.hSet('values', message, result)
      await pub.publish('new-result', JSON.stringify(result))
    })
  } catch (error) {
    console.log(error)
    redisClient.quit()
  }
})()

// // For TEST
// ;(async () => {
//   let count = 0
//   const sub = redisClient.duplicate()
//   const pub = redisClient.duplicate()
//   await sub.connect()
//   await pub.connect()

//   await sub.subscribe('new-result', (message) =>
//     console.log(`${count - 1}: ${message}`)
//   )

//   const handler = setInterval(async () => {
//     await pub.publish('new-value', JSON.stringify(count))
//     count += 1
//     if (count > 40) clearInterval(handler)
//   }, 2000)
// })()
