/* eslint-disable react/require-default-props */
/*
This class deals with what a calibration event should be
*/

import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import MouseOverPopover from './PopOver';
import UserContext from './UserContext';

export default function CalibrationRow({
  handleDelete,
  id,
  onChangeCalibRow,
  comment,
  fileName,
  fileLocation,
  loadBankData,
  klufeData,
  // eslint-disable-next-line no-unused-vars
  file,
  date,
  entry,
  showSaveButton,
  onSaveClick = () => undefined,
  showDeleteBtn = true,
}) {
  CalibrationRow.propTypes = {
    handleDelete: PropTypes.func,
    id: PropTypes.number.isRequired,
    onChangeCalibRow: PropTypes.func.isRequired,
    comment: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    fileLocation: PropTypes.string.isRequired,
    loadBankData: PropTypes.string.isRequired,
    klufeData: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    file: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    entry: PropTypes.object.isRequired, // This allows us to modify arrays of objects
    showSaveButton: PropTypes.bool, // whether or not to show save button on rows
    onSaveClick: PropTypes.func, // what to call when save button clicked
    // eslint-disable-next-line react/require-default-props
    showDeleteBtn: PropTypes.bool,
  };
  CalibrationRow.defaultProps = {
    file: null,
    handleDelete: null,
    showSaveButton: false,
  };
  const user = React.useContext(UserContext);
  const { viewOnly } = entry;
  const today = new Date().toISOString().split('T')[0];
  // const formatOption = (option) => `${option.userName}`;
  // const formatSelected = (option, value) => option.userName === value.userName;
  const val = { userName: entry.user };
  const [fileNameDisplay, setFileNameDisplay] = useState('');
  const [displayError, setDisplayError] = useState('');
  const maxCalibrationComment = 2000;
  const isValidForm = () => comment.length <= maxCalibrationComment;
  // const [fileData, setFileData] = useState(null);
  // eslint-disable-next-line prefer-const
  return (
    <div className="d-flex justify-content-center w-100">
      <div className="delete-container rounded w-100">
        <div className="row mx-auto w-100">
          <div className="col-4 mt-3">
            <Form.Group>
              <Form.Label className="h5">User</Form.Label>
              {viewOnly ? (
                <Form.Control
                  name="user"
                  type="text"
                  value={val.userName}
                  disabled
                />
              ) : (
                // <AsyncSuggest
                //   query={query}
                //   queryName={queryName}
                //   onInputChange={(e, v) => onInputChange(e, v, entry)}
                //   label="Choose a user"
                //   getOptionSelected={formatSelected}
                //   getOptionLabel={formatOption}
                //   value={val}
                // />
                <Form.Control
                  name="user"
                  type="text"
                  value={user.userName}
                  disabled
                />
              )}
            </Form.Group>
          </div>
          <div className="col-4 mt-3">
            <Form.Group>
              <Form.Label className="h5">Date</Form.Label>
              <Form.Control
                name="date"
                type="date"
                max={today}
                value={date}
                onChange={(e) => onChangeCalibRow(e, entry)}
                required
                disabled={viewOnly}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a date.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="col-4 mt-3">
            <Form.Group controlId="formComment">
              <Form.Label className="h5">Calibration Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comment"
                value={comment}
                onChange={(e) => onChangeCalibRow(e, entry)}
                disabled={viewOnly}
                isInvalid={comment.length > maxCalibrationComment}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a shorter calibration comment.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>
        <div className="row w-100 mx-auto">
          <div className="col-4">
            {!viewOnly && (
              <MouseOverPopover message="Upload a JPG, PNG, GIF, PDF, or XLSX file">
                {/* add file validation/display selected files with the onInput handler */}
                <label className="btn position-relative text-center w-100">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.gif,.png,.xlsx"
                    className="invisible position-absolute top-0 start-0"
                    id={`inputFile-${id}`}
                    onInput={(e) => {
                      if (e.target.files[0]) {
                        setFileNameDisplay('');
                        const removeIfCurrent = {
                          target: {
                            name: 'fileInput',
                            remove: true,
                          },
                        };
                        onChangeCalibRow(removeIfCurrent, entry);
                        if (e.target.files[0].size < 32 * 1024 * 1024) {
                          if (
                            e.target.files[0].type === 'image/jpeg'
                            || e.target.files[0].type === 'image/png'
                            || e.target.files[0].type === 'image/gif'
                            || e.target.files[0].type === 'application/pdf'
                            || e.target.files[0].type
                              === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                          ) {
                            e.target.name = 'fileInput';
                            e.target.remove = false;
                            setFileNameDisplay(e.target.files[0].name);
                            setDisplayError('');
                            onChangeCalibRow(e, entry);
                          } else {
                            setDisplayError(
                              'ERROR: File must be of type JPG, PNG, GIF, PDF, or XLSX',
                            );
                            setFileNameDisplay('');
                          }
                        } else {
                          setDisplayError(
                            'ERROR: File size must be less than 32 mb',
                          );
                          setFileNameDisplay('');
                        }
                      }
                    }}
                  />
                  Upload File
                </label>
              </MouseOverPopover>
            )}
            {viewOnly && fileName && (
              <div>
                <a href={`../data/${fileLocation}`} download={fileName}>
                  Download attachment
                  {' '}
                  {fileName}
                </a>
              </div>
            )}
            {viewOnly && loadBankData && !fileName && (
              <div> CALIBRATED BY HPT LOAD BANK WIZARD </div>
            )}
            {viewOnly && klufeData && !fileName && (
              <div> CALIBRATED BY KLUFE K5700 </div>
            )}
            {fileNameDisplay.length > 0 && (
              <div>
                <div>{fileNameDisplay}</div>
                <button
                  type="button"
                  className="btn w-100"
                  onClick={() => {
                    setFileNameDisplay('');
                    const e = {
                      target: {
                        name: 'fileInput',
                        remove: true,
                      },
                    };
                    onChangeCalibRow(e, entry);
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            {displayError.length > 0 && <div>{displayError}</div>}
          </div>
          <div className="col-4">
            {showSaveButton && !viewOnly && (
              <MouseOverPopover message="Save this calibration event">
                <button
                  type="button"
                  className="btn w-100"
                  onClick={() => {
                    if (isValidForm()) {
                      onSaveClick(entry);
                    }
                  }}
                  id={`save-btn-${entry.id}`}
                >
                  Save
                </button>
              </MouseOverPopover>
            )}
          </div>
        </div>
        {!viewOnly && showDeleteBtn && (
          <MouseOverPopover message="Delete this calibration event">
            <button
              type="button"
              className="delete-x"
              onClick={() => handleDelete(id)}
            >
              X
            </button>
          </MouseOverPopover>
        )}
      </div>
    </div>
  );
}

/*
<Form.Control
              name="user"
              type="text"
              placeholder="Unknown"
              value={user}
              onChange={(e) => onChangeCalibRow(e, entry)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please select a user.
            </Form.Control.Feedback>
*/
