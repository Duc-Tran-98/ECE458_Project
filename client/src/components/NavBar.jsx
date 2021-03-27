/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import UserContext from './UserContext';
import ProfileIcon from './ProfileIcon';

function NavBar({
  loggedIn, handleSignOut, title,
}) {
  NavBar.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    handleSignOut: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };
  const user = React.useContext(UserContext);

  const navContent = loggedIn ? (
    <div className="row" style={{ zIndex: 1, width: '100%' }}>
      <div className="col-auto me-auto">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item dropdown">
            <a
              className="nav-link h5 dropdown-toggle"
              href="#"
              id="navBarDropDown-models"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-layers"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              Models
            </a>
            <ul
              className="dropdown-menu"
              aria-labelledby="navBarDropDown-models"
            >
              <li>
                <NavLink
                  className="dropdown-item"
                  to="/viewModels?page=1&limit=25"
                >
                  Table
                </NavLink>
              </li>
              {(user.isAdmin || user.modelPermission) && (
                <>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/modelCategories?page=1&limit=25"
                    >
                      Categories
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link h5 dropdown-toggle"
              href="#"
              id="navBarDropDown-instruments"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-layers"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              Instruments
            </a>
            <ul
              className="dropdown-menu"
              aria-labelledby="navBarDropDown-instruments"
            >
              <li>
                <NavLink
                  className="dropdown-item"
                  to="/viewInstruments?page=1&limit=25"
                >
                  Table
                </NavLink>
              </li>
              {(user.isAdmin || user.instrumentPermission) && (
                <>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/instrumentCategories?page=1&limit=25"
                    >
                      Categories
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </li>
          {user.isAdmin && (
            <li className="nav-item">
              <NavLink
                className="nav-link h5"
                to="/viewUsers?page=1&limit=25"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-users"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Users
              </NavLink>
            </li>
          )}
        </ul>
      </div>
      <div className="col-auto">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <ProfileIcon handleSignOut={handleSignOut} />
          </li>
          <li className="nav-item">
            <HelpOutlineIcon />
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <NavLink exact to="/" className="nav-link h5" type="button">
          Login
        </NavLink>
      </li>
    </ul>
  );
  return (
    <nav className="navbar navbar-expand-lg nav-bg-theme navbar-dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand h2">
          {title}
        </Link>
        {/* This button is displayed when the screen is less than large */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
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
      </div>
    </nav>
  );
}

export default NavBar;
