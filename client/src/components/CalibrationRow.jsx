/*
This class deals with what a calibration event should be
*/

import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import axios from 'axios';
import MouseOverPopover from './PopOver';
import UserContext from './UserContext';

export default function CalibrationRow({
  handleDelete,
  id,
  onChangeCalibRow,
  comment,
  date,
  entry,
  showSaveButton,
  onSaveClick,
}) {
  CalibrationRow.propTypes = {
    handleDelete: PropTypes.func,
    id: PropTypes.number.isRequired,
    onChangeCalibRow: PropTypes.func.isRequired,
    comment: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    entry: PropTypes.object.isRequired, // This allows us to modify arrays of objects
    showSaveButton: PropTypes.bool, // whether or not to show save button on rows
    onSaveClick: PropTypes.func, // what to call when save button clicked
  };
  CalibrationRow.defaultProps = {
    handleDelete: null,
    showSaveButton: false,
    onSaveClick: () => undefined,
  };
  const user = React.useContext(UserContext);
  const { viewOnly } = entry;
  const today = new Date().toISOString().split('T')[0];
  // const formatOption = (option) => `${option.userName}`;
  // const formatSelected = (option, value) => option.userName === value.userName;
  const val = { userName: entry.user };
  const [file, setFile] = useState('');
  // const [fileData, setFileData] = useState(null);
  // eslint-disable-next-line prefer-const
  return (
    <div className="d-flex justify-content-center">
      <div className="delete-container rounded">
        <div className="row mx-3">
          <div className="col-4 mt-3">
            <Form.Group>
              <Form.Label className="h4">User</Form.Label>
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
            <Form.Group controlId="formDate">
              <Form.Label className="h4">Date</Form.Label>
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
              <Form.Label className="h4">Calibration Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="comment"
                value={comment}
                onChange={(e) => onChangeCalibRow(e, entry)}
                disabled={viewOnly}
              />
            </Form.Group>
          </div>
        </div>
        <div className="row mx-3">
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
                      const data = new FormData();
                      setFile(e.target.files[0].name);
                      console.log(`uploading ${e.target.files[0]}`);
                      data.append('file', e.target.files[0]);

                      axios.post('http://localhost:4001/api/upload', data, {
                        // receive two    parameter endpoint url ,form data
                      }).then((res) => { // then print response status
                        console.log(res);
                      }).catch((err) => {
                        console.log(err.message);
                      });
                    }}
                  />
                  Upload File
                </label>
              </MouseOverPopover>
            )}
            {file.length > 0 && (
            <div>
              <div>{file}</div>
              <button
                type="button"
                className="btn w-100"
                onClick={() => {
                  setFile('');
                }}
              >
                Remove File
              </button>
            </div>
            )}
          </div>
          <div className="col-4">
            {showSaveButton && !viewOnly && (
              <MouseOverPopover message="Save this calibration event">
                <button
                  type="button"
                  className="btn w-100"
                  onClick={() => onSaveClick(entry)}
                >
                  Save
                </button>
              </MouseOverPopover>
            )}
          </div>
        </div>
        {!viewOnly && (
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
