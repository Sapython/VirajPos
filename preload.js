// const { contextBridge } = require('electron');

// New code implmentation

var printer = require("@thiagoelg/node-printer");
let EscPosEncoder = require('esc-pos-encoder');

class customEncoder extends EscPosEncoder {
  initPrint(){
    this.initialize()
    return this
  }
  h1(text){
    return this.height(2)
    .width(2)
    .size('small').align('center')
    .line(text)
    .newline()
    .size('normal').align('left').width(1).height(1)
  }
  h2(text,align='center'){
    return this.bold(true).align(align).size('normal').line(text).bold(false).align('left')
  }
  hr(double = false){
    return this.rule({style:double ? 'double' : 'single'})
  }
  productTable(products){
    // products contains name, price, quantity, total
    let table = [
      { width: 26, marginRight: 2, align: 'left' },
      { width: 5, marginRight: 2, align: 'center' },
      { width: 5, marginRight: 2, align: 'center' },
      { width: 5, align: 'right' }
    ]
    let data = []
    data.push([
      (encoder) => encoder.bold().text('Item').bold(),
      (encoder) => encoder.bold().align('center').text('Qty').bold(),
      (encoder) => encoder.bold().align('center').text('Price').bold(),
      "Amount"
    ])
    products.forEach(product => {
      data.push([product.name, product.quantity.toString(), "Rs."+product.price.toString(), "Rs."+product.amount.toString()])
    });
    return this.table(table, data)
  }
  lineIf(text,align = "left",prefix=null){
    if (text){
      return this.align(align).line((prefix ? prefix : '')+text)
    } else {
      return this
    }
  }
  end(id){
    return this.newline()
    .newline()
    .align('center')
    .qrcode('https://fbms-shreeva-demo.web.app/'+id)
    .align('left')
    .newline()
    .newline()
    .newline()
    .newline()
    .newline()
    .cut()
    .encode()
  }
  terms(terms){
    // terms is of type string[]
    this.align('center').line('Terms & Conditions').align('left').newline()
    terms.forEach((term,index) => {
      this.line((index+1).toString()+': '+term)
    })
    return this
  }

  discounts(disocunts){
    // discounts is of type {name: string, value: number, type: string, rate: number}[]
    this.align('center').h2('Discounts','left')
    let discountsColumns = [['Discount','Rate','Amount']]
    disocunts.forEach((discount,index) => {
      discountsColumns.push([discount.name, discount.rate.toString()+'%',"Rs."+discount.value.toString()])
    })
    return this.table([
        { width: 20, marginRight: 2, align: 'left' },
        { width: 10, marginRight: 2, align: 'center' },
        { width: 10, align: 'right' }
      ],discountsColumns
    ).newline()
  }

  taxes(taxes){
    // taxes is of type {name: string, value: number, rate: number}[]
    this.align('center').h2('Taxes','left')
    let taxesColumns = [['Tax','Rate','Amount']]
    taxes.forEach((tax,index) => {
      taxesColumns.push([tax.name, tax.rate.toString()+'%',"Rs."+tax.value.toString()])
    })
    return this.table([
        { width: 20, marginRight: 2, align: 'left' },
        { width: 10, marginRight: 2, align: 'center' },
        { width: 10, align: 'right' }
      ],taxesColumns
    ).newline()
  }
}
console.log(printer.getPrinters());
let businessDetails = {
  name: 'Viraj',
  address: 'Near Viraj',
  phone: '1234567890',
  fssai: 'FSSAI1234567890',
  gst: 'GSTI1234567890',
};
let billdata = {
  id: 1,
  products: [
    {
      id: '1',
      name: 'Product 1 kdjhsfjhsdkfjhskjdhfkjshdjkh',
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
    {
      id: '2',
      name: 'Product 2',
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
    {
      id: '2',
      name: 'Product 2',
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
    {
      id: '2',
      name: 'Product 2',
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
    "This is a note",
    "This is a note",
    "This is a note",
    "This is a note",
  ],
  businessDetails: businessDetails,
};
kotData ={
  'id':1,
  'businessDetails': businessDetails,
  "table": 1,
  'billNo': 1,
  "date": new Date().toLocaleDateString(),
  "time": new Date().toLocaleTimeString(),
  "mode":"firstChargeable",
  "products":[
      {
          "id":"1",
          "name":"Item 1 kfjhdskjfhkjdshfjsdkfjhsdkjhkjdhfkjsdhfkjhsdkfjhs",
          "instruction":"",
          "quantity":2,
      },
      {
          "id":"1",
          "name":"Item 2",
          "instruction":"spicy",
          "quantity":2,
      },
      {
          "id":"1",
          "name":"Item 3",
          "instruction":"",
          "quantity":2,
      },
      {
          "id":"1",
          "name":"Item 4",
          "instruction":"",
          "quantity":2,
      },
  ]
}
function printBill(billdata){
  let encoder = new customEncoder({width:48});
  let result = encoder
  .initPrint()
  .h1(billdata.businessDetails.name)
  .lineIf(billdata.businessDetails.address,'center',"Add: ",)
  .lineIf(billdata.businessDetails.phone,'center',"Phone: ",)
  .lineIf(billdata.businessDetails.fssai,'center',"FSSAI: ",)
  .lineIf(billdata.businessDetails.gst,'center',"GST: ",)
  .hr()
  .h2("Customer details",'left')
  .lineIf(billdata.customerDetail.name,'left','Name:')
  .lineIf(billdata.customerDetail.phone,'left','Phone:')
  .lineIf(billdata.customerDetail.address,'left','Add:')
  .lineIf(billdata.customerDetail.gst,'left','Gst:')
  .hr()
  .table(
    [
      {
        width:20,
        marginRight:2,
        align:'left'
      },
      {
        width:20,
        align:'right'
      },
    ],[
      ['Date: '+billdata.date,'Time: '+billdata.time],
      ['Token: '+billdata.tokenNo,'Bill: '+billdata.billNo],
      ['Cashier: '+billdata.cashierName,'Mode: '+billdata.mode],
    ]
  )
  .hr()
  .productTable(billdata.products)
  .hr()
  .table(
    [
        { marginRight: 2, align: 'left' },
        { align: 'right' }
    ], 
    [
        [ 
          'Total Qty:'+billdata.totalQuantity, 
           (encoder) => encoder.bold().text("Sub: Rs."+billdata.subtotal).bold()  
        ],
    ]
  )
  .hr()
  .discounts(billdata.discount)
  .hr()
  .taxes(billdata.tax)
  .hr(true)
  .table(
    [
        { marginRight: 2, align: 'left' },
        { align: 'right' }
    ], 
    [
        [ (enc)=> enc.bold(true).text("Grand Total: "), (encoder) => encoder.bold(true).height(2).width(2).size('normal').text("Rs."+billdata.grandTotal).bold(false).width(1).height(1) ],
    ]
  )
  .hr()
  .h2(billdata.note)
  .terms(billdata.notes)
  .end();
  var promiseResolve, promiseReject;
  var promise = new Promise(function(resolve, reject){
    promiseResolve = resolve;
    promiseReject = reject;
  });
  printer.printDirect({
    data:result,
    success:promiseResolve,
    error:promiseReject,
    printer:'POS-80C'
  });
  return promise;
}

function printKot(kotData){
  let encoder = new customEncoder({width:75});
  let result = encoder
  .initPrint()
  .h1()
}
printBill(billdata)
// contextBridge.exposeInMainWorld('printing', {
//   printBill: () => printBill,
//   printKot: () => printKot,
// })
