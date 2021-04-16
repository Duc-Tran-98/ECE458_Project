/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
// import {
//   PDFViewer, Document, Page, Text, Image, View, StyleSheet, Link,
// } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
// import { Document, Page } from 'react-pdf';
import { Document, Page, pdfjs } from 'react-pdf';
// import { ReactPDF } from 'react-pdf';
// import { ReactPDF, StyleSheet } from '@react-pdf/renderer';
import GetUser from '../queries/GetUser';
import GetCalibHistory from '../queries/GetCalibHistory';
import { idealCurrents } from '../utils/LoadBank';
import FindInstrument from '../queries/FindInstrument';
import { stepInfo } from '../utils/Klufe';
import ExpressQuery from '../queries/ExpressQuery';

// const strftime = require('strftime');

// // Create styles
// const styles = StyleSheet.create({
//   viewer: {
//     width: '100%',
//     height: '700px',
//     border: 'none',
//   },
//   page: {
//     backgroundColor: '#fff',
//     width: '100%',
//     height: '100%',
//     orientation: 'portrait',
//     padding: 10,
//     border: '10pt solid #ff0000',
//   },
//   centerView: {
//     alignItems: 'center',
//   },
//   logo: {
//     height: '100',
//     width: 'auto',
//   },
//   title: {
//     fontFamily: 'Times-Roman',
//     fontStyle: 'italic',
//     fontSize: 28,
//     textAlign: 'center',
//   },
//   largeText: {
//     fontFamily: 'Times-Roman',
//     fontSize: 16,
//     textAlign: 'left',
//   },
//   smallText: {
//     fontFamily: 'Times-Roman',
//     fontSize: 12,
//     textAlign: 'left',
//   },
//   columnView: {
//     flexDirection: 'row',
//   },
//   leftColumn: {
//     flexGrow: 1,
//     maxWidth: '50%',
//     paddingLeft: 15,
//   },
//   rightColumn: {
//     flexGrow: 1,
//     maxWidth: '50%',
//     paddingRight: 15,
//   },
//   innerBorder: {
//     border: '25pt solid white',
//     height: '100%',
//   },
//   outerBorder: {
//     border: '5pt solid black',
//   },
//   image: {
//     padding: 20,
//     width: '70%',
//     height: 'auto',
//   },
//   table: {
//     display: 'table',
//     width: 'auto',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderRightWidth: 0,
//     borderBottomWidth: 0,
//   },
//   tableRow: {
//     margin: 'auto',
//     flexDirection: 'row',
//   },
//   tableCell: {
//     margin: 'auto',
//     marginTop: 5,
//     fontSize: 8,
//   },
//   lbTableCol: {
//     width: '12.5%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//   },
//   klufeTableCol: {
//     width: '25%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//   },
// });

// // Create Document Component
// function MyCertificate({
//   calibEvent,
//   modelNumber,
//   vendor,
//   assetTag,
//   description,
//   serialNumber,
//   calibFrequency,
//   calibUser,
// }) {
//   MyCertificate.propTypes = {
//     // eslint-disable-next-line react/forbid-prop-types
//     calibEvent: PropTypes.object.isRequired,
//     modelNumber: PropTypes.string.isRequired,
//     vendor: PropTypes.string.isRequired,
//     serialNumber: PropTypes.string.isRequired,
//     calibUser: PropTypes.string.isRequired,
//     calibFrequency: PropTypes.number.isRequired,
//     assetTag: PropTypes.number.isRequired,
//     description: PropTypes.string.isRequired,
//   };
//   const names = calibUser;
//   const regex = /(Username:\s)([^,]+)(,\sFirst\sname:\s)([^,]+)(,\sLast\sname:\s)(.*)/g;
//   const matches = regex.exec(names);

//   const name = `${matches[4]} ${matches[6]}`;
//   const username = matches[2];
//   const calibrationDate = calibEvent.date;
//   const expirationDate = strftime(
//     '%F',
//     new Date(new Date(calibEvent.date).addDays(calibFrequency)),
//   );
//   const { comment } = calibEvent;

//   function getURLExtension(url) {
//     return url.split(/[#?]/)[0].split('.').pop().trim();
//   }

