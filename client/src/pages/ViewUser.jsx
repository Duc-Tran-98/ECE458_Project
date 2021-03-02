/* eslint-disable no-nested-ternary */
import React from 'react';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { EditUserForm } from '../components/UserForm';
import ModalAlert from '../components/ModalAlert';
import Query from '../components/UseQuery';
import 'react-toastify/dist/ReactToastify.css';
import '../css/customToast.css';

export default function ViewUser({ onDelete }) {
  ViewUser.propTypes = {
    onDelete: PropTypes.func.isRequired,
  };
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [formState, setFormState] = React.useState({
    userName: urlParams.get('userName'),
    isAdmin: urlParams.get('isAdmin') === 'true',
  });

  const onChangeCheckbox = (event) => {
    if (formState.userName !== 'admin') {
      setFormState({ ...formState, isAdmin: event.target.checked });
    }
  };
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState('');
  const closeModal = () => {
    setShow(false);
  };
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const handleResponse = (response) => {
    setLoading(false);
    setResponseMsg(response.message);
    if (response.success) {
      onDelete();
      setTimeout(() => {
        setResponseMsg('');
        if (show) {
          setShow(false);
        }
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

  const deleteUser = () => {
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
  };
  return (
    <>
      <ModalAlert show={show} handleClose={closeModal} title="DELETE USER">
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
                  <button className="btn " type="button" onClick={deleteUser}>
                    Yes
                  </button>
                </div>
                <span className="mx-3" />
                <div className="mt-3">
                  <button className="btn " type="button" onClick={closeModal}>
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      </ModalAlert>
      <EditUserForm
        formState={formState}
        onChangeCheckbox={onChangeCheckbox}
        onDeleteClick={() => setShow(true)}
      />
    </>
  );
}
