import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Certificate from './pages/Certificate';
import Home from './pages/Home';
import ComponentTest from './pages/ComponentTest';
import { UserProvider } from './components/UserContext';
import CreateModel from './pages/CreateModel';
import ListModels from './pages/ListModels';
import ErrorPage from './pages/ErrorPage';
import ListInstruments from './pages/ListInstruments';
import CreateInstrument from './pages/CreateInstrument';
import BulkImport from './pages/BulkImport';
// import MyDocument from './pages/Certificate';
// import ErrorPage from './pages/ErrorPage';

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
            <Route path="/certificate">
              <Certificate />
            </Route>
            <Route path="/addInstrument">
              <CreateInstrument />
            </Route>
            <Route path="/addModel">
              <CreateModel />
            </Route>
            <Route path="/viewModels">
              <ListModels />
              {/* {loggedIn ? (
                <ListModels />
              ) : (
                <ErrorPage message="You need to sign in first!" />
              )} */}
            </Route>
            <Route path="/viewInstruments">
              {loggedIn ? (
                <ListInstruments />
              ) : (
                <ErrorPage message="You need to sign in first!" />
              )}
            </Route>
            <Route path="/viewCertificate">
              <Certificate />
            </Route>
            <Route path="/import">
              <BulkImport />
              {/* {loggedIn ? (<Import />) : (<ErrorPage message="You need to sign in first!" />)} */}
            </Route>
          </UserProvider>
        </Switch>
      </main>
      <footer />
    </Router>
  );
}

export default App;
