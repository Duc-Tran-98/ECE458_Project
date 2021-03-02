import React, { useState } from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import ImportModels from '../components/ImportModels';
import ImportInstruments from '../components/ImportInstruments';
import ImportTemplates from '../components/ImportTemplates';

export default function BulkImport() {
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingInstruments, setLoadingInstruments] = useState(false);

  return (
    <div className="text-center mx-3 my-3">
      <div className="m-2 h1">Welcome to the Import Page!</div>
      <div className="m-2 h4">
        Here are some helpful downloads to get you started:
      </div>
      <p className="m-2">
        TLDR: Upload files one at a time adhering to the templates provided
        below.
      </p>
      <ImportTemplates />
      {loadingModels && <LinearProgress color="secondary" />}
      <ImportModels setLoading={setLoadingModels} />
      {loadingInstruments && <LinearProgress color="secondary" />}
      <ImportInstruments setLoading={setLoadingInstruments} />
    </div>
  );
}
