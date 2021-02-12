import React from 'react';

import ImportModels from '../components/ImportModels';
import ImportInstruments from '../components/ImportInstruments';
import ImportTemplates from '../components/ImportTemplates';

export default function BulkImport() {
  return (
    <>
      <h1 className="m-2">Welcome to the Import Page!</h1>
      <h4 className="m-2">Here are some helpful downloads to get you started:</h4>
      <p className="m-2">TLDR: Upload files one at a time adhering to the templates provided below.</p>
      <ImportTemplates />
      <ImportModels />
      <ImportInstruments />
    </>
  );
}
