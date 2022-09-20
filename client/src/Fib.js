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

  const renderSeenIndexes = () => {
    return fib.seedIndexes.map(({ n }) => n).join(', ')
  }

  const renderValues = () => {
    const entries = []

    for (let key in fib.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {fib.values[key]}
        </div>
      )
    }

    return entries
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Enter your index:</label>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  )
}

export default Fib
