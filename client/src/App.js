import GlobalStyles from './styles/GlobalStyles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Login, Portfolio, Leaderboard } from './pages';

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <div>
          {/*
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/leaderboard">Leaderboard</Link>
                </li>
                <li>
                  <Link to="/portfolio">Portfolio</Link>
                </li>
              </ul>
            </nav>*/}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />}></Route>
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
