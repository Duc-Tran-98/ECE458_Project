import React from 'react';

import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';
import ImpModels from '../components/ImpModels';
import ImpInstruments from '../components/ImpInstruments';
import ImportTemplates from '../components/ImportTemplates';

export default function BulkImport({ modifyCount }) {
  BulkImport.propTypes = {
    modifyCount: PropTypes.func.isRequired,
  };

  return (
    <div className="text-center mx-3 my-3">
      <ToastContainer />
      <div className="m-2 h1">Welcome to the Import Page!</div>
      <div className="m-2 h4">
        Here are some helpful downloads to get you started:
      </div>
      <p className="m-2">
        Please upload files one at a time adhering to the templates provided
        below.
      </p>
      <ImportTemplates />
      <ImpModels modifyCount={modifyCount} />
      <ImpInstruments modifyCount={modifyCount} />
    </div>
  );
}
