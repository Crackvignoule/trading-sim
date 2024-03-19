import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <>
      <GlobalStyles />
      <div>
        {/* <Router>
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
          </nav>

          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
            <Route path="/portfolio">
              <Portfolio />
            </Route>
            <Route path="/leaderboard">
              <Leaderboard />
            </Route>
          </Switch>
        </div>
      </Router> */}
      </div>
    </>
  );
}

export default App;
