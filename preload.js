// const { contextBridge } = require('electron');
// const { exec } = require('child_process');
// var htmlToPdf = require('html-to-pdf');
// const fs = require('fs');
// const path = require('path');
// const { print } = require("pdf-to-printer");
// var html_to_pdf = require('html-pdf-node');
// htmlToPdf.setDebug(true);
// console.log("Loaded");
// // print(path.join(__dirname, "./posCore/kot/28-04-2023_23-42-58.pdf")).then(console.log);
// function myPrint(){
//   // open as file object  path.join(__dirname, "./posCore/templates/index.html")
//   fs.readFile(path.join(__dirname, "./posCore/templates/index.html"), 'utf8', function(err, data) {
//     if (err) {
//       return console.log(err);
//     }
//     let file = { content: "<p>Test data</p>" };
//     console.log(file);
//     // let file = { content:  };
//     // let file = { url: };
//     return html_to_pdf.generatePdf(file, {width:'80mm'})
//   })
// }
// contextBridge.exposeInMainWorld('printing', {
//   print: myPrint,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
//   // we can also expose variables, not just functions
// })



// New code implmentation

var printer = require("@thiagoelg/node-printer");
let EscPosEncoder = require('esc-pos-encoder');

class customEncoder extends EscPosEncoder {
  initPrint(){
    this.initialize()
    .newline()
    .newline()
    .newline()
    return this
  }
  h1(text){
    return this.height(2)
    .width(2)
    .size('small').align('center')
    .line(text)
  }
  hr(double = false){
    return this.height(1)
    .width(1)
    .rule({style:double ? 'double' : 'single'})
  }
  productTable(products){
    // products contains name, price, quantity, total
    let table = [
      { width: 26, marginRight: 2, align: 'left' },
      { width: 5, marginRight: 2, align: 'center' },
      { width: 5, marginRight: 2, align: 'center' },
      { width: 10, align: 'right' }
    ]
    let data = []
    products.forEach(product => {
      data.push([product.name, product.quantity, product.price, product.total])
    });
    return this.table(table, data)
  }
}
console.log(printer.getPrinters());

let encoder = new customEncoder({width:75});
// cp437, cp720, cp737, cp775, cp850, cp851, cp852, cp853, cp855, cp857, cp858, cp860, cp861, cp862, cp863, cp864, cp865, cp866, cp869, cp874, cp922, cp1098, cp1118, cp1119, cp1125, cp2001, cp3001, cp3002, cp3011, cp3012, cp3021, cp3041, cp3840, cp3841, cp3843, cp3844, cp3845, cp3846, cp3847, cp3848, iso885915, iso88592, iso88597, rk1048, windows1250, windows1251, windows1252, windows1253, windows1254, windows1255, windows1256, windows1257, windows1258,
let result = encoder
.initPrint()
.h1("Hotel name")
.width(2)
.size('small').align('center')
.line('Hotel Name')
.newline()
.height(1)
.width(1)
.table(
  [
      { width: 36, marginRight: 2, align: 'left' },
      { width: 10, align: 'right' }
  ], 
  [
      [ 'Item 1', '€ 10,00' ],
      [ 'Item 2', '15,00' ],
      [ 'Item 3', '9,95' ],
      [ 'Item 4', '4,75' ],
      [ 'Item 5', '211,05' ],
      [ '', '='.repeat(10) ],
      [ 'Total', (encoder) => encoder.bold().text('€ 250,75').bold() ],
  ]
)
.newline()
.newline()
.newline()
.newline()
    .cut()
    .encode();
printer.printDirect({data:result // or simple String: "some text"
  //, printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
  , type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
  , success:function(jobID){
    console.log("sent to printer with ID: "+jobID);
  }
  , error:function(err){console.log(err);},
  printer:'POS-80C'
});

// const escpos = require('escpos');
// // install escpos-usb adapter module manually
// let usbHandler = require('escpos-usb');
// let printer =usbHandler.findPrinter()
// console.log(printer[0].deviceDescriptor.idVendor)
// usbHandler.getDevice(printer[0].deviceDescriptor.idVendor,printer[0].deviceDescriptor.idProduct)
// // Select the adapter based on your printer type
// // console.log("Loading USB");
// // const device  = new escpos.USB();
// // // const device  = new escpos.Network('localhost');
// // // const device  = new escpos.Serial('/dev/usb/lp0');
 
// // // const options = { encoding: "GB18030" /* default */ }
// // // encoding is optional
// // console.log("printer",device);
// // const printer = new escpos.Printer(device);
 
// // device.open(function(error){
// //   printer
// //   .font('a')
// //   .style('bu')
// //   .align('ct')
// //   .size(1, 1)
// //   .text('The quick brown fox jumps over the lazy dog')
// //   .text('敏捷的棕色狐狸跳过懒狗')
// //   .barcode('1234567', 'EAN8')
// //   .table(["One", "Two", "Three"])
// //   .tableCustom(
// //     [
// //       { text:"Left", align:"LEFT", width:0.33, style: 'B' },
// //       { text:"Center", align:"CENTER", width:0.33},
// //       { text:"Right", align:"RIGHT", width:0.33 }
// //     ],
// //     { encoding: 'cp857', size: [1, 1] } // Optional
// //   )
// //   .qrimage('https://github.com/song940/node-escpos', function(err){
// //     this.cut();
// //     this.close();
// //   });
// // });