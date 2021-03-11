import React, { useState } from 'react';
import './App.css';
import { Switch, Route, useHistory } from 'react-router-dom';
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
import CreateUser from './pages/CreateUser';
import ViewUser from './pages/ViewUser';
import OAuthConsume from './pages/OAuthConsume';
import UserInfo from './pages/UserInfo';
import 'react-toastify/dist/ReactToastify.css';
import './css/customToast.css';
import { setAuthHeader } from './components/UseQuery';
// import { gql } from "@apollo/client";
// import { print } from "graphql";

function App() {
  let jwt = '';
  const history = useHistory();
  const handlePageRefresh = async () => {
    window.sessionStorage.setItem('jwt', jwt);
    // console.log('handlePage refresh');
  };
  React.useEffect(() => {
    window.addEventListener('unload', handlePageRefresh);
    return () => {
      window.removeEventListener('unload', handlePageRefresh);
      handlePageRefresh();
    };
  }, []);
  const [loggedIn, setLoggedIn] = useState(false);
  const [updateCount, setUpdateCount] = useState(false);
  const modifyCount = () => { // anything that modifies count (add/delete) should call this
    setUpdateCount(true);
    setUpdateCount(false);
  };
  const handleLogin = (token) => {
    setLoggedIn(true);
    jwt = token;
    setAuthHeader(token);
  };
  React.useEffect(() => {
    if (window.sessionStorage.getItem('token') && !loggedIn) { // If previously logged in and refreshed page
      handleLogin(window.sessionStorage.getItem('jwt'));
      window.sessionStorage.removeItem('jwt');
    } else if (window.sessionStorage.getItem('jwt') && !loggedIn) {
      window.sessionStorage.removeItem('jwt');
    }
  }, [loggedIn]); // The [loggedIn] bit tells React to run this code when loggedIn changes
  const handleSignOut = () => {
    setLoggedIn(false);
    window.sessionStorage.clear();
    history.push('/');
  };
  return (
    <UserProvider loggedIn={loggedIn}>
      <header className="sticky-top text-light" style={{ zIndex: 100 }}>
        <NavBar
          title="HPC IMS"
          loggedIn={loggedIn}
          handleSignOut={handleSignOut}
          updateCount={updateCount}
        />
      </header>
      <main className="d-flex justify-content-center my-5" style={{ zIndex: 0 }}>
        <div className="bg-theme rounded">
          <Switch>
            <Route path="/test">
              <ComponentTest />
            </Route>
            <Route exact path="/">
              {loggedIn ? <Home /> : <Login handleLogin={handleLogin} />}
            </Route>
            <Route path="/viewUsers">
              {loggedIn ? (
                <UsersTable />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route path="/addUser">
              {loggedIn ? (
                <CreateUser onCreation={modifyCount} />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route path="/viewUser">
              {loggedIn ? (
                <ViewUser onDelete={modifyCount} />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route path="/addInstrument">
              {loggedIn ? (
                <CreateInstrument onCreation={modifyCount} />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route path="/addModel">
              {loggedIn ? (
                <CreateModel onCreation={modifyCount} />
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
                <DetailedInstrumentView onDelete={modifyCount} />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route path="/viewModel/">
              {loggedIn ? (
                <DetailedModelView onDelete={modifyCount} />
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
                <BulkImport modifyCount={modifyCount} />
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
            <Route path="/oauth/consume">
              <OAuthConsume handleLogin={handleLogin} />
            </Route>
            <Route path="/userInfo">
              {loggedIn ? (
                <UserInfo />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
          </Switch>
        </div>
      </main>
    </UserProvider>
  );
}

export default App;
