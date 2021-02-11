import React from 'react';
// import BulkImport from '../components/BulkImport';
import ImportModels from '../components/ImportModels';
import ExportModels from '../components/ExportModels';

function ComponentTest() {
  return (
    <div>
      <div className="bg-light">
        <ImportModels />
      </div>
      <div className="bg-light">
        <ExportModels />
      </div>
    </div>

  );
}

export default ComponentTest;
