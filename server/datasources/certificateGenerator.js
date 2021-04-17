/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
// localhost:4001/api/certificate?calibrationID=10&chainOfTruth=true
const React = require('react');
const fs = require('fs');
const { default: ReactPDF } = require('@react-pdf/renderer');
const {
  Document, Page, Text, Image, View, StyleSheet, Link,
} = require('@react-pdf/renderer');
const { v4: uuidv4 } = require('uuid');
const tou8 = require('utf8-to-uint8array');
const { dirname } = require('path');
const { createStore, createDB } = require('../util');
const CalibrationEventAPI = require('./calibrationEvents');

let store;
createDB().then(() => {
  store = createStore(false);
});

let calEvents;
let calEvent;

const loadLevels = ['No Load', '1 x 100A', '2 x 100A', '3 x 100A', '4 x 100A', '5 x 100A', '6 x 100A', '7 x 100A', '8 x 100A', '9 x 100A', '10 x 100A', '10 x 100A + 1 x 20A', '10 x 100A + 2 x 20A', '10 x 100A + 3 x 20A', '10 x 100A + 4 x 20A', '10 x 100A + 5 x 20A', '10 x 100A + 5 x 20A + 1 x 1A', '10 x 100A + 5 x 20A + 2 x 1A', '10 x 100A + 5 x 20A + 3 x 1A', '10 x 100A + 5 x 20A + 4 x 1A', '10 x 100A + 5 x 20A + 5 x 1A', '10 x 100A + 5 x 20A + 6 x 1A', '10 x 100A + 5 x 20A + 7 x 1A', '10 x 100A + 5 x 20A + 8 x 1A', '10 x 100A + 5 x 20A + 9 x 1A', '10 x 100A + 5 x 20A + 10 x 1A', '10 x 100A + 5 x 20A + 11 x 1A', '10 x 100A + 5 x 20A + 12 x 1A', '10 x 100A + 5 x 20A + 13 x 1A', '10 x 100A + 5 x 20A + 14 x 1A', '10 x 100A + 5 x 20A + 15 x 1A', '10 x 100A + 5 x 20A + 16 x 1A', '10 x 100A + 5 x 20A + 17 x 1A', '10 x 100A + 5 x 20A + 18 x 1A', '10 x 100A + 5 x 20A + 19 x 1A', '10 x 100A + 5 x 20A + 20 x 1A'];
const idealCurrents = [ // values copied from excel spread sheet
  0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1020, 1040, 1060, 1080, 1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119, 1120,
];
const klufeStepInfo = {
  4: {
    lower: 3.499, upper: 3.501, range: '3.500 ± 0.001', source: '3.500V DC', message: 'Adjust R21 to obtain the proper display.',
  },
  7: {
    lower: 3.498, upper: 3.502, range: '3.500 ± 0.002', source: '3.513V 50Hz', message: 'Adjust R34 to obtain the proper display.',
  },
  9: {
    lower: 99.8, upper: 100.2, range: '100.0 ± 0.2', source: '100V 20kHz', message: 'Adjust C37 to obtain the proper display.',
  },
  11: {
    lower: 3.496, upper: 3.504, range: '3.500 ± 0.004', source: '3.500V 10kHz', message: 'Addjust C2 to obtain the proper display.',
  },
  13: {
    lower: 34.96, upper: 35.04, range: '35.00 ± 0.04', source: '35V 10kHz', message: 'Adjust C3 to obtain the proper display.',
  },
};

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
    fontSize: 14,
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
    margin: 5,
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
  customFormTableColRegular: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  customFormTableColPrompt: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  customFormTableColSpanning: {
    width: '60%',
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
        { style: styles.image, src: `uploads/${calEvent.fileLocation}` },
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
            { style: styles.logo, src: './certificateAssets/HPT_logo.png' },
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
              `Calibrator Username: ${calEvent.calibratorUserName}`,
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
              `\n\n${calEvent.approverUsername ? `Approver Username: ${calEvent.approverUsername}` : ''}`,
            ),
            React.createElement(
              Text,
              { style: styles.largeText },
              `${calEvent.approvalDate ? `Approval Date: ${calEvent.approvalDate}` : ''}`,
            ),
          ),
        ),
        await displayLink(),
        console.log(dirname),
        await displayImage(),
      ),
    ),
  )
);

