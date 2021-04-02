import React from 'react';
// import AppBarDemo from '../components/AppBarDemo';
// import NavIcons from '../components/NavIcons';
import DisplayGrid from '../components/UITable';
import GetCalibHistory from '../queries/GetCalibHistory';

export default function ComponentTest() {
  const showTableBoolean = (params) => (params.value ? (
    <div className="position-relative w-50 h-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="MediumSeaGreen"
        className="bi bi-check-circle-fill position-absolute top-50 start-50 translate-middle"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </svg>
    </div>
  ) : (
    <div className="position-relative w-50 h-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="tomato"
        className="bi bi-x-circle-fill position-absolute top-50 start-50 translate-middle"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
      </svg>
    </div>
  ));
  const cols = [
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      description: 'Date',
    },
    {
      field: 'user',
      headerName: 'User',
      width: 150,
      description: 'User',
    },
    {
      field: 'fileName',
      headerName: 'File',
      width: 150,
      description: 'File name',
      renderCell: (params) => (
        <>
          {params.value ? (
            <a href={`../data/${params.row.fileLocation}`} download={params.value}>
              {params.value}
            </a>
          ) : (
            'N/A'
          )}
        </>
      ),
    },
    {
      field: 'loadBankData',
      headerName: 'Load Bank',
      width: 150,
      description: 'Calibrated as load bank',
      renderCell: (params) => showTableBoolean(params),
    },
    {
      field: 'klufeData',
      headerName: 'Klufe',
      width: 150,
      description: 'Calibrated via Klufe',
      renderCell: (params) => showTableBoolean(params),
    },
  ];
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    GetCalibHistory({
      id: 1,
      handleResponse: (response) => {
        if (response) {
          setRows(response);
          console.log(response);
        }
      },
    });
  }, []);
  return <><DisplayGrid cols={cols} rows={rows} /></>;
}
