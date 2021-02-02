import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const handleLogin = () => {
    setLoggedIn(true);
  };
  const handleSignOut = () => {
    setLoggedIn(false);
  };
  return (
    <Router>
      <header>
        <NavBar
          title="Team Name"
          loggedIn={loggedIn}
          handleSignOut={handleSignOut}
        />
      </header>
      <main>
        <Switch>
          <Route exact path="/">
            {!loggedIn && <Login handleLogin={handleLogin} />}
            {loggedIn && <Home />}
          </Route>
          <Route path="/sign-up">
            <SignUp />
          </Route>
        </Switch>
      </main>
      <footer />
    </Router>
  );
}

export default App;