//   const urlPath = process.env.NODE_ENV.includes('dev')
//     ? `http://localhost:3000/data/${calibEvent?.fileLocation}`
//     : `https://hpt.hopto.org/data/${calibEvent?.fileLocation}`;
//   const evidenceFile = calibEvent ? urlPath : '';
//   const evidenceFileType = calibEvent ? getURLExtension(evidenceFile) : '';
//   const loadBankData = calibEvent?.loadBankData;
//   const klufeData = calibEvent?.klufeData;
//   const loadBankJSON = loadBankData ? JSON.parse(loadBankData) : (null);
//   const klufeJSON = klufeData ? JSON.parse(klufeData) : (null);

//   const displayLink = (((evidenceFileType === 'pdf') || (evidenceFileType === 'xlsx') || (evidenceFileType === 'gif'))) ? (
//     <Text style={styles.largeText}>
//       {'\n'}
//       {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
//       <Link src={evidenceFile}> View Evidence </Link>
//       {'\n'}
//     </Text>
//   ) : (null);

//   const displayImage = ((evidenceFileType === 'jpeg') || (evidenceFileType === 'jpg') || (evidenceFileType === 'png')) ? (
//     <View style={styles.centerView}>
//       <Image style={styles.image} src={evidenceFile} />
//     </View>
//   ) : (null);

//   // eslint-disable-next-line max-len
//   const loadLevels = ['No Load', '1 x 100A', '2 x 100A', '3 x 100A', '4 x 100A', '5 x 100A', '6 x 100A', '7 x 100A', '8 x 100A', '9 x 100A', '10 x 100A', '10 x 100A + 1 x 20A', '10 x 100A + 2 x 20A', '10 x 100A + 3 x 20A', '10 x 100A + 4 x 20A', '10 x 100A + 5 x 20A', '10 x 100A + 5 x 20A + 1 x 1A', '10 x 100A + 5 x 20A + 2 x 1A', '10 x 100A + 5 x 20A + 3 x 1A', '10 x 100A + 5 x 20A + 4 x 1A', '10 x 100A + 5 x 20A + 5 x 1A', '10 x 100A + 5 x 20A + 6 x 1A', '10 x 100A + 5 x 20A + 7 x 1A', '10 x 100A + 5 x 20A + 8 x 1A', '10 x 100A + 5 x 20A + 9 x 1A', '10 x 100A + 5 x 20A + 10 x 1A', '10 x 100A + 5 x 20A + 11 x 1A', '10 x 100A + 5 x 20A + 12 x 1A', '10 x 100A + 5 x 20A + 13 x 1A', '10 x 100A + 5 x 20A + 14 x 1A', '10 x 100A + 5 x 20A + 15 x 1A', '10 x 100A + 5 x 20A + 16 x 1A', '10 x 100A + 5 x 20A + 17 x 1A', '10 x 100A + 5 x 20A + 18 x 1A', '10 x 100A + 5 x 20A + 19 x 1A', '10 x 100A + 5 x 20A + 20 x 1A'];

//   const lbRow = (p, i) => (
//     <View style={styles.tableRow}>
//       <View style={styles.lbTableCol}>
//         <Text style={styles.tableCell}>{loadLevels[i]}</Text>
//       </View>
//       <View style={styles.lbTableCol}>
//         <Text style={styles.tableCell}>{p.currentReadings[i].cr}</Text>
//       </View>
//       <View style={styles.lbTableCol}>
//         <Text style={styles.tableCell}>{p.currentReadings[i].ca}</Text>
//       </View>
//       <View style={styles.lbTableCol}>
//         <Text style={styles.tableCell}>{idealCurrents[i]}</Text>
//       </View>
//       <View style={styles.lbTableCol}>
//         <Text style={styles.tableCell}>{Number(p.currentReadings[i].crError).toFixed(5)}</Text>
//       </View>
//       <View style={styles.lbTableCol}>
//         <Text style={styles.tableCell}>{p.currentReadings[i].crOk ? 'OK' : 'NOT OK'}</Text>
//       </View>
//       <View style={styles.lbTableCol}>
//         {/* eslint-disable-next-line no-useless-escape */}
//         <Text style={styles.tableCell}>{Number(p.currentReadings[i].caError).toFixed(5)}</Text>
//       </View>
//       <View style={styles.lbTableCol}>
//         <Text style={styles.tableCell}>{p.currentReadings[i].caOk ? 'OK' : 'NOT OK'}</Text>
//       </View>
//     </View>
//   );

