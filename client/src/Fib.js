import { useState, useEffect } from 'react'
import axios from 'axios'

const Fib = () => {
  const [value, setValue] = useState('')
  const [fib, setFib] = useState({ seedIndexes: [], values: {} })

  useEffect(() => {
    async function getFibs() {
      try {
        const values = (await axios.get('/api/values/redis')).data
        const seedIndexes = (await axios.get('/api/values/pg')).data

        setFib({ ...fib, values, seedIndexes })
      } catch (error) {
        console.error(error)
      }
    }
    getFibs()
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    await axios.post('/api/values/new-value', { value })
    setValue('')
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="index">Enter Your Index</label>
        <input
          type="text"
          id="index"
          value={value}
          onChange={({ target }) => setValue(target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Indexes have been seeded:</h3>
      {fib.seedIndexes.map((index) => (
        <span style={{ margin: '0 2px' }} key={index.n}>
          {index.n}
        </span>
      ))}

      <h3>Calculated Values</h3>
      {Object.entries(fib.values).map((e) => (
        <div key={e[0]}>
          For index {e[0]} | Calculated {e[1]}
        </div>
      ))}
    </div>
  )
}

export default Fib
