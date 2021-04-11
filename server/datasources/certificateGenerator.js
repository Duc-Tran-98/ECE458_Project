/* eslint-disable no-unused-vars */
// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
// localhost:4001/api/certificate?calibrationID=10&chainOfTruth=true
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const generateCertificate = async ({ calibrationID, chainOfTruth }) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const pdfPage = pdfDoc.addPage();
  // const { width, height } = pdfPage.getSize();
  pdfPage.setFont(timesRomanFont);
  const largeFontSize = 30;
  const text = 'Certificate of Calibration';
  pdfPage.drawText(text, {
    // x: (width / 2) - 100,
    // y: (height * 2) / 3,
    TextAlignment: 0,
    size: largeFontSize,
  });
  return pdfDoc.save();
};

module.exports = generateCertificate;
