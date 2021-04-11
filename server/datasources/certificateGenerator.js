/* eslint-disable no-unused-vars */
// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
// localhost:4001/api/certificate?calibrationID=10&chainOfTruth=true
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function fillInfoPage({
  calibrationID, page, font,
}) {
  const largeFontSize = 16;

  const vendor = 'Fluke';
  const serialNum = '12345';
  page.drawText(vendor, {
    x: 105,
    y: 565,
    size: largeFontSize,
    font,
  });
  page.drawText(serialNum, {
    x: 300,
    y: 565,
    size: largeFontSize,
    font,
  });
}

const generateCertificate = async ({ calibrationID, chainOfTruth }) => {
  const templatePath = path.join(__dirname, '../templates/certificateTemplate.pdf');
  const blankPagePath = path.join(__dirname, '../templates/certificateBlankPage.pdf');
  const templateBytes = fs.readFileSync('./templates/certificateTemplate.pdf');
  const blankPageBytes = fs.readFileSync('./templates/certificateBlankPage.pdf');

  const pdfDoc = await PDFDocument.load(templateBytes);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // const pdfPage = pdfDoc.addPage();
  // const { width, height } = pdfPage.getSize();
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const largeFontSize = 16;

  const vendor = 'Fluke';
  const serialNum = '12345';
  const modelNum = '87';
  const assetTag = '100000';
  firstPage.drawText(vendor, {
    x: 105,
    y: 564,
    size: largeFontSize,
    font: timesRomanFont,
  });
  firstPage.drawText(serialNum, {
    x: 425,
    y: 564,
    size: largeFontSize,
    font: timesRomanFont,
  });
  firstPage.drawText(modelNum, {
    x: 155,
    y: 546,
    size: largeFontSize,
    font: timesRomanFont,
  });
  firstPage.drawText(assetTag, {
    x: 390,
    y: 546,
    size: largeFontSize,
    font: timesRomanFont,
  });
  return pdfDoc.save();
};

module.exports = generateCertificate;