const lbRow = (p, i) => (
  React.createElement(
    View,
    { style: styles.tableRow },
    React.createElement(
      View,
      { style: styles.lbTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${loadLevels[i]}`,
      ),
    ),
    React.createElement(
      View,
      { style: styles.lbTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${p.currentReadings[i].cr}`,
      ),
    ),
    React.createElement(
      View,
      { style: styles.lbTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${p.currentReadings[i].ca}`,
      ),
    ),
    React.createElement(
      View,
      { style: styles.lbTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${idealCurrents[i]}`,
      ),
    ),
    React.createElement(
      View,
      { style: styles.lbTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${Number(p.currentReadings[i].crError).toFixed(5)}`,
      ),
    ),
    React.createElement(
      View,
      { style: styles.lbTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${p.currentReadings[i].crOk ? 'OK' : 'NOT OK'}`,
      ),
    ),
    React.createElement(
      View,
      { style: styles.lbTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${Number(p.currentReadings[i].caError).toFixed(5)}`,
      ),
    ),
    React.createElement(
      View,
      { style: styles.lbTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${p.currentReadings[i].caOk ? 'OK' : 'NOT OK'}`,
      ),
    ),
  )

);

function fillLBCurrent() {
  const infoList = [];
  for (let i = 0; i < 36; i += 1) {
    for (let j = 0; j < 36; j += 1) {
      if (i === JSON.parse(calEvent.loadBankData).currentReadings[j].id) {
        infoList.push(lbRow(JSON.parse(calEvent.loadBankData), i));
        break;
      }
    }
  }
  return infoList;
}

const displayLoadBank = async () => (
  React.createElement(
    View,
    { style: styles.table },
    React.createElement(
      View,
      { style: styles.tableRow },
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Load Level',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Current Reported [A]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Current Actual [A]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Ideal Current [A]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'CR Error [%]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'CR ok?',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'CA Error [%]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'CA ok?',
        ),
      ),
    ),
    fillLBCurrent(),
  )

);

const displayLoadBankVoltage = () => (
  React.createElement(
    View,
    { style: styles.table },
    React.createElement(
      View,
      { style: styles.tableRow },
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          '',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Voltage Reported [V]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Voltage Actual [V]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Test Voltage [V]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'VR Error [%]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'VR ok?',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'VA Error [%]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'VA ok?',
        ),
      ),
    ),
    React.createElement(
      View,
      { style: styles.tableRow },
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Voltages with all blanks on:',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          `${JSON.parse(calEvent.loadBankData).voltageReading.vr}`,
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          `${JSON.parse(calEvent.loadBankData).voltageReading.va}`,
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          '48',
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          `${Number(JSON.parse(calEvent.loadBankData).voltageReading.vrError).toFixed(5)}`,
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          `${JSON.parse(calEvent.loadBankData).voltageReading.vrOk ? 'OK' : 'NOT OK'}`,
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          `${Number(JSON.parse(calEvent.loadBankData).voltageReading.vaError).toFixed(5)}`,
        ),
      ),
      React.createElement(
        View,
        { style: styles.lbTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          `${JSON.parse(calEvent.loadBankData).voltageReading.vaOk ? 'OK' : 'NOT OK'}`,
        ),
      ),
    ),
  )
);

const klufeRow = (step) => (
  React.createElement(
    View,
    { style: styles.tableRow },
    React.createElement(
      View,
      { style: styles.klufeTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${klufeStepInfo[step].source}`,
      ),
    ),
    React.createElement(
      View,
      { style: styles.klufeTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${klufeStepInfo[step].range}`,
      ),
    ),
    React.createElement(
      View,
      { style: styles.klufeTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        `${JSON.parse(calEvent.klufeData).readings[step]}`,
      ),
    ),
    React.createElement(
      View,
      { style: styles.klufeTableCol },
      React.createElement(
        Text,
        { style: styles.tableCell },
        'OK',
      ),
    ),
  )
);

