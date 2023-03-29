import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataProvider } from '../provider/data-provider.service';
import { AlertsAndNotificationsService } from '../services/alerts-and-notification/alerts-and-notifications.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    public dataProvider: DataProvider,
    private alertify:AlertsAndNotificationsService
  ) {}

  login() {
    this.authService
      .loginWithEmailPassword(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
      .then((data) => {
        console.log(data.user);
        this.alertify.presentToast("Logged In with "+this.loginForm.value.email)
      }).catch((error)=>{
        if(error.message){
          this.alertify.presentToast(error.message)
        } else {
          this.alertify.presentToast("Some Error Occured")
        }
      });
  }
}
