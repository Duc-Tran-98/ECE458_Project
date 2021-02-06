import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import ComponentTest from './pages/ComponentTest';
import { UserProvider } from './components/UserContext';
import CreateModel from './pages/CreateModel';
import ListModels from './pages/ListModels';
import ErrorPage from './pages/ErrorPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const handleLogin = () => {
    setLoggedIn(true);
  };
  const handleSignOut = () => {
    setLoggedIn(false);
    window.sessionStorage.clear();
  };
  return (
    <Router>
      <header>
        <NavBar
          title="Team Teams"
          loggedIn={loggedIn}
          handleSignOut={handleSignOut}
        />
      </header>
      <main>
        <Switch>
          <Route path="/viewModels">
            {loggedIn ? (
              <ListModels />
            ) : (
              <ErrorPage message="You need to sign in first!" />
            )}
          </Route>
          <Route path="/test">
            <ComponentTest />
          </Route>
          <UserProvider>
            <Route exact path="/">
              {loggedIn ? <Home /> : <Login handleLogin={handleLogin} />}
            </Route>
            <Route path="/register">
              <SignUp />
            </Route>
            <Route path="/addModel">
              <CreateModel />
            </Route>
          </UserProvider>
        </Switch>
      </main>
      <footer />
    </Router>
  );
}

export default App;
