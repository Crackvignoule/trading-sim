import GlobalStyles from './styles/GlobalStyles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Login, Portfolio, Leaderboard } from './pages';
import NavBar from './components/NavBar/NavBar';

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />}></Route>
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
      </Router>
    </>
  );
}

export default App;
