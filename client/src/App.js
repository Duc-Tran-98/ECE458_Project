import React, { useState } from 'react';
import './App.css';
import {
  Switch, Route, useHistory, Redirect,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import $ from 'jquery';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Help from './pages/Help';
import Certificate from './pages/Certificate';
import ComponentTest from './pages/ComponentTest';
import { UserProvider } from './components/UserContext';
import ListModels from './pages/ListModels';
import ListInstruments from './pages/ListInstruments';
import DetailedInstrumentView from './pages/ViewInstrument';
import DetailedModelView from './pages/ViewModel';
import BulkImport from './pages/BulkImport';
import ManageCategories from './pages/ManageCategories';
import UsersTable from './pages/UsersTable';
import ViewUser from './pages/ViewUser';
import OAuthConsume from './pages/OAuthConsume';
import UserInfo from './pages/UserInfo';
import 'react-toastify/dist/ReactToastify.css';
import './css/customToast.css';
import { setAuthHeader } from './components/UseQuery';
import CalibrationApproval from './pages/CalibrationApproval';

function App() {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  let jwt = '';
  const [updateNotification, setUpdateNotification] = React.useState(false);
  const handlePageRefresh = async (token) => {
    // this will save token in local storage before reloading page
    window.sessionStorage.setItem('jwt', token);
  };
  const eventListenerFunc = () => {
    handlePageRefresh(jwt);
  };
  const handleSignOut = (intervalId = null) => {
    $(window).off('beforeunload');
    jwt = '';
    setAuthHeader(jwt);
    window.sessionStorage.clear();
    history.push('/');
    setLoggedIn(false);
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
  const handleLogin = async (newJwt) => {
    jwt = newJwt;
    setAuthHeader(jwt);
    // console.log(`set auth header = ${jwt}`);
    $(window).on('beforeunload', eventListenerFunc);
    setTimeout(() => {
      setLoggedIn(true);
    }, 50);
  };
  const handleUpdateNotification = () => {
    setUpdateNotification(true);
    setUpdateNotification(false);
  };
  React.useEffect(() => {
    if (window.sessionStorage.getItem('token') && !loggedIn) {
      // If previously logged in and refreshed page
      handleLogin(window.sessionStorage.getItem('jwt')).then(() => {
        if (window.sessionStorage.getItem('jwt')) {
          window.sessionStorage.removeItem('jwt');
        }
      });
    }
    return () => {
      window.removeEventListener('beforeunload', handlePageRefresh);
    };
  }, [loggedIn]); // The [loggedIn] bit tells React to run this code when loggedIn changes

  return (
    <UserProvider loggedIn={loggedIn} handleSignOut={handleSignOut}>
      <ToastContainer />
      <header className="sticky-top text-light" style={{ zIndex: 100 }}>
        <NavBar
          title="PM"
          loggedIn={loggedIn}
          handleSignOut={handleSignOut}
          updateNotification={updateNotification}
        />
      </header>
      <main style={{ zIndex: 0 }}>
        <div className="bg-theme rounded ">
          <Switch>
            <Route path="/test">
              <ComponentTest />
            </Route>
            <Route path="/viewCalibrationArppovals">
              {loggedIn ? (
                <CalibrationApproval
                  onCalibEventUpdated={handleUpdateNotification}
                />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route exact path="/">
              {loggedIn ? (
                <Redirect to="/viewModels?page=1&limit=25" />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route path="/help">
              {loggedIn ? <Help /> : <Login handleLogin={handleLogin} />}
            </Route>
            <Route path="/viewUsers">
              {loggedIn ? <UsersTable /> : <Login handleLogin={handleLogin} />}
            </Route>
            <Route path="/viewUser">
              {loggedIn ? <ViewUser /> : <Login handleLogin={handleLogin} />}
            </Route>
            <Route path="/viewModels">
              {loggedIn ? <ListModels /> : <Login handleLogin={handleLogin} />}
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
                <DetailedInstrumentView
                  onCalibEventAdded={handleUpdateNotification}
                />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route path="/viewModel/">
              {loggedIn ? (
                <DetailedModelView onChange={handleUpdateNotification} />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route path="/viewCertificate">
              {loggedIn ? <Certificate /> : <Login handleLogin={handleLogin} />}
            </Route>
            <Route path="/import">
              {loggedIn ? <BulkImport /> : <Login handleLogin={handleLogin} />}
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
              {loggedIn ? <UserInfo /> : <Login handleLogin={handleLogin} />}
            </Route>
          </Switch>
        </div>
      </main>
    </UserProvider>
  );
}

export default App;
