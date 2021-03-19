import React from 'react';
import ImpModels from '../components/ImpModels';
import ImpInstruments from '../components/ImpInstruments';
import ImportTemplates from '../components/ImportTemplates';

export default function BulkImport() {
  return (
    <div className="text-center mx-3 my-3">
      <div className="m-2 h1">Welcome to the Import Page!</div>
      <div className="m-2 h5">
        Here are some helpful downloads to get you started:
      </div>
      <p className="m-2">
        Please upload files one at a time adhering to the templates provided
        below.
      </p>
      <ImportTemplates />
      <ImpModels />
      <ImpInstruments />
    </div>
  );
}
