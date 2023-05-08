const fs = require("fs");
var admin = require("firebase-admin");

var serviceAccount = require("fbms-shreeva-demo-firebase-adminsdk-8nk63-28663566a0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fbms-shreeva-demo-default-rtdb.asia-southeast1.firebasedatabase.app"
});

fs.readFile("server/MomosCastleFullMenu.csv", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
    let lines = data.split("\n");
    lines.forEach((line) => {
        let columns = line.split(",");
        if (columns[0]!='Name'){

        }
    })
});
