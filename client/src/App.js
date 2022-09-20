import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import './App.css'
import logo from './logo.svg'
import DummyPage from './DummyPage'
import Fib from './Fib'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="App-header">
          <img src={logo} alt="" width="120" />
          <h1>Welcome to React! Let's go Kubenetes!</h1>
          <Link to="/">Home</Link>
          <Link to="/dummy">Dummy</Link>
        </div>
        <Routes>
          <Route path="/" element={<Fib />} />
          <Route path="dummy" element={<DummyPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
