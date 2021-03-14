const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('output.pdf'));
const canvas = createCanvas();
// const data = {};
const options = {
  format: 'CODE128C',

};
JsBarcode(canvas, '101010', options);
// console.log(`<img src="${canvas.toDataURL()}" />`);
const jpegUrl = canvas.toDataURL();
doc.image(jpegUrl);
// console.log(canvas);
doc.end();
