/* eslint-disable no-nested-ternary */
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { EditUserForm } from '../components/UserForm';
import Query from '../components/UseQuery';
import UserContext from '../components/UserContext';
import GetUser from '../queries/GetUser';
import MouseOverPopover from '../components/PopOver';

export default function ViewUser({ userName, onDelete }) {
  ViewUser.propTypes = {
    userName: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
  };
  // const queryString = window.location.search;
  // const urlParams = new URLSearchParams(queryString);
  const user = React.useContext(UserContext);
  const [fetched, setFetched] = React.useState(false);
  const [formState, setFormState] = React.useState({
    userName,
    isAdmin: false,
    modelPermission: false,
    instrumentPermission: false,
    calibrationPermission: false,
  });
  const disabledButtons = formState.userName === 'admin' || formState.userName === user.userName;
  React.useEffect(() => {
    let active = true;
    (async () => {
      if (!active) {
        return;
      }
      GetUser({ userName, includeAll: true, fetchPolicy: 'no-cache' }).then((response) => {
        setFormState(response);
        setFetched(true);
      });
    })();
    return () => { active = false; };
  }, []);
  const onChangeCheckbox = (event) => {
    if (formState.userName !== 'admin') {
      if (event.target.name === 'isAdmin') { // isAdmin check changed
        setFormState({
          ...formState, modelPermission: event.target.checked, instrumentPermission: event.target.checked, calibrationPermission: event.target.checked, isAdmin: event.target.checked,
        });
      } else if (event.target.name === 'modelPermission') {
        const { instrumentPermission } = formState;
        setFormState({
          ...formState, // TODO: UNCHECK ADMIN STATUS IF CLICK OF ANYTHING WHILE ADMIN STATUS = TRUE
          modelPermission: event.target.checked,
          instrumentPermission: instrumentPermission || event.target.checked,
        });
      } else {
        setFormState({ ...formState, [event.target.name]: event.target.checked });
      }
    }
  };
  const [loading, setLoading] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState('');
  const [showDelete, setShowDelete] = React.useState(false);
  const handleResponse = (response) => {
    setLoading(false);
    setResponseMsg(response.message);
    if (response.success) {
      setTimeout(() => {
        setResponseMsg('');
        onDelete();
      }, 1000);
    }
  };
  const deleteBtn = (
    <MouseOverPopover message={disabledButtons ? `You cannot delete user ${formState.userName}` : `Delete ${formState.userName}`}>
      <IconButton onClick={() => {
        if (!disabledButtons) setShowDelete(true);
      }}
      >
        <DeleteIcon style={{ color: disabledButtons ? 'disabled' : '#fc2311', cursor: disabledButtons ? 'auto' : 'pointer' }} />
      </IconButton>
    </MouseOverPopover>
  );

  return (
    <>
      {fetched && !showDelete && (
        <EditUserForm
          formState={formState}
          onChangeCheckbox={onChangeCheckbox}
          deleteBtn={deleteBtn}
        />
      )}
      {showDelete && (
        <>
          {responseMsg.length === 0 && (
            <div className="h5 text-center my-3">{`You are about to delete user ${formState.userName}. Are you sure?`}</div>
          )}
          <div className="d-flex justify-content-center">
            {loading ? (
              <CircularProgress />
            ) : responseMsg.length > 0 ? (
              <div className="mx-5 mt-3 h5">{responseMsg}</div>
            ) : (
              <>
                <div className="mt-3">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      setLoading(true);
                      Query({
                        query: gql`
                          mutation DelUser($userName: String!) {
                            deleteUser(userName: $userName)
                          }
                        `,
                        queryName: 'deleteUser',
                        getVariables: () => ({ userName: formState.userName }),
                        handleResponse,
                      });
                    }}
                  >
                    Yes
                  </button>
                </div>
                <span className="mx-3" />
                <div className="mt-3">
                  <button
                    className="btn "
                    type="button"
                    id="close-delete-user-modal"
                    onClick={() => setShowDelete(false)}
                  >
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
