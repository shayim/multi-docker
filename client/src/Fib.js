import axios from "axios";
import { useState, useEffect } from "react";

function Fib() {
  const [queriedIndexes, setQueriedIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  useEffect(() => {
    const fetchQueriedIndexes = async () => {
      const queriedIndexes = (await axios.get("/api/fibs/queried-indexes"))
        .data;
      setQueriedIndexes(queriedIndexes);
    };

    const fetchValues = async () => {
      const values = (await axios.get("/api/fibs")).data;
      setValues(values);
    };
    fetchValues();
    fetchQueriedIndexes();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/fibs", { index });
    setIndex(index);
  };

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <label>Enter your fib index</label>
        <input value={index} onChange={(e) => setIndex(e.target.value)} />
        <button type="submit">Submit</button>
      </form>

      <h3>Queried Index:</h3>
      {queriedIndexes &&
        queriedIndexes.length > 0 &&
        queriedIndexes.map(({ number }) => number).join(", ")}

      <h3>Calculated Values:</h3>
      {values &&
        Object.keys(values).length > 0 &&
        Object.keys(values).map((key) => (
          <div key={key}>
            For index {key} I calculated {values[key]}
          </div>
        ))}
    </div>
  );
}

export default Fib;
