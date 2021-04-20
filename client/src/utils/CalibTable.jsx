/* eslint-disable import/prefer-default-export */
/*
This file has the cols that describe the calibration table for the view instrument page
*/
import MouseOverPopover from '../components/PopOver';

const showApprovalStatus = (params) => {
  switch (params.value) {
    case 1:
    case 3:
      return (
        <div className="position-relative w-50 h-100">
          <MouseOverPopover message="Approved">
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
          </MouseOverPopover>
        </div>
      );
    case 0:
      return (
        <div className="position-relative w-50 h-100">
          <MouseOverPopover message="Pending">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="lightPink"
              className="bi bi-question-circle-fill position-absolute top-50 start-50 translate-middle"
              viewBox="0 0 16 16"
            >
              {/* eslint-disable-next-line max-len */}
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
            </svg>
          </MouseOverPopover>
        </div>
      );
    default:
      return (
        <div className="position-relative w-50 h-100">
          <MouseOverPopover message="Rejected">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="darkgrey"
              className="bi bi-x-circle-fill position-absolute top-50 start-50 translate-middle"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
          </MouseOverPopover>
        </div>
      );
  }
};

const getCalibrationType = (params) => {
  if (params.row.loadBankData) {
    return 'Load Bank';
  }
  if (params.row.klufeData) {
    return 'Klufe';
  }
  if (params.row.customFormData) {
    return 'Custom';
  }
  return 'Plain';
};
export const cols = [
  {
    field: 'date',
    headerName: 'Date',
    width: 110,
    description: 'Date',
  },
  {
    field: 'user',
    headerName: 'User',
    width: 110,
    description: 'User',
  },
  {
    field: 'fileName',
    headerName: 'File',
    width: 130,
    description: 'File name',
    renderCell: (params) => (
      <>
        {params.value ? (
          <a
            href={`../data/${params.row.fileLocation}`}
            download={params.value}
          >
            {params.value}
          </a>
        ) : (
          'N/A'
        )}
      </>
    ),
  },
  {
    field: 'calibrationType',
    headerName: 'Type',
    description: 'Type of calibration',
    width: 100,
    renderCell: (params) => getCalibrationType(params),
  },
  {
    field: 'approvalStatus',
    headerName: 'Approval',
    description: 'Approval status',
    width: 120,
    renderCell: (params) => showApprovalStatus(params),
  },
];

export const approvalCols = [
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    description: 'Date',
  },
  {
    field: 'user',
    headerName: 'User',
    width: 120,
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
          <a
            href={`../data/${params.row.fileLocation}`}
            download={params.value}
          >
            {params.value}
          </a>
        ) : (
          ' '
        )}
      </>
    ),
  },
  {
    field: 'calibrationType',
    headerName: 'Type',
    description: 'Type of calibration',
    width: 100,
    renderCell: (params) => getCalibrationType(params),
  },
  {
    field: 'vendor',
    headerName: 'Vendor',
    width: 120,
    description: 'Vendor',
  },
  {
    field: 'modelNumber',
    headerName: 'Model Number',
    width: 170,
    description: 'Model Number',
  },
  {
    field: 'assetTag',
    headerName: 'Asset Tag',
    width: 140,
    description: 'Asset Tag',
  },
  {
    field: 'serialNumber',
    headerName: 'Serial Number',
    width: 150,
    description: 'Serial Number',
  },
];
