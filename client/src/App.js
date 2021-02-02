import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { gql } from "@apollo/client";
import { print } from "graphql";
import axios from "axios";
import ErrorPage from "./pages/ErrorPage";

const route = process.env.NODE_ENV.includes("dev")
  ? "http://localhost:4000"
  : "/api";
function App(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleLogin = () => {
    setLoggedIn(true);
    const ADMIN_QUERY = gql`
      query isAdmin($userName: String!) {
        isAdmin(userName: $userName)
      }
    `;
    axios
      .post(route, {
        query: print(ADMIN_QUERY),
        variables: {
          userName: window.sessionStorage.getItem("userName"),
        },
      })
      .then((res) => {
        if (res.data.data.isAdmin) {
          setIsAdmin(true);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleSignOut = () => {
    setLoggedIn(false);
    setIsAdmin(false);
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
        </Switch>
      </main>
      <footer></footer>
    </Router>
  );
}

export default App;
