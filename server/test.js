const runBarcode = require('./datasources/barcodeGenerator');

const assetTags = [];
for (let i = 0; i < 4; i += 1) {
  // assetTags.push(parseInt(req.query.tags[i], 10));
  assetTags.push(100000 + i);
}
console.log(assetTags);
runBarcode({ data: assetTags });
