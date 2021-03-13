import React, { useState } from 'react';
import './App.css';
import { Switch, Route, useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
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
import GetUser from './queries/GetUser';

function App() {
  let jwt = '';
  let intervalId = 0;
  const pollingPeriod = 3 * 1000; // 3s * 1000 ms/s
  const howLongTillSignOut = 1.5 * 1000; // 1.5 s after discovering user no longer exists, sign out
  const history = useHistory();
  const handlePageRefresh = async (token) => {
    // this will save token in local storage before reloading page
    window.sessionStorage.setItem('jwt', token);
  };
  const [loggedIn, setLoggedIn] = useState(false);
  const [updateCount, setUpdateCount] = useState(false);
  const modifyCount = () => {
    // anything that modifies count (add/delete) should call this
    setUpdateCount(true);
    setUpdateCount(false);
  };
  const handleSignOut = () => {
    window.sessionStorage.clear();
    history.push('/');
    setLoggedIn(false);
  };
  const handleLogin = async (newJwt) => {
    setLoggedIn(true);
    jwt = newJwt;
    setAuthHeader(newJwt);
    console.log(`set auth header = ${newJwt}`);
    intervalId = setInterval(() => {
      // add polling to check if user exists or not
      const token = window.sessionStorage.getItem('token');
      if (token) {
        GetUser({
          userName: Buffer.from(token, 'base64').toString('ascii'),
          includeAll: true,
        }).then((res) => {
          if (typeof res === 'undefined') {
            // undefined => user got deleted
            toast.error('This account has been delted!');
            clearInterval(intervalId);
            setTimeout(() => {
              handleSignOut();
            }, howLongTillSignOut);
          } else {
            console.log(res);
          }
        });
      }
    }, pollingPeriod); // every 3s, check if user still exists
  };
  React.useEffect(() => {
    if (window.sessionStorage.getItem('token') && !loggedIn) {
      // If previously logged in and refreshed page
      jwt = window.sessionStorage.getItem('jwt');
      handleLogin(jwt).then(() => {
        if (jwt) {
          window.sessionStorage.removeItem('jwt');
        }
      });
    }
  }, [loggedIn]); // The [loggedIn] bit tells React to run this code when loggedIn changes
  React.useEffect(() => {
    // a use effect for jwt to keep it ephemeral
    window.addEventListener('beforeunload', () => handlePageRefresh(jwt));
    return () => {
      window.removeEventListener('beforeunload', handlePageRefresh);
    };
  }, [jwt]);
  return (
    <UserProvider loggedIn={loggedIn}>
      <ToastContainer />
      <header className="sticky-top text-light" style={{ zIndex: 100 }}>
        <NavBar
          title="HPC IMS"
          loggedIn={loggedIn}
          handleSignOut={handleSignOut}
          updateCount={updateCount}
        />
      </header>
      <main
        className="d-flex justify-content-center my-5"
        style={{ zIndex: 0 }}
      >
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
              {loggedIn ? <Certificate /> : <Login handleLogin={handleLogin} />}
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
                <ManageCategories modifyCount={modifyCount} />
              ) : (
                <Login handleLogin={handleLogin} />
              )}
            </Route>
            <Route path="/instrumentCategories">
              {loggedIn ? (
                <ManageCategories modifyCount={modifyCount} />
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
