/* eslint-disable max-len */
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

let calEvent;

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
    height: '100%',
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

async function getFileType(url) {
  if (url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }
  return '';
}

const displayLink = async () => (
  (((await getFileType(calEvent.fileLocation) === 'pdf') || (await getFileType(calEvent.fileLocation) === 'xlsx') || (await getFileType(calEvent.fileLocation) === 'gif'))) ? (
    React.createElement(
      Link,
      { src: calEvent.fileLocation },
      React.createElement(
        Text,
        { style: styles.largeText },
        `\n${calEvent.fileName}\n`,
      ),
    )
  ) : (null)
);

const displayImage = async () => (
  ((await getFileType(calEvent.fileLocation) === 'jpeg') || (await getFileType(calEvent.fileLocation) === 'jpg') || (await getFileType(calEvent.fileLocation) === 'png')) ? (
    React.createElement(
      View,
      { style: styles.centerView },
      React.createElement(
        Image,
        { style: styles.image, src: calEvent.fileLocation },
      ),
    )
  ) : (null)
);

const generateInfoPage = async () => (
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
              `Vendor: ${calEvent.vendor}`,
            ),
            React.createElement(
              Text,
              { style: styles.largeText },
              `Model Number: ${calEvent.modelNumber}`,
            ),
          ),
          React.createElement(
            View,
            { style: styles.leftColumn },
            React.createElement(
              Text,
              { style: styles.largeText },
              `Serial Number: ${calEvent.serialNumber ? `${calEvent.serialNumber}` : ''}`,
            ),
            React.createElement(
              Text,
              { style: styles.largeText },
              `Asset Tag: ${calEvent.assetTag}`,
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
          `${calEvent.modelDescription}`,
        ),
        React.createElement(
          Text,
          { style: styles.largeText },
          '\nComment:',
        ),
        React.createElement(
          Text,
          { style: styles.smallText },
          calEvent.calibrationComment ? `${calEvent.calibrationComment}` : '',
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
              `\nCalibrated By: ${calEvent.calibratorFirstName} ${calEvent.calibratorLastName}`,
            ),
            React.createElement(
              Text,
              { style: styles.largeText },
              `Username: ${calEvent.calibratorUserName}`,
            ),
            React.createElement(
              Text,
              { style: styles.largeText },
              `\n\nApproval Status: ${calEvent.approvalStatus}`,
            ),
            React.createElement(
              Text,
              { style: styles.largeText },
              `${calEvent.approverFirstName ? `Approved By: ${calEvent.approverFirstName} ${calEvent.approverLastName}` : ''}`,
            ),
            React.createElement(
              Text,
              { style: styles.largeText },
              `${calEvent.approverUserName ? `Approved By: ${calEvent.approverUserName}` : ''}`,
            ),
          ),
          React.createElement(
            View,
            { style: styles.leftColumn },
            React.createElement(
              Text,
              { style: styles.largeText },
              `\nDate of Calibration: ${calEvent.calibrationDate}`,
            ),
            React.createElement(
              Text,
              { style: styles.largeText },
              `Date of Expiration: ${new Date(new Date(calEvent.calibrationDate).getTime() + 86400000 * calEvent.calibrationFrequency).toISOString().split('T')[0]}`,
            ),
            React.createElement(
              Text,
              { style: styles.largeText },
              `\n\n${calEvent.approvalDate ? `Approval Date: ${calEvent.approvalDate}` : ''}`,
            ),
          ),
        ),
        await displayLink(),
        await displayImage(),
      ),
    ),
  )
);

// const displayLoadBank = async() => (

// )

const generateDataTables = () => (
  React.createElement(
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
            // calEvent.isLoadBank ? displayLoadBank() : null,
            // calEvent.isKlufe ? displayKlufe() : null,
            // calEvent.isCustomForm ? displayCustom() : null,
          ),
        ),
      ),
    ),
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
            // calEvent.isLoadBank ? displayLoadBankVoltage() : null,
          ),
        ),
      ),
    ),
  )
);

// const generateDependencyPage = () => (

//   )

const assemblePDF = async () => (
  React.createElement(
    Document,
    null,
    await generateInfoPage(),
    await generateDataTables(),
  )
);

async function convertToSendPDF() {
  const fname = `${__dirname}/${uuidv4()}.pdf`;
  await ReactPDF.render(
    await assemblePDF(),
    fname,
  );
  const res = await fs.readFileSync(fname);
  await fs.unlinkSync(fname);
  return tou8(res);
}

const generateCertificate = async (assetTag, chainOfTruth) => {
  // Query for calibration data
  const cal = new CalibrationEventAPI({ store });
  if (chainOfTruth) {
    calEvent = await cal.getChainOfTruthForInstrument(assetTag);
  } else {
    calEvent = await cal.getCetificateForInstrument(assetTag);
  }

  return convertToSendPDF();
};

module.exports = generateCertificate;