//   function fillTable() {
//     const infoList = [];
//     for (let i = 0; i < 36; i += 1) {
//       for (let j = 0; j < 36; j += 1) {
//         if (i === loadBankJSON.currentReadings[j].id) {
//           infoList.push(lbRow(loadBankJSON, i));
//           break;
//         }
//       }
//     }

//     return infoList;
//   }

//   const displayLoadBank = (loadBankData) ? (
//     <View style={styles.table}>
//       <View style={styles.tableRow}>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>Load Level</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>Current Reported [A]</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>Current Actual [A]</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>Ideal Current [A]</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>CR Error [%]</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>CR ok?</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>CA Error [%]</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>CA ok?</Text>
//         </View>
//       </View>
//       {fillTable()}
//     </View>
//   ) : (null);

//   const klufeRow = (step) => (
//     <View style={styles.tableRow}>
//       <View style={styles.klufeTableCol}>
//         <Text style={styles.tableCell}>{stepInfo[step].source}</Text>
//       </View>
//       <View style={styles.klufeTableCol}>
//         <Text style={styles.tableCell}>{stepInfo[step].range}</Text>
//       </View>
//       <View style={styles.klufeTableCol}>
//         <Text style={styles.tableCell}>{klufeJSON.readings[step]}</Text>
//       </View>
//       <View style={styles.klufeTableCol}>
//         <Text style={styles.tableCell}>OK</Text>
//       </View>
//     </View>
//   );

//   const displayKlufe = (klufeData) ? (
//     <View style={styles.table}>
//       <View style={styles.tableRow}>
//         <View style={styles.klufeTableCol}>
//           <Text style={styles.tableCell}>Source</Text>
//         </View>
//         <View style={styles.klufeTableCol}>
//           <Text style={styles.tableCell}>Acceptable Range [V]</Text>
//         </View>
//         <View style={styles.klufeTableCol}>
//           <Text style={styles.tableCell}>Actual Value [V]</Text>
//         </View>
//         <View style={styles.klufeTableCol}>
//           <Text style={styles.tableCell}>OK?</Text>
//         </View>
//       </View>
//       {klufeRow(4)}
//       {klufeRow(7)}
//       {klufeRow(9)}
//       {klufeRow(11)}
//       {klufeRow(13)}
//     </View>
//   ) : (null);

//   const displayLoadBankVoltage = (loadBankData) ? (
//     <View style={styles.table}>
//       <View style={styles.tableRow}>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell} />
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>Voltage Reported [V]</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>Voltage Actual [V]</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>Test Voltage [V]</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>VR Error [%]</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>VR ok?</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>VA Error [%]</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>VA ok?</Text>
//         </View>
//       </View>

//       <View style={styles.tableRow}>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>Voltages with all blanks on:</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>{loadBankJSON.voltageReading.vr}</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>{loadBankJSON.voltageReading.va}</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>48</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>{Number(loadBankJSON.voltageReading.vrError).toFixed(5)}</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>{loadBankJSON.voltageReading.vrOk ? 'OK' : 'NOT OK'}</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>{Number(loadBankJSON.voltageReading.vaError).toFixed(5)}</Text>
//         </View>
//         <View style={styles.lbTableCol}>
//           <Text style={styles.tableCell}>{loadBankJSON.voltageReading.vaOk ? 'OK' : 'NOT OK'}</Text>
//         </View>
//       </View>

//     </View>
//   ) : (null);

//   return (
//     <Document>
//       <Page style={styles.page} size="LETTER">
//         <View style={styles.outerBorder}>
//           <View style={styles.innerBorder}>
//             <View style={styles.centerView}>
//               <Image style={styles.logo} src="/HPT_logo.png" />
//             </View>

//             <Text style={styles.title}>
//               Certificate of Calibration
//               {'\n\n'}
//             </Text>

//             <View style={styles.columnView}>
//               <View style={styles.rightColumn}>
//                 <Text style={styles.largeText}>
//                   Vendor:
//                   {' '}
//                   {vendor}
//                 </Text>
//                 <Text style={styles.largeText}>
//                   Model Number:
//                   {' '}
//                   {modelNumber}
//                 </Text>
//               </View>
//               <View style={styles.leftColumn}>
//                 <Text style={styles.largeText}>
//                   Serial Number:
//                   {' '}
//                   {serialNumber}
//                 </Text>
//                 <Text style={styles.largeText}>
//                   Asset Tag:
//                   {' '}
//                   {assetTag}
//                 </Text>
//               </View>
//             </View>

