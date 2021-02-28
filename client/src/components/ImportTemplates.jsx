import React from 'react';
import { Link } from 'react-router-dom';

export default function ImportTemplates() {
  return (
    <div className="row mx-1 my-3">
      <Link to="/files/import_documentation.pdf" target="_blank" className="btn  m-2 col">Import Documentation</Link>
      <Link to="/files/models.csv" target="_blank" download className="btn  m-2 col">Download Models Template</Link>
      <Link to="/files/instruments.csv" target="_blank" download className="btn  m-2 col">Download Instruments Template</Link>
    </div>
  );
}
