import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserContext from './UserContext';
import { CountAllModels } from '../queries/GetAllModels';
import { CountInstruments } from '../queries/GetAllInstruments';
import { CountAllUsers } from '../queries/GetUser';
import ProfileIcon from './ProfileIcon';
import { CountModelCategories } from '../queries/GetModelCategories';

function NavBar({
  loggedIn, handleSignOut, title, updateCount,
}) {
  NavBar.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    handleSignOut: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    updateCount: PropTypes.bool.isRequired,
  };
  const user = React.useContext(UserContext);
  const [modelCount, setModelCount] = React.useState('');
  const [instrumentCount, setInstrumentCount] = React.useState('');
  const [userCount, setUserCount] = React.useState('');
  const [modelCatCount, setModelCatCount] = React.useState('');
  React.useEffect(() => {
    CountAllModels().then((val) => setModelCount(val));
    CountInstruments().then((val) => setInstrumentCount(val));
    CountAllUsers().then((val) => setUserCount(val));
    CountModelCategories().then((val) => setModelCatCount(val));
  }, [updateCount]);

  const navContent = loggedIn ? (
    <div className="row" style={{ zIndex: 1, width: '100%' }}>
      <div className="col-auto me-auto">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/">
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
                className="feather feather-home"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to={`/viewModels?page=1&limit=25&count=${modelCount}`}
              id="modelNavLink"
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
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to={`/viewInstruments?page=1&limit=25&count=${instrumentCount}`}
              id="instrumentNavLink"
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
            </NavLink>
          </li>
          {user.isAdmin && (
          <>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to={`/viewUsers?page=1&limit=25&count=${userCount}`}
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
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to={`/modelCategories?page=1&limit=25&count=${modelCatCount}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-tags"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    fillRule="evenodd"
                    // eslint-disable-next-line max-len
                    d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"
                  />
                </svg>
                Categories
              </NavLink>
            </li>
          </>
          )}
        </ul>
      </div>
      <div className="col-auto">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <ProfileIcon handleSignOut={handleSignOut} />
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <NavLink exact to="/" className="nav-link" type="button">
          Login
        </NavLink>
      </li>
    </ul>
  );
  return (
    <nav className="navbar navbar-expand-lg nav-bg-theme navbar-dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
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