const displayKlufe = () => (
  React.createElement(
    View,
    { style: styles.table },
    React.createElement(
      View,
      { style: styles.tableRow },
      React.createElement(
        View,
        { style: styles.klufeTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Source',
        ),
      ),
      React.createElement(
        View,
        { style: styles.klufeTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Acceptable Range [V]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.klufeTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'Actual Value [V]',
        ),
      ),
      React.createElement(
        View,
        { style: styles.klufeTableCol },
        React.createElement(
          Text,
          { style: styles.tableCell },
          'OK?',
        ),
      ),
    ),
    klufeRow(4),
    klufeRow(7),
    klufeRow(9),
    klufeRow(11),
    klufeRow(13),
  )
);

const displayCustomForm = () => {
  const parsedFormData = JSON.parse(calEvent.customFormData);
  const pages = [];
  const pageDatas = [];
  let pageData = [];
  let counter = 0;
  const rowsPerPage = 18;

  // Split the JSON into page sized groups
  for (let i = 0; i < parsedFormData.length; i += 1) {
    const currentElement = parsedFormData[i];
    if (currentElement.type === 'number' || currentElement.type === 'text') {
      pageData.push(currentElement);
      counter += 1;
      if (counter === rowsPerPage) {
        // Finish this page
        pageDatas.push(pageData);
        pageData = [];
        counter = 0;
      }
    }
  }

  if (pageData.length > 0) {
    pageDatas.push(pageData);
  }

  // Make a page from each group
  for (let pageNum = 0; pageNum < pageDatas.length; pageNum += 1) {
    const data = pageDatas[pageNum];
    const tableRows = [];
    // Make the table for this page
    const tableHeader = React.createElement(
      View,
      { style: styles.table },
      React.createElement(
        View,
        { style: styles.tableRow },
        React.createElement(
          View,
          { style: styles.customFormTableColPrompt },
          React.createElement(
            Text,
            { style: styles.tableCell },
            'Label',
          ),
        ),
        React.createElement(
          View,
          { style: styles.customFormTableColRegular },
          React.createElement(
            Text,
            { style: styles.tableCell },
            'Value',
          ),
        ),
        React.createElement(
          View,
          { style: styles.customFormTableColRegular },
          React.createElement(
            Text,
            { style: styles.tableCell },
            'Min',
          ),
        ),
        React.createElement(
          View,
          { style: styles.customFormTableColRegular },
          React.createElement(
            Text,
            { style: styles.tableCell },
            'Max',
          ),
        ),
        React.createElement(
          View,
          { style: styles.customFormTableColRegular },
          React.createElement(
            Text,
            { style: styles.tableCell },
            'OK?',
          ),
        ),
      ),
    );
    tableRows.push(tableHeader);
    for (let i = 0; i < data.length; i += 1) {
      const rowJSON = data[i];

      if (rowJSON.type === 'number') {
        const rowData = React.createElement(
          View,
          { style: styles.table },
          React.createElement(
            View,
            { style: styles.tableRow },
            React.createElement(
              View,
              { style: styles.customFormTableColPrompt },
              React.createElement(
                Text,
                { style: styles.tableCell },
                `${rowJSON.prompt}`,
              ),
            ),
            React.createElement(
              View,
              { style: styles.customFormTableColRegular },
              React.createElement(
                Text,
                { style: styles.tableCell },
                `${rowJSON.value}`,
              ),
            ),
            React.createElement(
              View,
              { style: styles.customFormTableColRegular },
              React.createElement(
                Text,
                { style: styles.tableCell },
                `${rowJSON.min}`,
              ),
            ),
            React.createElement(
              View,
              { style: styles.customFormTableColRegular },
              React.createElement(
                Text,
                { style: styles.tableCell },
                `${rowJSON.max}`,
              ),
            ),
            React.createElement(
              View,
              { style: styles.customFormTableColRegular },
              React.createElement(
                Text,
                { style: styles.tableCell },
                'OK',
              ),
            ),
          ),
        );
        tableRows.push(rowData);
      } else {
        const rowData = React.createElement(
          View,
          { style: styles.table },
          React.createElement(
            View,
            { style: styles.tableRow },
            React.createElement(
              View,
              { style: styles.customFormTableColPrompt },
              React.createElement(
                Text,
                { style: styles.tableCell },
                `${rowJSON.prompt}`,
              ),
            ),
            React.createElement(
              View,
              { style: styles.customFormTableColSpanning },
              React.createElement(
                Text,
                { style: styles.tableCell },
                `${rowJSON.value}`,
              ),
            ),
          ),
        );
        tableRows.push(rowData);
      }
    }

    // Make page with tableRows and add to pages
    const page = React.createElement(
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
            null,
            tableRows,
          ),
        ),
      ),
    );
    pages.push(page);
  }

  return pages;
};

