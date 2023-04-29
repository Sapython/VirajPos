import { Injectable } from '@angular/core';
declare var window:any;
@Injectable({
  providedIn: 'root'
})
export class PrintingService {

  constructor() { }

  getPrinters(){
    return window.pywebview.api.getPrinters();
  }
}
