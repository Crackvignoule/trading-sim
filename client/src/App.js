import GlobalStyles from './styles/GlobalStyles';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import { Home, Login, Portfolio, Leaderboard } from './pages';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  const isAuthenticated = localStorage.getItem('token'); // Vérifiez si le token existe

  return (
    <>
      <GlobalStyles />
      <Router>
        <div>
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
        </div>
      </Router>
    </>
  );
}

export default App;
