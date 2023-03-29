import * as functions from "firebase-functions";
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
import { faker } from '@faker-js/faker';
import { Category, MenuData, Product } from '../../src/app/structures/general.structure'
initializeApp();

const db = getFirestore();
// connectFirestoreEmulator(db, "localhost", 8080);
// connectAuthEmulator(auth, "http://localhost:9099");
// connectStorageEmulator(storage, "localhost", 9199);
// functions.con(functions, "localhost", 5001);


// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const createMenu = functions.https.onRequest((request, response) => {
    let products:Product[] = [];
    for (let i = 0; i < 10; i++) {
        let product:Product = {
            id: faker.random.alphaNumeric(),
            name: faker.commerce.product(),
            price: Number(faker.random.numeric(3)),
            image: faker.image.imageUrl(),
            ingredients: []
        }
        products.push(product);
    }
    // create a category with 10 products
    let category:Category = {
        id: faker.random.alphaNumeric(),
        name: faker.name.firstName(),
        products: products,
        averagePrice: 0
    }
    // add Menu as a MenuData structure
    let menuData:MenuData = {
        name: 'Primary Menu',
        description: faker.lorem.paragraph(),
        templates: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    }
    // add the category to the menu

    db.collection('business/UTJetLFyQnfthZssQoEh/menu').add(menuData).then((menuRef:any) => {
        console.log('Document written with ID: ', menuRef.id);
        db.collection('business/UTJetLFyQnfthZssQoEh/menu').doc(menuRef.id).collection('categories').add(category).then((categoryRef:any) => {
            console.log('Document written with ID: ', categoryRef.id);
            // add products to the category
            products.forEach((product:Product) => {
                db.collection('business/UTJetLFyQnfthZssQoEh/menu').doc(menuRef.id).collection('categories').doc(categoryRef.id).collection('products').add(product).then((productRef:any) => {
                    console.log('Document written with ID: ', productRef.id);
                    response.send("final!");
                }).catch((error:any) => {
                    console.error('Error adding document: ', error);
                    response.send("2!");
                });
            })
        }).catch((error:any) => {
            console.error('Error adding document: ', error);
            response.send("1!");
        });
    })
});

