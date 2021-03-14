const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const run = async () => {
  const pdfDoc = await PDFDocument.load(fs.readFileSync('./LabelTemplate.pdf'));

  const canvas = createCanvas();
  // const data = {};
  const assetTag = 458777;
  const options = {
    format: 'CODE128C',
    text: `HPT Asset    ${assetTag}`,
    width: 3,
    height: 30,
    fontSize: 12,
    textMargin: 0,
    margin: 0,
  };
  JsBarcode(canvas, assetTag, options);
  const img = await pdfDoc.embedPng(canvas.toDataURL());
  // const imagePage = pdfDoc.insertPage(0);
  pdfDoc.getPage(0).drawImage(img, {
    x: 30,
    y: 75,
    width: 105,
    height: 30,
  });

  // PAGE VALUES
  // LABEL SIZE HEIGHT 30 WIDTH 105
  // ROW 1 X 30

  const pdfBytes = await pdfDoc.save();
  const newFilePath = 'output.pdf';
  fs.writeFileSync(newFilePath, pdfBytes);
};

run();