//             <Text style={styles.largeText}>
//               {'\n'}
//               Model Description:
//             </Text>
//             <Text style={styles.smallText}>{description}</Text>

//             <Text style={styles.largeText}>
//               {'\n'}
//               Comment:
//             </Text>
//             <Text style={styles.smallText}>{comment}</Text>

//             <View style={styles.columnView}>
//               <View style={styles.rightColumn}>
//                 <Text style={styles.largeText}>
//                   {'\n'}
//                   Calibrated By:
//                   {' '}
//                   {name}
//                 </Text>
//                 <Text style={styles.largeText}>
//                   Username:
//                   {' '}
//                   {username}
//                 </Text>
//               </View>

//               <View style={styles.leftColumn}>
//                 <Text style={styles.largeText}>
//                   {'\n'}
//                   Date of Calibration:
//                   {' '}
//                   {calibrationDate}
//                 </Text>
//                 <Text style={styles.largeText}>
//                   Date of Expiration:
//                   {' '}
//                   {expirationDate}
//                 </Text>
//               </View>
//             </View>

//             {displayLink}
//             {displayImage}

//           </View>
//         </View>
//       </Page>
//       {(loadBankData) && (
//         <>
//           <Page style={styles.page}>
//             {displayLoadBank}
//           </Page>
//           <Page style={styles.page}>
//             {displayLoadBankVoltage}
//           </Page>
//         </>
//       )}
//       {(klufeData) && (
//         <>
//           <Page style={styles.page}>
//             {displayKlufe}
//           </Page>
//         </>
//       )}
//     </Document>
//   );
// }

// // function Certificate() {
// //   const [calibEvent, setCalibEvent] = React.useState(null);
// //   // eslint-disable-next-line no-unused-vars
// //   const [fetched, setHasFetched] = React.useState(false);
// //   const urlParams = new URLSearchParams(window.location.search);
// //   const modelNumber = urlParams.get('modelNumber');
// //   const vendor = urlParams.get('vendor');
// //   let assetTag = urlParams.get('assetTag');
// //   assetTag = parseInt(assetTag, 10);
// //   const [calibUser, setCalibUser] = React.useState('');
// //   const [serialNumber, setSerialNumber] = React.useState('');
// //   const [calibFrequency, setCalibFrequency] = React.useState(0);
// //   const [description, setDescription] = React.useState('');

// //   React.useEffect(() => {
// //     let active = true;
// //     (async () => {
// //       if (active) {
// //         FindInstrument({
// //           assetTag,
// //           handleResponse: (response) => {
// //             setSerialNumber(response.serialNumber);
// //             setDescription(response.description);
// //             setCalibFrequency(response.calibrationFrequency);
// //             let { id } = response;
// //             if (typeof id === 'string') {
// //               id = parseInt(id, 10);
// //             }
// //             GetCalibHistory({
// //               id,
// //               mostRecent: true,
// //             })
// //               .then((data) => {
// //                 setCalibEvent(data);
// //                 return data;
// //               })
// //               .then((data) => {
// //                 GetUser({ userName: data.user }).then((value) => {
// //                   if (value) {
// //                     setCalibUser(
// //                       `Username: ${data.user}, First name: ${value.firstName}, Last name: ${value.lastName}`,
// //                     );
// //                   }
// //                   setHasFetched(true);
// //                 });
// //               });
// //           },
// //         });
// //       }
// //     })();
// //     return () => {
// //       active = false;
// //     };
// //   }, []);
// //   return (
// //     <div>
// //       {fetched && (
// //         <PDFViewer style={styles.viewer}>
// //           <MyCertificate
// //             calibEvent={calibEvent}
// //             modelNumber={modelNumber}
// //             calibUser={calibUser}
// //             serialNumber={serialNumber}
// //             description={description}
// //             vendor={vendor}
// //             assetTag={assetTag}
// //             calibFrequency={calibFrequency}
// //           />
// //         </PDFViewer>
// //       )}
// //     </div>
// //   );
// // }

function newCertificate() {
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
  const chainOfTruth = true;
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
      {/* <div className="main">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          noData="Generating PDF..."
        >
          {
              Array.from(
                new Array(numPages),
                (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width="100%"
                  />
                ),
              )
            }
        </Document>
      </div> */}
    </div>
  );
}

export default newCertificate;
