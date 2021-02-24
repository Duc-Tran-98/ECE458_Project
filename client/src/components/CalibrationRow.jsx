/*
This class deals with what a calibration event should be
*/

import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import MouseOverPopover from './PopOver';
import UserContext from './UserContext';

export default function CalibrationRow({
  handleDelete, id, onChangeCalibRow, comment, date, entry,
}) {
  CalibrationRow.propTypes = {
    handleDelete: PropTypes.func,
    id: PropTypes.number.isRequired,
    onChangeCalibRow: PropTypes.func.isRequired,
    comment: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    entry: PropTypes.object.isRequired, // This allows us to modify arrays of objects
  };
  CalibrationRow.defaultProps = {
    handleDelete: null,
  };
  const user = React.useContext(UserContext);
  const { viewOnly } = entry;
  const today = new Date().toISOString().split('T')[0];
  // const formatOption = (option) => `${option.userName}`;
  // const formatSelected = (option, value) => option.userName === value.userName;
  const val = { userName: entry.user };
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
