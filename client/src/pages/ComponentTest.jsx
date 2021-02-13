/* eslint-disable max-len */
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import GetAllInstruments, { CountInstruments } from '../queries/GetAllInstruments';
import MouseOverPopover from '../components/PopOver';
import GetCalibHistory from '../queries/GetCalibHistory';

function ComponentTest() {
  // const cols = [
  //   {
  //     field: 'id',
  //     headerName: 'ID',
  //     width: 60,
  //     hide: true,
  //     disableColumnMenu: true,
  //     type: 'number',
  //   },
  //   { field: 'vendor', headerName: 'Vendor', width: 150 },
  //   { field: 'modelNumber', headerName: 'Model Number', width: 150 },
  //   { field: 'description', headerName: 'Description', width: 225 },
  //   { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
  //   {
  //     field: 'view',
  //     headerName: ' ',
  //     width: 60,
  //     disableColumnMenu: true,
  //     renderCell: () => (
  //       <div className="row">
  //         <div className="col mt-1">
  //           <MouseOverPopover message="View Instrument">
  //             <Link
  //               to="/viewInstrument/"
  //             >
  //               <SearchIcon />
  //             </Link>
  //           </MouseOverPopover>
  //         </div>
  //       </div>
  //     ),
  //   },
  // ];
  const genDaysLeft = (date) => {
    const today = new Date();
    const exp = new Date(date);
    return Math.round((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
  };
  const genClassName = (daysLeft) => {
    if (daysLeft > 30) {
      return 'text-success';
    }
    if (daysLeft > 0 && daysLeft <= 30) {
      return 'text-warning';
    }
    return 'text-danger';
  };
  const cols = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      hide: true,
      disableColumnMenu: true,
      type: 'number',
    },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'modelNumber', headerName: 'Model Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 225 },
    { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
    {
      field: 'date',
      headerName: 'Most Recent Calibration',
      width: 250,
      type: 'date',
    },
    {
      field: 'calibrationStatus',
      headerName: 'Calibration Expiration',
      width: 200,
      type: 'number',
      renderCell: (params) => (
        <div className="row">
          <div className="col mt-3">
            {params.value === 'OoO' && (
              <MouseOverPopover
                className="mb-3"
                message="Instrument not calibrated!"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-emoji-angry-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.053 4.276a.5.5 0 0 1 .67-.223l2 1a.5.5 0 0 1 .166.76c.071.206.111.44.111.687C7 7.328 6.552 8 6 8s-1-.672-1-1.5c0-.408.109-.778.285-1.049l-1.009-.504a.5.5 0 0 1-.223-.67zm.232 8.157a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 1 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5 0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5z" />
                </svg>
              </MouseOverPopover>
            )}
            {params.value === 'NA' ? (
              <MouseOverPopover
                className="mb-3"
                message="Instrument not calibratable"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="#f78102"
                  className="bi bi-calendar-x"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
              </MouseOverPopover>
            ) : (
              params.value !== 'OoO' && (
                <MouseOverPopover
                  className="mb-3"
                  message={`${genDaysLeft(
                    params.value,
                  )} days left till next calibration`}
                >
                  <span className={genClassName(genDaysLeft(params.value))}>
                    {params.value}
                  </span>
                </MouseOverPopover>
              )
            )}
          </div>
        </div>
      ),
    },
    {
      field: 'view',
      headerName: ' ',
      width: 60,
      disableColumnMenu: true,
      renderCell: () => (
        <div className="row">
          <div className="col mt-1">
            <MouseOverPopover message="View Instrument">
              <Link
                to="/viewInstrument/"
              >
                <SearchIcon />
              </Link>
            </MouseOverPopover>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="bg-light">
      <h1>Hello! I am a test. Add some components to try me out :</h1>
      <ServerPaginationGrid
        cols={cols}
        getRowCount={CountInstruments}
        fetchData={(limit, offset) => GetAllInstruments({ limit, offset }).then((response) => {
          response.forEach((element) => {
            GetCalibHistory({
              // Get calibration history for each instrument
              id: element.id,
              mostRecent: true,
            }).then((value) => {
              // eslint-disable-next-line no-param-reassign
              element.date = element.calibrationFrequency === 0
                ? 'Item not calibratable'
                : 'Not calibrated';
              // eslint-disable-next-line no-param-reassign
              element.calibrationStatus = element.calibrationFrequency === 0 ? 'NA' : 'OoO';
              // eslint-disable-next-line no-param-reassign
              element.user = value ? value.user : 'No user found';
              // eslint-disable-next-line no-param-reassign
              element.calibComment = value ? value.comment : 'No comment found';
              if (value) {
                // eslint-disable-next-line no-param-reassign
                element.date = value.date;
                const nextCalibDate = new Date(value.date)
                  .addDays(element.calibrationFrequency)
                  .toISOString()
                  .split('T')[0];
                // eslint-disable-next-line no-param-reassign
                element.calibrationStatus = nextCalibDate;
              }
            });
          });
          return response;
        })}
      />
    </div>

  );
}

export default ComponentTest;
