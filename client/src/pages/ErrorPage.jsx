import React from 'react';
import PropTypes from 'prop-types';

function ErrorPage({ message }) {
  ErrorPage.propTypes = {
    message: PropTypes.string.isRequired,
  };

  return (
    <div className="d-flex justify-content-center">
      <h1 className="display-4 mt-5">
        <strong>{message}</strong>
      </h1>
    </div>
  );
}

export default ErrorPage;
