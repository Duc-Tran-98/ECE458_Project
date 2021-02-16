import React, { useContext } from 'react';
import SideNav from '../components/SideNav';
import UserContext from '../components/UserContext';

function Home() {
  const user = useContext(UserContext);

  return (
    <div className="container-fluid">
      <div className="row">
        <SideNav isAdmin={user.isAdmin} />
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h1 className="h2">
              Welcome
              {' '}
              {user.firstName}
            </h1>
            {/* <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group mr-2">
                <button className="btn btn-sm btn-outline-light text-light" type="button">
                  Share
                </button>
                <button className="btn btn-sm btn-outline-light text-light" type="button">
                  Export
                </button>
              </div>
              <button className="btn btn-sm btn-outline-light dropdown-toggle" type="button">
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
                  className="feather feather-calendar"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                This week
              </button>
            </div>
           */}
          </div>
          <h2>Developer Guide</h2>
          <p>PUT GUIDE HERE</p>
          <p>Created for ECE 458 by Angel Huizar, Louis Jensen, Max Smith, Duc Tran, and Natasha Von Seelen</p>
        </main>
      </div>
    </div>
  );
}

export default Home;
