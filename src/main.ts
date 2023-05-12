import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  
window.addEventListener('*',(data)=>{
    console.log(data);
  })
// todo: step 1 => pos encoder load 
// todo: step 2 => print and file command
// todo: step 3 => ipcCommunication
// todo: step 4 => login