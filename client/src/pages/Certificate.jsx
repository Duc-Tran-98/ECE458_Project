import React from 'react';
import {
  // eslint-disable-next-line no-unused-vars
  PDFViewer, Document, Page, Text, Image, View, StyleSheet, Link,
} from '@react-pdf/renderer';
import GetCalibHistory from '../queries/GetCalibHistory';

const strftime = require('strftime');

// Create styles
const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    height: '700px',
    border: 'none',
  },
  page: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    orientation: 'portrait',
    padding: 10,
    border: '10pt solid #ff0000',
  },
  centerView: {
    alignItems: 'center',
  },
  logo: {
    height: '100',
    width: 'auto',
  },
  title: {
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
    fontSize: 28,
    textAlign: 'center',
  },
  largeText: {
    fontFamily: 'Times-Roman',
    fontSize: 16,
    textAlign: 'left',
  },
  smallText: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
    textAlign: 'left',
  },
  columnView: {
    flexDirection: 'row',
  },
  leftColumn: {
    flexGrow: 1,
    maxWidth: '50%',
    paddingLeft: 15,
  },
  rightColumn: {
    flexGrow: 1,
    maxWidth: '50%',
    paddingRight: 15,
  },
  innerBorder: {
    border: '25pt solid white',
    height: '100%',
  },
  outerBorder: {
    border: '5pt solid black',
  },
  image: {
    width: '70%',
    height: 'auto',
  },
  table: {
    display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0,
  },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: {
    width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0,
  },
  tableCell: { margin: 'auto', marginTop: 5, fontSize: 10 },
});

