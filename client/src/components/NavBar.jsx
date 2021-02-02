import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function NavBar({ loggedIn, handleSignOut, title }) {
  // TODO - verify with Angel these are correct types
  NavBar.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    handleSignOut: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  const navContent = loggedIn ? (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <NavLink
          exact
          to="/"
          className="nav-link"
          type="button"
          onClick={handleSignOut}
        >
          Sign Out
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/projects" className="nav-link" type="button">
          Projects
        </NavLink>
      </li>
    </ul>
  ) : (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <NavLink exact to="/" className="nav-link" type="button">
          Login
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/sign-up" className="nav-link" type="button">
          Sign Up
        </NavLink>
      </li>
    </ul>
  );
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
        {title}
      </Link>
      {/* This button is displayed when the screen is less than large */}
      <button
        className="navbar-toggler border border-light"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          className="navbar-toggler-icon bi bi-caret-down-square-fill"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4 4a.5.5 0 0 0-.374.832l4 4.5a.5.5 0 0 0 .748 0l4-4.5A.5.5 0 0 0 12 6H4z"
          />
        </svg>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {navContent}
        {/* <form className="form-inline my-2 my-lg-0">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              className="bi bi-search"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"
              />
              <path
                fillRule="evenodd"
                d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"
              />
            </svg>
          </button>
        </form> */}
      </div>
    </nav>
  );
}

export default NavBar;
