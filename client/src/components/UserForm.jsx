import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Query from './UseQuery';
import UserContext from './UserContext';

export default function UserForm({
  onSubmit, changeHandler, formState, onChangeCheckbox,
}) {
  UserForm.propTypes = {
    onSubmit: PropTypes.func,
    changeHandler: PropTypes.func,
    onChangeCheckbox: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    formState: PropTypes.object.isRequired,
  };
  UserForm.defaultProps = {
    onSubmit: () => undefined,
    changeHandler: () => undefined,
    onChangeCheckbox: () => undefined,
  };
  return (
    <form className="needs-validation" noValidate onSubmit={onSubmit}>
      <div className="row mx-3">
        <div className="col mt-3">
          <label htmlFor="validationCustom01" className="h5">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="validationCustom01"
            placeholder="First name"
            name="firstName"
            value={formState.firstName}
            onChange={changeHandler}
            required
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
        <div className="col mt-3">
          <label htmlFor="validationCustom02" className="h5">
            Last name
          </label>
          <input
            type="text"
            className="form-control"
            id="validationCustom02"
            placeholder="Last name"
            name="lastName"
            value={formState.lastName}
            onChange={changeHandler}
            required
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
        <div className="col mt-3">
          <label htmlFor="validationCustomUsername" className="h5">
            Username
          </label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroupPrepend">
                @
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              id="validationCustomUsername"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              name="userName"
              value={formState.userName}
              onChange={changeHandler}
              required
            />
            <div className="invalid-feedback">Please choose a username.</div>
          </div>
        </div>
      </div>
      <div className="row mx-3 border-top border-dark mt-3">
        <div className="col mt-3">
          <label htmlFor="validationCustom03" className="h5">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="validationCustom03"
            placeholder="example@aol.com"
            name="email"
            value={formState.email}
            onChange={changeHandler}
            required
          />
          <div className="invalid-feedback">Please provide a valid email.</div>
        </div>
        <div className="col mt-3">
          <label htmlFor="validationCustom04" className="h5">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="validationCustom04"
            name="password"
            value={formState.password}
            onChange={changeHandler}
            required
          />
          <div className="invalid-feedback">
            Please provide a valid password.
          </div>
        </div>
        <div className="col mt-3">
          <div className="form-check form-switch mt-4">
            <label className="form-check-label h5 col" htmlFor="adminCheck">
              Admin user?
            </label>

            <input
              className="form-check-input mt-2"
              type="checkbox"
              id="adminCheck"
              name="isAdmin"
              onChange={onChangeCheckbox}
            />
            <div className="col">
              <strong>{formState.isAdmin ? 'Yes' : 'No'}</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center my-3">
        <button className="btn " type="submit">
          Register
        </button>
      </div>
    </form>
  );
}

export function EditUserForm({
  onChangeCheckbox, formState, deleteBtn,
}) {
  EditUserForm.propTypes = {
    onChangeCheckbox: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    formState: PropTypes.object.isRequired,
    deleteBtn: PropTypes.node.isRequired,
  };
  EditUserForm.defaultProps = {
    onChangeCheckbox: () => undefined,
  };
  const user = useContext(UserContext);
  const history = useHistory();
  const disabledButtons = formState.userName === 'admin' || formState.userName === user.userName;
  const buttonStyle = formState.userName === 'admin' ? 'btn text-muted disabled' : 'btn';
  const [loading, setLoading] = React.useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      userName, isAdmin, modelPermission, instrumentPermission, calibrationPermission,
    } = formState;
    Query({
      query: gql`
           mutation ChangePermissions(
            $userName: String!, 
            $isAdmin: Boolean!, 
            $instrumentPermission: Boolean!
            $modelPermission: Boolean!
            $calibrationPermission: Boolean!
            ) {
             editPermissions(userName: $userName, isAdmin: $isAdmin, modelPermission: $modelPermission, instrumentPermission: $instrumentPermission, calibrationPermission: $calibrationPermission)
           }
         `,
      queryName: 'editPermissions',
      getVariables: () => ({
        userName,
        isAdmin,
        modelPermission,
        instrumentPermission,
        calibrationPermission,
      }),
      handleResponse: (response) => {
        setLoading(false);
        if (response.success) {
          toast.success('Successfully updated permissions');
          const { state } = history.location;
          history.replace(
            `/viewUser/?userName=${userName}`,
            state,
          );
        } else {
          toast.error(response.message);
        }
      },
    });
  };
  return (
    <form className="needs-validation" noValidate onSubmit={onSubmit}>
      <div className="mx-3 py-1">
        <div className="row mt-3">
          <div className="col">
            <label htmlFor="validationCustomUsername" className="h5">
              Username
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroupPrepend">
                  @
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="validationCustomUsername"
                aria-describedby="inputGroupPrepend"
                name="userName"
                value={formState.userName}
                disabled
              />
            </div>
          </div>
          <div className="col-auto me-auto mt-4">
            {deleteBtn}
          </div>
        </div>
        <div className="d-flex flex-row mx-auto">
          <div className="d-flex flex-column mx-auto">
            <div className="form-check form-switch mt-3">
              <label className="form-check-label h5" htmlFor="adminCheck">
                Admin user?
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="adminCheck"
                name="isAdmin"
                checked={formState.isAdmin}
                onChange={onChangeCheckbox}
                disabled={disabledButtons}
              />
              <div className="">
                <strong>{formState.isAdmin ? 'Yes' : 'No'}</strong>
              </div>
            </div>
            <div className="form-check form-switch mt-3">
              <label
                className="form-check-label h5"
                htmlFor="modelPermissionCheck"
              >
                Model Permissions?
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="modelPermissionCheck"
                name="modelPermission"
                checked={formState.modelPermission}
                onChange={onChangeCheckbox}
                disabled={disabledButtons}
              />
              <div className="">
                <strong>{formState.modelPermission ? 'Yes' : 'No'}</strong>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column mx-auto">
            <div className="form-check form-switch mt-3">
              <label
                className="form-check-label h5"
                htmlFor="instrumentPermissionCheck"
              >
                Instrument Permissions?
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="instrumentPermissionCheck"
                name="instrumentPermission"
                checked={formState.instrumentPermission}
                onChange={onChangeCheckbox}
                disabled={disabledButtons}
              />
              <div className="">
                <strong>{formState.instrumentPermission ? 'Yes' : 'No'}</strong>
              </div>
            </div>
            <div className="form-check form-switch mt-3">
              <label
                className="form-check-label h5"
                htmlFor="calibrationPermissionCheck"
              >
                Calibration Permissions?
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="calibrationPermissionCheck"
                name="calibrationPermission"
                checked={formState.calibrationPermission}
                onChange={onChangeCheckbox}
                disabled={disabledButtons}
              />
              <div className="">
                <strong>
                  {formState.calibrationPermission ? 'Yes' : 'No'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center py-3">
        {loading ? (
          <CircularProgress />
        ) : (
          <button
            className={buttonStyle}
            type="submit"
            disabled={disabledButtons}
          >
            Save Changes
          </button>
        )}
        {/* <button
          className="btn btn-danger"
          type="button"
          onClick={onDeleteClick}
          disabled={disabledButtons}
        >
          Delete User
        </button> */}
      </div>
    </form>
  );
}
