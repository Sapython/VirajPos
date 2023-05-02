const { app, BrowserWindow } = require("electron");
const path = require("path");
require('update-electron-app')({
    repo:'swayambhu-innovations/Packages'
})
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  console.log(path.join(__dirname, "./dist/viraj/index.html"))
  win.loadFile("./dist/viraj/index.html");
  win.webContents.on("did-fail-load", () => {
    console.log("did-fail-load");
    win.loadURL(
        path.join('file://',__dirname, "./dist/viraj/index.html"),
    );
    // REDIRECT TO FIRST WEBPAGE AGAIN
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
