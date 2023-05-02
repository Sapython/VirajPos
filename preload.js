const { contextBridge } = require('electron');
const { exec } = require('child_process');
var htmlToPdf = require('html-to-pdf');
const path = require('path');
const { print } = require("pdf-to-printer");
htmlToPdf.setDebug(true);
console.log("Loaded");
print(path.join(__dirname, "./posCore/kot/28-04-2023_23-42-58.pdf")).then(console.log);
function myPrint(){
  htmlToPdf.convertHTMLFile(path.join(__dirname, "./dist/viraj/index.html"), path.join(__dirname, "./dist/viraj/index.pdf"),
    function (error, success) {
       if (error) {
            console.log('Oh noes! Errorz!');
            console.log(error,path.join(__dirname, "./dist/viraj/index.pdf"));
        } else {
            console.log('Woot! Success!');
            console.log(success,path.join(__dirname, "./dist/viraj/index.pdf"));
        }
    }
);
}
contextBridge.exposeInMainWorld('printing', {
  print: print,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
})