import React from 'react';
import { Link } from 'react-router-dom';

export default function ImportTemplates() {
  return (
    <>
      <Link to="/files/import_documentation.pdf" target="_blank" className="btn btn-primary m-2">Import Documentation</Link>
      <Link to="/files/models.csv" target="_blank" download className="btn btn-warning m-2">Download Models Template</Link>
      <Link to="/files/instruments.csv" target="_blank" download className="btn btn-warning m-2">Download Instruments Template</Link>
    </>
  );
}
