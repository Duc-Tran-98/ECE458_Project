/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { pdfjs } from 'react-pdf';
import ExpressQuery from '../queries/ExpressQuery';

export default function Certificate() {
  const [file, setFile] = React.useState();
  const [loaded, setLoaded] = React.useState(false);

  const handleResponse = async (response) => {
    const loading = document.getElementById('loadingText');
    const viewer = document.getElementById('pdfDisplay');

    if (loading && viewer) {
      loading.hidden = false;
      viewer.hidden = true;
    }

    console.log('this is the response: ', response);
    // create pdf from bytestream and download in browser
    const blob = new Blob([response.data], { type: 'application/pdf' });
    // const buf = await blob.arrayBuffer();
    const fUrl = URL.createObjectURL(blob);
    // console.log(buf);
    console.log(fUrl);
    setFile(fUrl);
    // window.open(fUrl);
    console.log(response.status);

    if (loading && viewer) {
      loading.hidden = true;
      viewer.hidden = false;
    }
  };

  // This code is getting params from url
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const assetTag = urlParams.get('assetTag');
  const chainOfTruth = urlParams.get('chainOfTruth');
  console.log(chainOfTruth);
  const calibrationQuery = async () => {
    const expressParam = `/api/certificate?assetTag=${assetTag}&chainOfTruth=${chainOfTruth}`;
    ExpressQuery({
      endpoint: expressParam, method: 'get', queryJSON: { }, handleResponse, responseType: 'arraybuffer',
    });
  };
  if (!loaded) {
    setLoaded(true);
    calibrationQuery();
  }

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  // eslint-disable-next-line no-shadow
  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (
    <div height="100%">
      <p id="loadingText">
        Generating Certificate...
      </p>
      <iframe id="pdfDisplay" title="Document" src={file} width="100%" height={window.innerHeight - 100} />
    </div>
  );
}
