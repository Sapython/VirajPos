import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { debounceTime, firstValueFrom } from 'rxjs';
import { DataProvider } from 'src/app/provider/data-provider.service';
import { AlertsAndNotificationsService } from 'src/app/services/alerts-and-notification/alerts-and-notifications.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();
  settingsForm:FormGroup = new FormGroup({
    kotPrinter: new FormControl('',[Validators.required]),
    billPrinter: new FormControl('',[Validators.required]),
    projectName: new FormControl('',[Validators.required]),
    phoneNumber: new FormControl('',[Validators.required]),
    address: new FormControl('',[Validators.required]),
    gstNumber: new FormControl('',[Validators.required]),
    fssaiNo: new FormControl('',[Validators.required]),
    counterNo: new FormControl('',[Validators.required]),
    cashierName: new FormControl('',[Validators.required]),
    deviceName: new FormControl('',[Validators.required]),
    port: new FormControl('',[Validators.required]),
  })
  viewSettings:FormGroup = new FormGroup({
    smartView: new FormControl(false),
    touchMode: new FormControl(false),
  });
  configs:any[] = []
  printers:string[] = [
    'printer1',
    'printer2',
    'printer3'
  ]
  categories:any[] = []
  constructor(private indexedDb:NgxIndexedDBService,private alertify:AlertsAndNotificationsService) {
    this.viewSettings.patchValue(localStorage.getItem('viewSettings')?JSON.parse(localStorage.getItem('viewSettings')!):{})
    this.viewSettings.valueChanges.pipe(debounceTime(1000)).subscribe((data)=>{
      localStorage.setItem('viewSettings',JSON.stringify(data))
    })
  }
  cancelSettings(){
    this.cancel.emit()
  }
  
  ngOnInit(): void {
    this.indexedDb.getAll('categories').subscribe((data)=>{
      this.categories = data.map((cat:any)=> {return {...cat,selected:false,indeterminate:false,products:cat.products.map((product:any)=>{return JSON.parse(JSON.stringify({name:product.name,id:product.id,selected:false}))})}});
      console.log("category data",this.categories);
    })
    let settings:any =JSON.parse(localStorage.getItem('printerSettings') || '{}');
    if (!settings['port']){
      this.alertify.presentToast("Please set printer settings first")
      return
    }
    fetch('http://192.168.29.125:'+settings['port']+'/getPrinters',{method:'GET'}).then(res=>res.json()).then(res=>{
      console.log("PRINTERS",res)
      this.printers = res.printers
    })
    if (localStorage.getItem('printerSettings')){
      this.settingsForm.patchValue(JSON.parse(localStorage.getItem('printerSettings')!))
    }
    // this.dataProvider.currentProject.printerConifgs.forEach((config:any)=>{
    //   // this.configs.push({printerControl:new FormControl(config.printer,[Validators.required]),categoryControl:new FormControl(config.category,[Validators.required])})
    // })
    // this.databaseService.getCheckerCategories().then((res:any)=>{
    //   this.categories = []
    //   res.forEach((data:any)=>{
    //     this.categories.push({...data.data(),id:data.id,control:new FormControl(''),checked:false})
    //   })
    //   console.log("this.categories",this.categories);
    // })
  }

  setPrinters(){
    
  }

  saveSettings(){
    // filter settings value that are empty
    let settings = Object.keys(this.settingsForm.value).reduce((acc:any,curr:any)=>{
      if (this.settingsForm.value[curr]){
        acc[curr] = this.settingsForm.value[curr]
      }
      return acc
    },{})
    localStorage.setItem("printerSettings",JSON.stringify(settings))
    localStorage.setItem("kotPrinter",settings.kotPrinter)
    localStorage.setItem("billPrinter",settings.billPrinter)
    console.log("filtered settings",settings)
    
    // console.log(this.settingsForm.value,this.dataProvider.projects);
    // this.dataProvider.allProjects.forEach((project:any,index:number)=>{
    //   if (project.projectId === this.dataProvider.currentProject.projectId){
    //     // this.dataProvider.currentProject = project
    //     console.log({...project,...settings});
    //     this.dataProvider.allProjects[index] = {...project,...settings}
    //   }
    // })
    // // console.log(this.dataProvider.allProjects);
    // this.databaseService.updateProject(this.dataProvider.allProjects)
    // this.save.emit(this.settingsForm.value)
  }

  addConfig(){
    this.configs.push({printerControl:new FormControl('',[Validators.required]),categories:JSON.parse(JSON.stringify(this.categories))})
  }

  onProductChange(item:any){
    // if all products in item.products are checked then check item
    // if all products in item.products are unchecked then uncheck item
    // if some products in item.products are checked then set indeterminate to true
    let checkedProducts = item.products.filter((product:any)=>product.selected)
    if (checkedProducts.length === item.products.length){
      item.selected = true
      item.indeterminate = false
    }else if (checkedProducts.length === 0){
      item.selected = false
      item.indeterminate = false
    }else{
      item.indeterminate = true
    }
    console.log("item",item);
  }

  onCategoryChange(item:any){
    // if item.selected is true then check all products in item.products
    // if item.selected is false then uncheck all products in item.products
    if (item.selected){
      item.products.forEach((product:any)=>product.selected = true)
    }else{
      item.products.forEach((product:any)=>product.selected = false)
    }
    console.log("item",item);
  }


}
