const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const child_process = require('child_process');

// let EscPosEncoder = require('esc-pos-encoder');
require("update-electron-app")({
  repo: "swayambhu-innovations/Packages",
});
let win;

function run_script(command, args, event, callback) {
  var child = child_process.spawn(command, args, {
    encoding: "utf8",
    shell: true,
  });
  // You can also use a variable to save the output for when the script closes later
  child.on("error", (error) => {
    event.sender.send("printDataComplete", { stage: "error", error });
  });

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (data) => {
    //Here is the output
    data = data.toString();
    console.log(data);
    event.sender.send("printDataComplete", { stage: "stderr", data });
  });

  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (data) => {
    // Return some data to the renderer process with the mainprocess-response ID
    // win.webContents.send('mainprocess-response', data);
    //Here is the output from the command
    data = data.toString();
    console.log(data);
    event.sender.send("printDataComplete", { stage: "stdout", data });
  });

  child.on("close", (code) =>  {
    //Here you can get the exit code of the script
    console.log(`child process exited with code ${code}`);
    event.sender.send("printDataComplete", { stage: "closed", code });
  });
  if (typeof callback === "function") callback();
}

function printData(event, data, printer) {
  console.log("Will Print: ", data, printer);
  fs.writeFile("printableData.txt", data, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
    console.log("File Written Successfully");
    run_script(
      "RawPrint.exe",
      [printer, path.join(__dirname, "printableData.txt")],
      event,
      function () {
        console.log("Done Printing (main)");
      }
    );
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  console.log(path.join(__dirname, "./dist/viraj/index.html"));
  win.loadFile("./dist/viraj/index.html");
  win.webContents.on("did-fail-load", () => {
    console.log("did-fail-load");
    win.loadURL(path.join("file://", __dirname, "./dist/viraj/index.html"));
    // REDIRECT TO FIRST WEBPAGE AGAIN
  });
}

ipcMain.on("getPrinters", async (event, arg) => {
  let res = win.webContents.getPrintersAsync();
  console.log("Main printers", res);
  event.returnValue = await res;
});
ipcMain.on("printData", async (event, arg) => {
  console.log("GOT", arg, arg.data, arg.printer);
  let res = printData(event, arg.data, arg.printer);
});
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  // printBill(billdata);
  // printerList();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// printData('','')
// console.log(printer.getPrinters());
