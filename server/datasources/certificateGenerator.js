/* eslint-disable no-unused-vars */
// localhost:4001/api/certificate?calibrationID=10&chainOfTruth=true
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const {
  PDFViewer, Document, Page, Text, Image, View, StyleSheet, Link,
} = require('@react-pdf/renderer');

const strftime = require('strftime');

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
    border: '10pt solid #ff0000',
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
 
  <Document>
       <Page style={styles.page} size="LETTER">
         <View style={styles.outerBorder}>
           <View style={styles.innerBorder}>
             <View style={styles.centerView}>
               <Image style={styles.logo} src="/HPT_logo.png" />
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
                   {modelNumber}
                 </Text>
               </View>
               <View style={styles.leftColumn}>
                 <Text style={styles.largeText}>
                   Serial Number:
                   {' '}
                   {serialNumber}
                 </Text>
                 <Text style={styles.largeText}>
                   Asset Tag:
                   {' '}
                   {assetTag}
                 </Text>
               </View>
             </View>

             <Text style={styles.largeText}>
               {'\n'}
               Model Description:
             </Text>
             <Text style={styles.smallText}>{description}</Text>

             <Text style={styles.largeText}>
               {'\n'}
               Comment:
             </Text>
             <Text style={styles.smallText}>{comment}</Text>

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

             (((evidenceFileType === 'pdf') || (evidenceFileType === 'xlsx') || (evidenceFileType === 'gif'))) ? (
     <Text style={styles.largeText}>
       {'\n'}
       {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
       <Link src={evidenceFile}> View Evidence </Link>
       {'\n'}
     </Text>
   ) : (null);

   ((evidenceFileType === 'jpeg') || (evidenceFileType === 'jpg') || (evidenceFileType === 'png')) ? (
     <View style={styles.centerView}>
       <Image style={styles.image} src={evidenceFile} />
     </View>
   ) : (null);

           </View>
         </View>
       </Page>
       {(loadBankData) && (
        <>
          <Page style={styles.page}>
            {displayLoadBank}
          </Page>
          <Page style={styles.page}>
            {displayLoadBankVoltage}
          </Page>
        </>
      )}
      {(klufeData) && (
        <>
          <Page style={styles.page}>
            {displayKlufe}
          </Page>
        </>
      )}
    </Document>
)

const generateDataTables = () => (

)

const generateDependencyPage = () => (
  
  )

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
  
  return pdfDoc.save();
};

module.exports = generateCertificate;
