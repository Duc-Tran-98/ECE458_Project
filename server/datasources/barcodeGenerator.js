/* eslint-disable no-await-in-loop */
const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const runBarcode = async ({ data }) => {
  // PAGE VALUES
  // TOP LEFT BOX 30 723
  // LABEL SIZE HEIGHT 30 WIDTH 105
  // TO NEXT BOX SIZE HEIGHT 36 WIDTH 148

  const pdfDoc = await PDFDocument.create();
  const canvas = createCanvas();
  const blank = await PDFDocument.load(fs.readFileSync('./templates/LabelTemplate.pdf'));
  let blankPage = await pdfDoc.copyPages(blank, blank.getPageIndices());
  blankPage.forEach((page) => pdfDoc.addPage(page));

  for (let i = 0; i < data.length; i += 1) {
    const pageNum = Math.floor(i / 80);
    const xSpot = Math.floor(i / 20) % 4;
    const ySpot = i % 20;
    const xVal = 30 + (148 * xSpot);
    const yVal = 723 - (36 * ySpot);

    const assetTag = data[i];
    const options = {
      format: 'CODE128C',
      width: 3,
      height: 30,
      displayValue: false,
      margin: 0,
    };
    JsBarcode(canvas, assetTag, options);

    const img = await pdfDoc.embedPng(canvas.toDataURL());

    if (pageNum >= pdfDoc.getPages().length) {
      blankPage = await pdfDoc.copyPages(blank, blank.getPageIndices());
      blankPage.forEach((el) => pdfDoc.addPage(el));
    }
    const pages = pdfDoc.getPages();
    // eslint-disable-next-line prefer-const
    let page = pages[pageNum];
    page.drawImage(img, {
      x: xVal,
      y: yVal + 7,
      width: 108,
      height: 22,
    });
    page.drawText(`HPT Asset     ${assetTag}`, {
      x: xVal + 18,
      y: yVal,
      size: 7,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

module.exports = runBarcode;
