import { BrowserRouter, Link, Route } from "react-router-dom";
import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Link to="/">Home</Link>
        <Link to="/other-page">Other Page</Link>
        <div>
          <Route exact path="/" component={Fib}></Route>
          <Route exact path="/other-page" component={OtherPage}></Route>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
