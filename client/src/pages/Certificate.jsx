import React from 'react';
import {
  PDFViewer, Page, Text, Image, View, Document, StyleSheet,
} from '@react-pdf/renderer';
// import { gql, useQuery } from '@apollo/client';

// Create styles
const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    height: '95%',
    position: 'absolute',
    border: 'none',
  },
  page: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    orientation: 'portrait',
    padding: 40,
  },
  logoView: {
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
    fontSize: 18,
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
  column: {
    flexGrow: 1,
  },
});

// const GET_INSTRUMENT_QUERY = gql`
//     query Instruments($modelNumber: String!, $vendor: String!, $serialNumber: String!){
//       getInstrument(modelNumber: $modelNumber, vendor: $vendor, serialNumber: $serialNumber){
//         modelNumber
//         vendor
//         serialNumber
//       }
//     }
//   `;

// Create Document Component
function MyDocument() {
//   console.log('before');
//   console.log(useQuery(GET_INSTRUMENT_QUERY, { variables: { modelNumber: '1', vendor: 'DUKE', serialNumber: '2' } }));
//   console.log('after');
//   const { loading, error, data } = useQuery(GET_INSTRUMENT_QUERY, { variables: { modelNumber: '1', vendor: 'DUKE', serialNumber: '2' } });
//   if (loading) return 'loading...';
//   if (error) return `Error! ${error.message}`;

  const vendor = 'vendor';
  const model = 'model';
  const serial = 'serial';
  const description = 'description';
  const comment = 'comment';
  const calibrationDate = 'date';
  const expirationDate = 'date';
  const name = 'name';
  const username = 'username';

  return (
    <Document>
      <Page style={styles.page} size="LETTER">
        <View style={styles.logoView}>
          <Image style={styles.logo} src="HPT_logo.png" />
        </View>

        <Text style={styles.title}>
          Certificate of Calibration
          {'\n\n'}
        </Text>
        <View style={styles.columnView}>
          <View style={styles.column}>
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
          <View style={styles.column}>
            <Text style={styles.largeText}>
              Serial Number:
              {' '}
              {serial}
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
          <View style={styles.column}>
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
          <View style={styles.column}>
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
      </Page>
    </Document>

  );
}

function Certificate() {
  return (
    <div>
      <PDFViewer style={styles.viewer}>
        <MyDocument />
      </PDFViewer>
    </div>
  );
}

export default Certificate;
