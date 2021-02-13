import React from 'react';
import {
  PDFViewer, Page, Text, Image, View, Document, StyleSheet,
} from '@react-pdf/renderer';

const strftime = require('strftime');

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
    padding: 10,
    border: '10pt solid #ff0000',
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
  const model = window.sessionStorage.getItem('modelNumber');
  const description = window.sessionStorage.getItem('modelDescription');
  const calibrationDate = window.sessionStorage.getItem('calibrationDate');
  const expirationDate = strftime('%F', new Date(window.sessionStorage.getItem('expirationDate')));
  const comment = window.sessionStorage.getItem('calibComment');

  return (
    <Document>
      <Page style={styles.page} size="LETTER">
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>

            <View style={styles.logoView}>
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
        <MyCertificate />
      </PDFViewer>
    </div>
  );
}

export default Certificate;
