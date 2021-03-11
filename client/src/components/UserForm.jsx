import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import { useHistory } from 'react-router-dom';
import Query from './UseQuery';

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
          <label htmlFor="validationCustom01" className="h4">
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
          <label htmlFor="validationCustom02" className="h4">
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
          <label htmlFor="validationCustomUsername" className="h4">
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
          <label htmlFor="validationCustom03" className="h4">
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
          <label htmlFor="validationCustom04" className="h4">
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
            <label className="form-check-label h4 col" htmlFor="adminCheck">
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
  onChangeCheckbox, formState, onDeleteClick,
}) {
  EditUserForm.propTypes = {
    onChangeCheckbox: PropTypes.func,
    onDeleteClick: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    formState: PropTypes.object.isRequired,
  };
  EditUserForm.defaultProps = {
    onChangeCheckbox: () => undefined,
    onDeleteClick: () => undefined,
  };
  const history = useHistory();
  const buttonStyle = formState.userName === 'admin' ? 'btn text-muted disabled' : 'btn';
  const [loading, setLoading] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState('Save Changes');
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    Query({
      query: print(gql`
           mutation ChangePermissions($userName: String!, $isAdmin: Boolean!) {
             editPermissions(userName: $userName, isAdmin: $isAdmin)
           }
         `),
      queryName: 'editPermissions',
      getVariables: () => ({
        userName: formState.userName,
        isAdmin: formState.isAdmin,
      }),
      handleResponse: (response) => {
        setLoading(false);
        setResponseMsg(response.message);
        if (response.success) {
          const { state } = history.location;
          history.replace(
            `/viewUser/?userName=${formState.userName}&isAdmin=${
              formState.isAdmin
            }`, state,
          );
          setTimeout(() => {
            setResponseMsg('Save Changes');
          }, 1000);
        }
      },
    });
  };
  return (
    <form className="needs-validation" noValidate onSubmit={onSubmit}>
      <div className="row mx-3">
        <div className="col mt-3">
          <label htmlFor="validationCustomUsername" className="h4">
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
            <div className="invalid-feedback">Please choose a username.</div>
          </div>
        </div>
        <div className="col mt-3">
          <div className="form-check form-switch mt-4">
            <label className="form-check-label h4 col" htmlFor="adminCheck">
              Admin user?
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              id="adminCheck"
              name="isAdmin"
              checked={formState.isAdmin}
              onChange={onChangeCheckbox}
              disabled={formState.userName === 'admin'}
            />
            <div className="col">
              <strong>{formState.isAdmin ? 'Yes' : 'No'}</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center my-3">
        {loading ? (
          <CircularProgress />
        ) : (
          <button className={buttonStyle} type="submit">
            {responseMsg}
          </button>
        )}

        <span className="mx-2" />
        <button className={formState.userName === 'admin' ? 'btn text-muted disabled' : 'btn btn-danger'} type="button" onClick={onDeleteClick}>
          Delete User
        </button>
      </div>
    </form>
  );
}
