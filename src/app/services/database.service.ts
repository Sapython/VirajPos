import { Injectable } from '@angular/core';
import { addDoc, collectionData, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { collection, getDoc, getDocs } from '@firebase/firestore';
import { TableConstructor } from '../biller/constructors';
import { DataProvider } from '../provider/data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore:Firestore,private dataProvider:DataProvider) {
    docData(doc(this.firestore,'business/UTJetLFyQnfthZssQoEh/settings/settings')).subscribe((res:any)=>{
      this.dataProvider.billToken = res.billTokenNo;
      this.dataProvider.kotToken = res.kitchenTokenNo;
    })
    this.getProducts().then((res)=>{
      this.dataProvider.products = res.docs.map((doc)=>{return {...doc.data(),id:doc.id,selected: false}});
      this.dataProvider.productsLoaded.next(true);
      console.log("NEXT DONE",this.dataProvider.products);
      // this.dataProvider.products.forEach((product,index:number)=>{
      //   updateDoc(doc(this.firestore,'business/accounts/triveniSangam/recipes/recipes',product.id),{count:index})
      // })
    })
  }

  getProducts(){
    return getDocs(collection(this.firestore,'/business/UTJetLFyQnfthZssQoEh/recipes'))
  }

  getMainCategories() {
    return getDocs(
      collection(
        this.firestore,
        'business/UTJetLFyQnfthZssQoEh/categories'
      )
    );
  }

  getRecipes() {
    return getDocs(
      collection(
        this.firestore,
        'business/UTJetLFyQnfthZssQoEh/recipes'
      )
    );
  }

  addTable(table:TableConstructor){
    return addDoc(collection(this.firestore,'business/UTJetLFyQnfthZssQoEh/tables'),table)
  }

  addRecipe(recipe:any){
    return addDoc(collection(this.firestore,'business/UTJetLFyQnfthZssQoEh/recipes'),recipe)
  }

  updateBill(bill:any){
    return setDoc(doc(this.firestore,'business/UTJetLFyQnfthZssQoEh/bills',bill.id),bill,{merge:true})
  }

  updateTable(table:any){
    return setDoc(doc(this.firestore,'business/UTJetLFyQnfthZssQoEh/tables',table.id),table,{merge:true})
  }

  addBillToken(){
    return updateDoc(doc(this.firestore,'business/UTJetLFyQnfthZssQoEh/settings/settings'),{billTokenNo:this.dataProvider.billToken})
  }
  addKitchenToken(){
    return updateDoc(doc(this.firestore,'business/UTJetLFyQnfthZssQoEh/settings/settings'),{kitchenTokenNo:this.dataProvider.kotToken})
  }

  updateRecipe(recipe:any){
    return updateDoc(doc(this.firestore,'business/UTJetLFyQnfthZssQoEh/recipes/'+recipe.id),recipe,{merge:true})
  }

  getBills(){
    return getDocs(collection(this.firestore,'business/UTJetLFyQnfthZssQoEh/bills'))
  }

  getBillsSubscription(){
    return collectionData(collection(this.firestore,'business/UTJetLFyQnfthZssQoEh/bills'),{idField:'id'})
  }

  getTables(){
    return getDocs(collection(this.firestore,'business/UTJetLFyQnfthZssQoEh/tables'))
  }
}
