import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Firestore, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { doc, getDoc, Timestamp } from '@firebase/firestore';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom, take } from 'rxjs';
import { Device } from "../biller/Device";
import { DataProvider } from '../provider/data-provider.service';
import { UserRecord } from '../structures/user.structure';
import { AlertsAndNotificationsService } from './alerts-and-notification/alerts-and-notifications.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  localUserId: string = '';
  localUserData: UserRecord | undefined;
  constructor(
    private auth: Auth,
    private dataProvider: DataProvider,
    private dbService: NgxIndexedDBService,
    private fs: Firestore,
    private alertify: AlertsAndNotificationsService
  ) {
    this.setupDevice()
    firstValueFrom(this.dbService.getByKey('business', 1)).then(
      (localData: any) => {
        if (localData && localData['userId']) {
          localData = localData as {
            userId: string;
            businessId: string;
            access: string;
            email: string;
          };
          this.localUserId = localData.userId;
          console.log('Local login found', localData);
          this.getUser(localData.userId).then((user) => {
            this.localUserData = user.data() as UserRecord;
            this.dataProvider.currentUser = user.data() as UserRecord;
          });
        } else {
          console.log('Local login not found');
        }
      }
    );
    onAuthStateChanged(this.auth, (user) => {
      this.dataProvider.isAuthStateAvaliable = true;
      console.log('this.localUserId', this.localUserId);
      if (user) {
        if (user.uid == this.localUserId) {
          this.dataProvider.loggedIn = true;
          this.dataProvider.currentFirebaseUser = user;
        } else {
          this.getUser(user.uid).then((userData) => {
            // this.dataProvider.currentUser = user.data() as UserRecord;
            this.dataProvider.loggedIn = true;
            console.log('User found', userData.data());
            if (userData.exists() && userData.data()) {
              this.dataProvider.currentUser = userData.data() as UserRecord;
              this.addCurrentUserOnLocal(userData.data() as UserRecord);
            } else {
              this.alertify.presentToast('User not found');
              this.signUpUser(user);
              signOut(this.auth);
              // signUp the user
            }
          }).catch((err)=>{
            console.log("Getting current user Error",err);
          });
        }
        console.log('Auth state found', user);
        // this.checkbusiness('1').then((deviceLoginStatus)=>{
        //   console.log("deviceLoginStatus",deviceLoginStatus);
        //   if (deviceLoginStatus){
        //     console.log("Local login found");
        //   } else {

        //     console.log("Local login not found");
        //   }
        // })
      } else {
        this.dataProvider.loggedIn = false;
        this.dataProvider.currentUser = undefined;
        console.log('No auth state found');
      }
    });
  }

  setupDevice() {
    // check if there is a device in indexedDB if yes then return it else create a new one and return it
    firstValueFrom(this.dbService.getAll('device')).then(
      (data: any) => {
        console.log('success', data);
        if (data && data.length > 0) {
          console.log('Device found', data);
          this.dataProvider.currentDevice = {
            id: data[0].deviceId,
            lastLogin: Timestamp.now(),
          };
        } else {
          let id = this.generateDeviceId().toString();
          firstValueFrom(
            this.dbService.add('device', {
              deviceId: id,
            })
          ).catch((err) => {
            console.log('Error', err);
            let id = this.generateDeviceId().toString();
          });
          this.dataProvider.currentDevice = {
            id: id,
            lastLogin: Timestamp.now(),
          };
        }
      }
    );

  }

  generateDeviceId(){
    return Math.floor(Math.random()*100000000000000000);
  }

  getUser(uid: string) {
    return getDoc(doc(this.fs, 'users/' + uid));
  }

  addCurrentUserOnLocal(user: UserRecord) {
    this.dbService
      .add('business', {
        userId: user.userId,
        businessId: user.business[0],
        access: user.business[0].access.accessLevel,
        email: user.email,
      })
      .subscribe((res) => {
        console.log('Added for local login', res);
      });
  }

  async checkbusiness(
    userId: string
  ): Promise<
    | false
    | { userId: string; businessId: string; access: string; email: string }
  > {
    let res: {
      userId: string;
      businessId: string;
      access: string;
      email: string;
    } = await firstValueFrom(this.dbService.getByKey('business', 1));
    if (res && res['userId']) {
      console.log('UserId', res);
      if (res['userId'] == userId) {
        return res;
      } else {
        this.dbService.deleteByKey('business', 1).subscribe((res) => {
          console.log('Deleted', res);
        });
        return false;
      }
    } else {
      return false;
    }
  }

  loginWithEmailPassword(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signUpUser(user:User){
    let userRecord:UserRecord = {
      business:[{
        access:{
          accessLevel:'admin',
          lastUpdated:Timestamp.now(),
          updatedBy:'controller'
        },
        businessId:'UTJetLFyQnfthZssQoEh',
        joiningDate:Timestamp.now()
      }],
      email:user.email || '',
      image:user.photoURL || '',
      name:user.displayName || '',
      lastLogin:Timestamp.now(),
      userId:user.uid
    }
    setDoc(doc(this.fs,'users/'+user.uid),userRecord)
  }
}
