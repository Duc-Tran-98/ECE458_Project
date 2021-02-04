import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import { gql } from '@apollo/client';
// import { print } from 'graphql';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import ComponentTest from './pages/ComponentTest';
import { UserProvider } from './components/UserContext';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleLogin = () => {
    setLoggedIn(true);
  };
  const handleSignOut = () => {
    setLoggedIn(false);
    setIsAdmin(false);
    window.sessionStorage.clear();
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
          <UserProvider>
            <Route exact path="/">
              {loggedIn ? (
                <Home isAdmin={isAdmin} />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route path="/register">
              {isAdmin ? (
                <SignUp />
              ) : (
                <ErrorPage message={"You don't have the right permissions!"} />
              )}
            </Route>
            <Route path="/test">
              <ComponentTest />
            </Route>
          </UserProvider>
        </Switch>
      </main>
      <footer />
    </Router>
  );
}

export default App;
