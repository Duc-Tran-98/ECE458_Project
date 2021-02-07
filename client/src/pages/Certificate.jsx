import React from 'react';
import {
  PDFViewer, Page, Text, Document, StyleSheet,
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    width: '100%',
    orientation: 'portrait',
    padding: 15,
  },
  title: {
    fontFamily: 'Times-Roman',
    fontSize: 24,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
    textAlign: 'left',
  },
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page style={styles.page} size="LETTER">
      <Text style={styles.title}>
        Certificate of Calibration
      </Text>
      <Text style={styles.text}>Vendor:</Text>
      <Text style={styles.text}>Model Number:</Text>
      <Text style={styles.text}>Model Description:</Text>
      <Text style={styles.text}>Serial Number:</Text>
      <Text style={styles.text}>Date of Calibration:</Text>
      <Text style={styles.text}>Date of Expiration:</Text>
      <Text style={styles.text}>User:</Text>
      <Text style={styles.text}>Comment:</Text>
    </Page>
  </Document>
);

function Certificate() {
  return (
    <div>
      <PDFViewer width="100%" height="1000">
        <MyDocument />
      </PDFViewer>
    </div>
  );
}

export default Certificate;
