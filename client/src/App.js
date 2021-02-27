import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Certificate from './pages/Certificate';
import Home from './pages/Home';
import ComponentTest from './pages/ComponentTest';
import { UserProvider } from './components/UserContext';
import CreateModel from './pages/CreateModel';
import ListModels from './pages/ListModels';
import ListInstruments from './pages/ListInstruments';
import CreateInstrument from './pages/CreateInstrument';
import DetailedInstrumentView from './pages/ViewInstrument';
import DetailedModelView from './pages/ViewModel';
import BulkImport from './pages/BulkImport';
import ManageCategories from './pages/ManageCategories';
import UsersTable from './pages/UsersTable';
import SignUp from './pages/SignUp';
import ViewUser from './pages/ViewUser';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  React.useEffect(() => {
    if (window.sessionStorage.getItem('token') && !loggedIn) { // If previously logged in and refreshed page
      setLoggedIn(true); // loggedIn goes back to false, so we set it back to true
    }
  }, [loggedIn]); // The [loggedIn] bit tells React to run this code when loggedIn changes
  const handleLogin = () => {
    setLoggedIn(true);
  };
  const handleSignOut = () => {
    setLoggedIn(false);
    window.sessionStorage.clear();
    window.location.href = '/';
  };
  return (
    <Router>
      <UserProvider>
        <header className="sticky-top text-light">
          <NavBar
            title="HPC IMS"
            loggedIn={loggedIn}
            handleSignOut={handleSignOut}
          />
        </header>
        <main className="d-flex justify-content-center my-5">
          <div className="bg-theme rounded">
            <Switch>
              <Route path="/test">
                <ComponentTest />
              </Route>
              <Route exact path="/">
                {loggedIn ? <Home /> : <Login handleLogin={handleLogin} />}
              </Route>
              <Route path="/viewUsers">
                {loggedIn ? <UsersTable /> : <Login handleLogin={handleLogin} />}
              </Route>
              <Route path="/addUser">
                {loggedIn ? <SignUp /> : <Login handleLogin={handleLogin} />}
              </Route>
              <Route path="/viewUser">
                {loggedIn ? <ViewUser /> : <Login handleLogin={handleLogin} />}
              </Route>
              <Route path="/addInstrument">
                {loggedIn ? (
                  <CreateInstrument />
                ) : (
                  <Login handleLogin={handleLogin} />
                )}
              </Route>
              <Route path="/addModel">
                {loggedIn ? (
                  <CreateModel />
                ) : (
                  <Login handleLogin={handleLogin} />
                )}
              </Route>
              <Route path="/viewModels">
                {loggedIn ? (
                  <ListModels />
                ) : (
                  <Login handleLogin={handleLogin} />
                )}
              </Route>
              <Route path="/viewInstruments">
                {loggedIn ? (
                  <ListInstruments />
                ) : (
                  <Login handleLogin={handleLogin} />
                )}
              </Route>
              <Route path="/viewInstrument/">
                {loggedIn ? (
                  <DetailedInstrumentView />
                ) : (
                  <Login handleLogin={handleLogin} />
                )}
              </Route>
              <Route path="/viewModel/">
                {loggedIn ? (
                  <DetailedModelView />
                ) : (
                  <Login handleLogin={handleLogin} />
                )}
              </Route>
              <Route path="/viewCertificate">
                {loggedIn ? (
                  <Certificate />
                ) : (
                  <Login handleLogin={handleLogin} />
                )}
              </Route>
              <Route path="/import">
                {loggedIn ? (
                  <BulkImport />
                ) : (
                  <Login handleLogin={handleLogin} />
                )}
              </Route>
              <Route path="/modelCategories">
                {loggedIn ? (
                  <ManageCategories />
                ) : (
                  <Login handleLogin={handleLogin} />
                )}
              </Route>
              <Route path="/instrumentCategories">
                {loggedIn ? (
                  <ManageCategories />
                ) : (
                  <Login handleLogin={handleLogin} />
                )}
              </Route>
            </Switch>
          </div>
        </main>
      </UserProvider>
    </Router>
  );
}

export default App;
