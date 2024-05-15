import GlobalStyles from './styles/GlobalStyles';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import { Home, Login, Portfolio, Leaderboard } from './pages';
import { NavBar, ProtectedRoute } from './components';
import { useSelector } from 'react-redux';

function App() {
  const isAuthenticated = useSelector(state => state.isLoggedIn.value);
  

  return (
    <>
      <GlobalStyles />
      <Router>
          <NavBar />
          <Routes>
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />}/>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          </Routes>
      </Router>
    </>
  );
}

export default App;