const generateDataTablesPage1 = async () => (
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
          null,
          calEvent.isLoadBank ? await displayLoadBank() : null,
          calEvent.isKlufe ? displayKlufe() : null,
        ),
      ),
    ),
  )
);
const generateDataTablesPage2 = async () => (
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
          null,
          calEvent.isLoadBank ? displayLoadBankVoltage() : null,
        ),
      ),
    ),
  )
);

const getRelations = (calibratedByList) => {
  let relations = '';
  for (let j = 0; j < calibratedByList.length; j += 1) {
    relations = `${relations} ${calibratedByList[j].vendor} ${calibratedByList[j].modelNumber} #${calibratedByList[j].assetTag}`;
  }
  return relations;
};

const fillDependencies = async () => {
  const dependencies = [];
  for (let i = 0; i < calEvents.length; i += 1) {
    const inst = calEvents[i];
    if (inst.calibratedBy.length !== 0) {
      const line = React.createElement(
        Text,
        { style: styles.smallText },
        `${inst.vendor} ${inst.modelNumber} #${inst.assetTag} was calibrated by: ${getRelations(inst.calibratedBy)}`,
      );
      dependencies.push(line);
    }
  }
  return dependencies;
};

const generateDependencyPage = async () => {
  const depPage = React.createElement(
    Page,
    { style: styles.page, size: 'LETTER' },
    React.createElement(
      View,
      { style: styles.outerBorder },
      React.createElement(
        View,
        { style: styles.innerBorder },
        React.createElement(
          Text,
          { style: styles.title },
          'Calibration Dependencies',
        ),
        React.createElement(
          Text,
          { style: styles.largeText },
          ' ',
        ),
        await fillDependencies(),
      ),
    ),
  );
  return depPage;
};

const assembleOneCertificate = async () => {
  const pageList = [];
  console.log(calEvent);
  pageList.push(await generateInfoPage());
  (calEvent.isKlufe || calEvent.isLoadBank) ? pageList.push(await generateDataTablesPage1()) : null;
  calEvent.isLoadBank ? pageList.push(await generateDataTablesPage2()) : null;
  calEvent.isCustomForm ? pageList.push(await displayCustomForm()) : null;

  return pageList;
};

const generateCertificate = async (assetTag, chainOfTruth) => {
  // Query for calibration data
  const cal = new CalibrationEventAPI({ store });
  const certificateChain = [];
  if (chainOfTruth === 'true') {
    calEvents = await cal.getChainOfTruthForInstrument({ assetTag });
  } else {
    calEvents = [await cal.getCertificateForInstrument({ assetTag })];
  }
  for (let i = 0; i < calEvents.length; i += 1) {
    calEvent = calEvents[i];
    console.log(calEvent);
    if (i === 1) {
      // eslint-disable-next-line no-await-in-loop
      certificateChain.push(await generateDependencyPage());
    }
    // eslint-disable-next-line no-await-in-loop
    certificateChain.push(await assembleOneCertificate());
  }

  const fname = `${__dirname}/${uuidv4()}.pdf`;
  await ReactPDF.render(
    React.createElement(
      Document,
      null,
      certificateChain,
    ),
    fname,
  );
  const res = await fs.readFileSync(fname);
  await fs.unlinkSync(fname);
  return tou8(res);
};

module.exports = generateCertificate;
