import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideLeftRoRight, slider } from './route-animations';
import { GetDataService } from './services/get-data.service';
import { DataProvider } from './provider/data-provider.service';
import { PrintingService } from './services/printing.service';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import {
  fadeInDownOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
} from 'angular-animations';
declare var pywebview: any;
declare var jivo_api: any;
declare var jivo_config: any;
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {customEncoder} from './customEncoder';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation(),
    fadeOutUpOnLeaveAnimation(),
  ],
})
export class AppComponent implements OnInit {
  title = 'Viraj';
  test: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  availableVoices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | undefined;
  speechSynthesis: SpeechSynthesis | undefined;
  textToSpeak = 'विराज को 1240 रुपए मिले';
  volume: number = 1;
  rate: number = 0.8;
  pitch: number = 1;
  pdfSource:SafeResourceUrl = '';
  constructor(private sanitizer:DomSanitizer,
    public dataProvider: DataProvider,
    private dataService: GetDataService,
    private printingService: PrintingService)
  {
    console.log("pywebview",customEncoder);
    // console.log("pywebview",window,this.printingService.getPrinters());
    // window.addEventListener('load', (data) => {
    //   console.log(document.querySelector("jdiv[class*='main_']"));
    //   let chatFinderInterval = setInterval(() => {
    //     let element = document.getElementById('jcont');
    //     if (element) {
    //       let response = jivo_api.setCustomData([
    //         {
    //           title: 'User',
    //           content: this.dataProvider.currentUser?.userId,
    //           user: {
    //             name: this.dataProvider.currentUser?.name,
    //             email: this.dataProvider.currentUser?.email,
    //             image: this.dataProvider.currentUser?.image,
    //             business: this.dataProvider.currentUser?.business,
    //             device: this.dataProvider.currentDevice,
    //           },
    //         },
    //       ]);
    //       console.log('chat response', response);
    //       clearInterval(chatFinderInterval);
    //     }
    //   }, 500);
    // });
  }

  checkPrinting() {
    // printing.print()
  }

  hideChatWindow() {
    console.log(document.querySelector('jdiv'));
  }

