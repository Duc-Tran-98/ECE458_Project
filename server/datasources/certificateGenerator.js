/* eslint-disable no-unused-vars */
// localhost:4001/api/certificate?calibrationID=10&chainOfTruth=true
const React = require('react');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { default: ReactPDF } = require('@react-pdf/renderer');
const {
  PDFViewer, Document, Page, Text, Image, View, StyleSheet, Link,
} = require('@react-pdf/renderer');
const strftime = require('strftime');
const { v4: uuidv4 } = require('uuid');
const tou8 = require('utf8-to-uint8array');
const { createStore, createDB } = require('../util');
const CalibrationEventAPI = require('./calibrationEvents');

let store;
createDB().then(() => {
  store = createStore(false);
});

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
    padding: 20,
    width: '70%',
    height: 'auto',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 8,
  },
  lbTableCol: {
    width: '12.5%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  klufeTableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});

const generateInfoPage = () => (

  // React.createElement(
  //   Document,
  //   null,
  //   React.createElement(
  //     Page,
  //     { size: 'A4', style: styles.page },
  //     React.createElement(
  //       View,
  //       { style: styles.section },
  //       React.createElement(Text, null, 'Section #1'),
  //     ),
  //     React.createElement(
  //       View,
  //       { style: styles.section },
  //       React.createElement(Text, null, 'Section #2'),
  //     ),
  //   ),
  // )

  React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { style: styles.page, size: 'LETTER' },
      React.createElement(
        View,
        { style: styles.outerBorder },
        React.createElement(
          View,
          { style: styles.innerBorder },
          React.createElement(
            View,
            { style: styles.centerView },
            React.createElement(
              Image,
              { style: styles.logo, src: './templates/HPT_logo.png' },
            ),
          ),
          React.createElement(
            Text,
            { style: styles.title },
            'Certificate of Calibration\n\n',
          ),
          React.createElement(
            View,
            { style: styles.columnView },
            React.createElement(
              View,
              { style: styles.rightColumn },
              React.createElement(
                Text,
                { style: styles.largeText },
                'Vendor: {vendor}',
              ),
              React.createElement(
                Text,
                { style: styles.largeText },
                'Model Number: {modelNumber}',
              ),
            ),
            React.createElement(
              View,
              { style: styles.leftColumn },
              React.createElement(
                Text,
                { style: styles.largeText },
                'Serial Number: {serialNumber}',
              ),
              React.createElement(
                Text,
                { style: styles.largeText },
                'Asset Tag: {assetTag}',
              ),
            ),
          ),
          React.createElement(
            Text,
            { style: styles.largeText },
            '\nModel Description:',
          ),
          React.createElement(
            Text,
            { style: styles.smallText },
            '{description}',
          ),
          React.createElement(
            Text,
            { style: styles.largeText },
            '\nComment:',
          ),
          React.createElement(
            Text,
            { style: styles.smallText },
            '{comment}',
          ),
          React.createElement(
            View,
            { style: styles.columnView },
            React.createElement(
              View,
              { style: styles.rightColumn },
              React.createElement(
                Text,
                { style: styles.largeText },
                '\nCalibrated By: {name}',
              ),
              React.createElement(
                Text,
                { style: styles.largeText },
                'Username: {username}',
              ),
            ),
            React.createElement(
              View,
              { style: styles.leftColumn },
              React.createElement(
                Text,
                { style: styles.largeText },
                '\nDate of Calibration: {calibrationDate}',
              ),
              React.createElement(
                Text,
                { style: styles.largeText },
                'Date of Expiration: {expirationDate}',
              ),
            ),
          ),
        ),
      ),
    ),
  )

);

// const generateDataTables = () => (

// )

// const generateDependencyPage = () => (

//   )

async function go() {
  const fname = `${__dirname}/${uuidv4()}.pdf`;
  await ReactPDF.render(
    React.createElement(generateInfoPage, null),
    fname,
  );
  const res = await fs.readFileSync(fname);
  await fs.unlinkSync(fname);
  return tou8(res);
}

const generateCertificate = async ({ assetTag, chainOfTruth }) => {
  // const templatePath = path.join(__dirname, 'bb493b84-b15b-40fc-a648-d7c7787009da.pdf');
  // const blankPagePath = path.join(__dirname, 'bb493b84-b15b-40fc-a648-d7c7787009da.pdf');
  // const templateBytes = fs.readFileSync(templatePath);
  // const blankPageBytes = fs.readFileSync(blankPagePath);

  // const pdfDoc = await PDFDocument.load(templateBytes);
  // const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // // const pdfPage = pdfDoc.addPage();
  // // const { width, height } = pdfPage.getSize();
  // const pages = pdfDoc.getPages();
  // const firstPage = pages[0];
  // const largeFontSize = 16;

  // Query for calibration data (no chain of truth)

  const vendor = 'Fluke';
  const serialNum = '12345';
  const modelNum = '87';
  const description = 'this is a description';
  const comment = 'this is a comment';
  const name = 'Natasha von Seelen';
  const username = 'nlv10';
  const calibrationDate = '01-14-1999';
  const expirationDate = '01-14-2021';

  // pdfDoc.save().then((result) => { console.log('saved', result); });
  // go().then((result) => { console.log('new', result); });

  // return pdfDoc.save();
  return go();
};

module.exports = generateCertificate;
