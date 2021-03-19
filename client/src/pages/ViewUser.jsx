/* eslint-disable no-nested-ternary */
import React from 'react';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { EditUserForm } from '../components/UserForm';
import Query from '../components/UseQuery';
import ModalAlert from '../components/ModalAlert';
import UserContext from '../components/UserContext';
import GetUser from '../queries/GetUser';

export default function ViewUser({ onDelete }) {
  ViewUser.propTypes = {
    onDelete: PropTypes.func.isRequired,
  };
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const user = React.useContext(UserContext);
  const [fetched, setFetched] = React.useState(false);
  const [formState, setFormState] = React.useState({
    userName: urlParams.get('userName'),
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
      GetUser({ userName: urlParams.get('userName'), includeAll: true }).then((response) => {
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
        setFormState({
          ...formState,
          modelPermission: event.target.checked,
          instrumentPermission: event.target.checked,
        });
      } else {
        setFormState({ ...formState, [event.target.name]: event.target.checked });
      }
    }
  };
  const [loading, setLoading] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState('');
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const handleResponse = (response) => {
    setLoading(false);
    setResponseMsg(response.message);
    if (response.success) {
      onDelete();
      setTimeout(() => {
        setResponseMsg('');
        if (history.location.state?.previousUrl) {
          let path = history.location.state.previousUrl.split(window.location.host)[1];
          if (path.includes('count')) {
            const count = parseInt(path.substring(path.indexOf('count')).split('count=')[1], 10) - 1;
            path = path.replace(path.substring(path.indexOf('count')), `count=${count}`);
          }
          history.replace( // This code updates the url to have the correct count
            path,
            null,
          );
        } else {
          history.replace('/', null);
        }
      }, 1000);
    }
  };
  const deleteBtn = (
    <ModalAlert
      title="Delete User"
      btnText="Delete User"
      btnClass={disabledButtons ? 'btn btn-danger disabled' : 'btn btn-danger'}
      altCloseBtnId="delete-user"
    >
      <>
        {responseMsg.length === 0 && (
          <div className="h4 text-center my-3">{`You are about to delete user ${formState.userName}. Are you sure?`}</div>
        )}
        <div className="d-flex justify-content-center">
          {loading ? (
            <CircularProgress />
          ) : responseMsg.length > 0 ? (
            <div className="mx-5 mt-3 h4">{responseMsg}</div>
          ) : (
            <>
              <div className="mt-3">
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    Query({
                      query: print(gql`
                        mutation DelUser($userName: String!) {
                          deleteUser(userName: $userName)
                        }
                      `),
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
                <button className="btn " type="button" id="delete-user">
                  No
                </button>
              </div>
            </>
          )}
        </div>
      </>
    </ModalAlert>
  );

  return (
    <>
      {fetched && (
        <EditUserForm
          formState={formState}
          onChangeCheckbox={onChangeCheckbox}
          deleteBtn={deleteBtn}
        />
      )}
    </>
  );
}
