const fs = require("fs");
var admin = require("firebase-admin");
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

var serviceAccount = require("./fbms-shreeva-demo-firebase-adminsdk-8nk63-28663566a0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fbms-shreeva-demo-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getFirestore();

fs.readFile("./Momos castle menu - Sheet1(2).csv", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
    let lines = data.split("\n");
    products = [];
    lines.forEach((line) => {
        let columns = line.split(",");
        if (columns[0]!='Name' && columns[1]){
          let product = {
            category:{
              name:"All Momos",
              id:"QzivwJOg6BltDf6YCqwM"
            },
            createdDate:new Date(),
            images:[],
            name:columns[0],
            price:Number(columns[1].replace('\r','')),
            quantity:1,
            selected:false,
            tags:[],
            type:columns[2],
            variants:[],
            visible:true,
            visbility:true
          }
          products.push(product);
        }
    })
    console.log(products);
    products.forEach((product)=>{
      db.collection('business/46r0a1zlta7hyb077scig9/menus/Vj26EdBp971m06o7D9bd/products').add(product).then((doc)=>{
        console.log(doc.id);
        // update doc with id
        db.collection('business/46r0a1zlta7hyb077scig9/menus/Vj26EdBp971m06o7D9bd/products').doc(doc.id).update({id:doc.id});
      })
    })
});