  ngOnInit() {
    this.speechSynthesis = window.speechSynthesis;
    this.availableVoices = this.getVoices();
    console.log('Voices', this.availableVoices);

    // this.speak("Hello World");
    let businessDetails:any = {
      name: 'Viraj',
      address: 'Near Viraj',
      phone: '1234567890',
      fssai: 'FSSAI1234567890',
    };
    let billdata:any = {
      id: 1,
      products: [
        {
          id: '1',
          name: 'Product 1',
          price: 30,
          quantity: 2,
          amount: 60,
        },
        {
          id: '2',
          name: 'Product 2',
          price: 30,
          quantity: 2,
          amount: 60,
        },
      ],
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      grandTotal: 1000,
      tax: [
        {
          name: 'CGST',
          value: 50,
          rate: 5,
        },
        {
          name: 'CGST',
          value: 50,
          rate: 5,
        },
      ],
      totaltax: {
        value: 100,
        rate: 10,
      },
      discount: [
        {
          name: 'ZomatoPro',
          value: 10,
          type: 'percentage',
          rate: 5,
        },
        {
          name: 'Veena',
          value: 50,
          type: 'percentage',
          rate: 5,
        },
      ],
      subtotal: 1000,
      totalQuantity: 5,
      cashierName: 'Neeraj',
      mode: 'takeaway',
      table: 1,
      billNo: 1,
      tokenNo: 1,
      customerDetail: {
        name: 'Neeraj',
        phone: '1234567890',
        address: 'Near Viraj',
        gst: 'GST1234567890',
      },
      note: 'This is a special note',
      notes: [
        {
          title: 'Note 1',
          description: 'Description 1',
        },
        {
          title: 'Note 2',
          description: 'Descriptdf dsfion 1',
        },
        {
          title: 'Note 3',
          description: 'kdjfhsdkjhf 1',
        },
        {
          title: 'Note 4',
          description: 'fjghkdjhfgkj 1',
        },
      ],
      businessDetails: businessDetails,
    };
    for (let index = 0; index < 50; index++) {
      billdata.products.push({
        id: index.toString(),
        name: `Product ${index}`,
        price: 30,
        quantity: 2,
        amount: 60,
      })
    }
    // predict the total height of the document based upon the data available in a bill
    let totalHeight = 10;
    let headers:any[] = [[
      {
        content: 'Retail Invoice',
        styles: { halign: 'center' },
      },
    ]]
    if (billdata.businessDetails.name) {
      totalHeight += 2;
      headers.push(
        [
          {
            content: billdata.businessDetails.name,
            styles: { halign: 'center', fontStyle: 'bold' },
          },
        ],
      )
    }
    if (billdata.businessDetails.address) {
      totalHeight += 2;
      if (billdata.businessDetails.address.length > 40) {
        totalHeight +=
          2 * Math.ceil(billdata.businessDetails.address.length / 50);
      }
      headers.push([
        {
          content: billdata.businessDetails.address,
          styles: { halign: 'center', fontStyle: 'bold' },
        },
      ])
    }
    if (billdata.businessDetails.phone) {
      totalHeight += 2;
      headers.push([
        {
          content: billdata.businessDetails.phone,
          styles: { halign: 'center', fontStyle: 'bold' },
        },
      ])
    }
    if (billdata.businessDetails.gst) {
      headers.push([
        {
          content: 'FSSAI: ' + billdata.businessDetails.fssai,
          styles: { halign: 'center', fontStyle: 'bold' },
        },
      ])
    }
    if (billdata.businessDetails.fssai) {
      totalHeight += 2;
      headers.push([
        {
          content: 'FSSAI: ' + billdata.businessDetails.fssai,
          styles: { halign: 'center', fontStyle: 'bold' },
        },
      ])
    }
    totalHeight += 10; // for hr
    let counter = []
    // if (billdata.date || billdata.time) {
    //   totalHeight += 20;
    // }
    // if (billdata.billNo || billdata.tokenNo) {
    //   totalHeight += 20;
    // }
    // if (billdata.mode || billdata.table) {
    //   totalHeight += 20;
    // }
    // if (billdata.cashierName) {
    //   totalHeight += 20;
    // }
    // let customerCounter:RowInput[] = []
    // if (billdata.customerDetail.name) {
    //   totalHeight += 20;
    //   customerCounter.push([
    //     {
    //       content: 'Name: ' + billdata.customerDetail.name,
    //       styles: { halign: 'left' },
    //     },
    //   ])
    // }
    // if (billdata.customerDetail.phone) {
    //   totalHeight += 20;
    //   customerCounter.push([
    //     {
    //       content: 'Phone: ' + billdata.customerDetail.phone,
    //       styles: { halign: 'left' },
    //     },
    //   ])
    // }
    // if (billdata.customerDetail.address) {
    //   totalHeight += 20;
    //   customerCounter.push([
    //     {
    //       content: 'Address: ' + billdata.customerDetail.address,
    //       styles: { halign: 'left' },
    //     },
    //   ])
    // }
    // if (billdata.customerDetail.gst) {
    //   totalHeight += 20;
    //   customerCounter.push([
    //     {
    //       content: 'GST: ' + billdata.customerDetail.gst,
    //       styles: { halign: 'left' },
    //     },
    //   ])
    // }
    // if (billdata.customerDetail.email) {
    //   totalHeight += 20;
    //   customerCounter.push([
    //     {
    //       content: 'Email: ' + billdata.customerDetail.email,
    //       styles: { halign: 'left' },
    //     },
    //   ])
    // }
    // totalHeight += 30; // for hr
    // let productLabels = []
    // if (billdata.products.length) {
    //   totalHeight += 30;
    //   totalHeight += 20 * billdata.products.length;
    // }
    // totalHeight += 30; // for hr
    // if (billdata.totalQuantity || billdata.subtotal) {
    //   totalHeight += 30;
    // }
    // if (billdata.discount.length) {
    //   totalHeight += 30; // for discounts heading
    //   totalHeight += 20 * billdata.discount.length;
    // }
    // if (billdata.tax.length) {
    //   totalHeight += 30; // for tax heading
    //   totalHeight += 20 * billdata.tax.length;
    // }
    // if (billdata.grandTotal) {
    //   totalHeight += 40;
    // }
    // if (billdata.note) {
    //   totalHeight += 30;
    //   if (billdata.note.length > 40) {
    //     totalHeight += 30 * Math.ceil(billdata.note.length / 50);
    //   }
    // }
    // if (billdata.notes.length) {
    //   totalHeight += 30; // for notes heading
    //   totalHeight += 20 * billdata.notes.length;
    // }
    // totalHeight += 30; // for hr
    // let DOC_HEIGHT = 100;
    console.log(totalHeight);
    let doc = new jsPDF('p', 'mm', [80,totalHeight]);
    let headerHeight = 0;
    autoTable(doc, {
      body: headers,
      theme: 'plain',
      margin:{
        horizontal:2.5,
        vertical:0
      },
      styles: {
        fontSize: 10,
      },
      startY: 10,
      didDrawPage: (doc) => {
        headerHeight = doc.cursor?.y || 0;
      },
    });
    // doc.line(2.5, headerHeight, 75, headerHeight, 'S');
    // autoTable(doc, {
    //   body: customerCounter,
    //   theme: 'plain',
    //   margin:{
    //     horizontal:2.5,
    //     vertical:0
    //   },
    //   startY: headerHeight,
    //   styles: {
    //     fontSize: 10,
    //     halign: 'left',
    //   },
    //   didDrawPage: (doc) => {
    //     headerHeight = doc.cursor?.y || 0;
    //   },
    // });
    // doc.line(2.5, headerHeight, 75, headerHeight);
    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: 'Date: ' + billdata.date,
    //         styles: { halign: 'left' },
    //       },
    //       {
    //         content: 'Time: ' + billdata.time,
    //         styles: { halign: 'right' },
    //       },
    //     ],
    //     [
    //       {
    //         content: 'Token: ' + billdata.tokenNo,
    //         styles: { halign: 'left' },
    //       },
    //       {
    //         content: 'Bill: ' + billdata.billNo,
    //         styles: { halign: 'right', fontStyle: 'bold' },
    //       },
    //     ],
    //     [
    //       {
    //         content: 'Cashier: ' + billdata.cashierName,
    //         styles: { halign: 'left' },
    //       },
    //       {
    //         content: 'Mode: ' + billdata.mode,
    //         styles: { halign: 'right' },
    //       },
    //     ],
    //   ],
    //   theme: 'plain',
    //   startY: headerHeight,
    //   margin:{
    //     horizontal:2.5,
    //     vertical:0
    //   },
    //   styles: {
    //     fontSize: 10,
    //   },
    //   didDrawPage: (doc) => {
    //     headerHeight = doc.cursor?.y || 0;
    //   },
    // });
    // doc.line(2.5, headerHeight, 75, headerHeight);
    // autoTable(doc, {
    //   head: [['Item', 'Qty', 'Price', 'Amt']],
    //   body: billdata.products.map((product:any) => {
    //     return [
    //       product.name,
    //       product.quantity,
    //       product.price,
    //       product.quantity * product.price,
    //     ];
    //   }),
    //   theme:'plain',
    //   startY: headerHeight,
    //   margin:{
    //     horizontal:2.5,
    //     vertical:0
    //   },
    //   styles: {
    //     fontSize: 10,
    //   },
    //   didDrawPage: (doc) => {
    //     headerHeight = doc.cursor?.y || 0;
    //   },
    // });
    // doc.line(2.5, headerHeight, 75, headerHeight);
    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: 'Total Qty: ' + billdata.totalQuantity,
    //         styles: { halign: 'left' },
    //       },
    //       {
    //         content: 'Sub Total: ' + billdata.subtotal,
    //         styles: { halign: 'right' },
    //       },
    //     ],
    //   ],
    //   theme: 'plain',
    //   startY: headerHeight,
    //   margin:{
    //     horizontal:2.5,
    //     vertical:0
    //   },
    //   styles: {
    //     fontSize: 10,
    //   },
    //   didDrawPage: (doc) => {
    //     headerHeight = doc.cursor?.y || 0;
    //   },
    // });
    // doc.line(2.5, headerHeight, 75, headerHeight);
    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: 'Grand Total: '+ billdata.grandTotal,
    //         styles: { halign: 'right', fontStyle: 'bold' },
    //       },
    //     ],
    //   ],
    //   theme: 'plain',
    //   startY: headerHeight,
    //   margin:{
    //     horizontal:2.5,
    //     vertical:0
    //   },
    //   styles: {
    //     fontSize: 10,
    //   },
    //   didDrawPage: (doc) => {
    //     headerHeight = doc.cursor?.y || 0;
    //   },
    // });
    // doc.line(2.5, headerHeight, 75, headerHeight);
    // doc.setFontSize(8);
    // doc.setFont('','bold')
    // headerHeight+=5;
    // doc.text(billdata.note, 40, headerHeight);
    // billdata.notes.forEach((note:any) => {
    //   headerHeight += 5;
    //   doc.text(note.title, 40, headerHeight);
    // })
    // // get total page height by checking all pages
    // let totalDocHeight:number = 0;
    // let offset = 150;
    // if(doc.internal.pages.length>1){
    //   totalDocHeight = (((doc.internal.pages.length-1) * DOC_HEIGHT) - offset) + headerHeight;
    // } else {
    //   totalDocHeight = headerHeight;
    // }
    // console.log(totalDocHeight,headerHeight);

    // convert this whole jspdf document to canvas
    let canvas = 
    // // alert(headerHeight);
    // // doc.save('table.pdf');
    this.pdfSource =  this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'bill.pdf' }));
  }

  getVoices() {
    if (this.speechSynthesis) {
      let voices = this.speechSynthesis.getVoices();
      if (!voices.length) {
        let utterance = new SpeechSynthesisUtterance('');
        speechSynthesis.speak(utterance);
        voices = speechSynthesis.getVoices();
      }
      return voices;
    } else {
      return [];
    }
  }

  speak(text: string, volume: number = 1, rate: number = 1, pitch: number = 1) {
    if (this.selectedVoice) {
      let speakData = new SpeechSynthesisUtterance();
      speakData.volume = volume; // From 0 to 1
      speakData.rate = rate; // From 0.1 to 10
      speakData.pitch = pitch; // From 0 to 2
      speakData.text = text;
      speakData.lang = 'en';
      speakData.voice = this.selectedVoice;
      speechSynthesis.speak(speakData);
    }
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