// Create Document Component
function MyCertificate() {
  const names = window.sessionStorage.getItem('calibUser');
  const regex = /(Username:\s)([^,]+)(,\sFirst\sname:\s)([^,]+)(,\sLast\sname:\s)(.*)/g;
  const matches = regex.exec(names);

  const name = `${matches[4]} ${matches[6]}`;
  const username = matches[2];
  const vendor = window.sessionStorage.getItem('vendor');
  const serial = window.sessionStorage.getItem('serialNumber');
  const assetTag = window.sessionStorage.getItem('assetTag');
  const model = window.sessionStorage.getItem('modelNumber');
  const description = window.sessionStorage.getItem('modelDescription');
  const calibrationDate = window.sessionStorage.getItem('calibrationDate');
  const expirationDate = strftime('%F', new Date(window.sessionStorage.getItem('expirationDate')));
  const comment = window.sessionStorage.getItem('calibComment');
  let id = window.sessionStorage.getItem('id');
  id = parseInt(id, 10);

  function getURLExtension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }

  const [calibEvent, setCalibEvent] = React.useState(null);
  // eslint-disable-next-line no-unused-vars
  const [fetched, setHasFetched] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    (() => {
      if (active) {
        GetCalibHistory({ id, mostRecent: true }).then((data) => {
          setCalibEvent(data);
          console.log(data);
          setHasFetched(true);
        });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  console.log(calibEvent);

  const urlPath = process.env.NODE_ENV.includes('dev')
    ? `http://localhost:3000/data/${calibEvent?.fileLocation}`
    : `https://hpt.hopto.org/data/${calibEvent?.fileLocation}`;
  const evidenceFile = calibEvent ? urlPath : '';
  const evidenceFileType = calibEvent ? getURLExtension(evidenceFile) : '';

  console.log(evidenceFileType);
  console.log(evidenceFile);

  // eslint-disable-next-line no-unused-vars
  const displayLink = (((evidenceFileType === 'pdf') || (evidenceFileType === 'xlsx'))) ? (
    <Text style={styles.largeText}>
      {'\n'}
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
      <Link src={evidenceFile}> View Evidence </Link>
      {/* <a href={`/data/${calibEvent?.fileLocation}`} rel="noreferrer" target="_blank">link title</a> */}
      {'\n'}
    </Text>
  ) : (null);

  console.log(displayLink);

  // eslint-disable-next-line no-unused-vars
  const displayImage = ((evidenceFileType === 'jpg') || (evidenceFileType === 'png') || (evidenceFileType === 'gif')) ? (
    <View style={styles.centerView}>
      <Image style={styles.image} src={evidenceFile} />
    </View>
  ) : (null);

  console.log(displayImage);

  return (
    <Document>
      <Page style={styles.page} size="LETTER">
        <>
          {fetched && (

          <View style={styles.outerBorder}>
            <View style={styles.innerBorder}>

              <View style={styles.centerView}>
                <Image style={styles.logo} src="HPT_logo.png" />
              </View>

              <Text style={styles.title}>
                Certificate of Calibration
                {'\n\n'}
              </Text>

              <View style={styles.columnView}>
                <View style={styles.rightColumn}>
                  <Text style={styles.largeText}>
                    Vendor:
                    {' '}
                    {vendor}
                  </Text>
                  <Text style={styles.largeText}>
                    Model Number:
                    {' '}
                    {model}
                  </Text>
                </View>
                <View style={styles.leftColumn}>
                  <Text style={styles.largeText}>
                    Serial Number:
                    {' '}
                    {serial}
                  </Text>
                  <Text style={styles.largeText}>
                    Asset Tag:
                    {' '}
                    {assetTag}
                  </Text>
                </View>
              </View>

              <Text style={styles.largeText}>
                {'\n'}
                Model Description:
              </Text>
              <Text style={styles.smallText}>
                {description}
              </Text>

              <Text style={styles.largeText}>
                {'\n'}
                Comment:
              </Text>
              <Text style={styles.smallText}>
                {comment}
              </Text>

              <View style={styles.columnView}>
                <View style={styles.rightColumn}>
                  <Text style={styles.largeText}>
                    {'\n'}
                    Calibrated By:
                    {' '}
                    {name}
                  </Text>
                  <Text style={styles.largeText}>
                    Username:
                    {' '}
                    {username}
                  </Text>
                </View>

                <View style={styles.leftColumn}>
                  <Text style={styles.largeText}>
                    {'\n'}
                    Date of Calibration:
                    {' '}
                    {calibrationDate}
                  </Text>
                  <Text style={styles.largeText}>
                    Date of Expiration:
                    {' '}
                    {expirationDate}
                  </Text>
                </View>
              </View>

              {displayLink}
              {displayImage}

              {(evidenceFileType === 'load_bank') && (
              <View style={styles.table}>
                {' '}
                {/* TableHeader */}
                {' '}
                <View style={styles.tableRow}>
                  {' '}
                  <View style={styles.tableCol}>
                    {' '}
                    <Text style={styles.tableCell}>Product</Text>
                    {' '}
                  </View>
                  {' '}
                  <View style={styles.tableCol}>
                    {' '}
                    <Text style={styles.tableCell}>Type</Text>
                    {' '}
                  </View>
                  {' '}
                  <View style={styles.tableCol}>
                    {' '}
                    <Text style={styles.tableCell}>Period</Text>
                    {' '}
                  </View>
                  {' '}
                  <View style={styles.tableCol}>
                    {' '}
                    <Text style={styles.tableCell}>Price</Text>
                    {' '}
                  </View>
                  {' '}
                </View>
                {' '}
                {/* TableContent */}
                {' '}
                <View style={styles.tableRow}>
                  {' '}
                  <View style={styles.tableCol}>
                    {' '}
                    <Text style={styles.tableCell}>React-PDF</Text>
                    {' '}
                  </View>
                  {' '}
                  <View style={styles.tableCol}>
                    {' '}
                    <Text style={styles.tableCell}>3 User </Text>
                    {' '}
                  </View>
                  {' '}
                  <View style={styles.tableCol}>
                    {' '}
                    <Text style={styles.tableCell}>2019-02-20 - 2020-02-19</Text>
                    {' '}
                  </View>
                  {' '}
                  <View style={styles.tableCol}>
                    {' '}
                    <Text style={styles.tableCell}>5€</Text>
                    {' '}
                  </View>
                  {' '}
                </View>
                {' '}
              </View>
              )}
            </View>
          </View>
          )}

        </>
      </Page>

    </Document>

  );
}

function Certificate() {
  return (
    <div>
      <PDFViewer style={styles.viewer}>
        <MyCertificate />
      </PDFViewer>
    </div>
  );
}

export default Certificate;
