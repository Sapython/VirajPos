import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { DataProvider } from './provider/data-provider.service';
import { AuthService } from './services/auth.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import {
  provideRemoteConfig,
  getRemoteConfig,
} from '@angular/fire/remote-config';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { DatabaseService } from './services/database.service';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { AlertsAndNotificationsService } from './services/alerts-and-notification/alerts-and-notifications.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GetDataService } from './services/get-data.service';
const dbConfig: DBConfig = {
  name: 'Viraj',
  version: 1,
  objectStoresMeta: [
    {
      store: 'business',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'userId', keypath: 'userId', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: false } },
        {
          name: 'businessId',
          keypath: 'businessId',
          options: { unique: false },
        },
        { name: 'access', keypath: 'access', options: { unique: false } },
      ],
    },
    {
      store:'device',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'deviceId', keypath: 'deviceId', options: { unique: true } },
      ]
    },
    {
      // for TableConstructor
      store: 'tables',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
        { name: 'tableNo', keypath: 'tableNo', options: { unique: false } },
        { name: 'bill', keypath: 'bill', options: { unique: false } },
        { name: 'maxOccupancy', keypath: 'maxOccupancy', options: { unique: false } },
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'occupiedStart', keypath: 'occupiedStart', options: { unique: false } },
        { name: 'billPrice', keypath: 'billPrice', options: { unique: false } },
        { name: 'status', keypath: 'status', options: { unique: false } },
        { name: 'type', keypath: 'type', options: { unique: false } },
      ]
    },
    {
      store: 'categories',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'products', keypath: 'products', options: { unique: false } },
        { name: 'averagePrice', keypath: 'averagePrice', options: { unique: false } },
      ]
    },
  ],
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatButtonModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    NgxIndexedDBModule.forRoot(dbConfig),
    MatSnackBarModule
  ],
  providers: [
    DataProvider,
    AuthService,
    ScreenTrackingService,
    UserTrackingService,
    DatabaseService,
    AlertsAndNotificationsService,
    GetDataService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
