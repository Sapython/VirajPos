import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SettingsComponent } from '../settings/settings.component';
import { ChatComponent } from './chat/chat.component';
import { DataProvider } from 'src/app/provider/data-provider.service';
declare var jivo_api:any;
@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent {
  @Input() businessName: string = "Govindam Restaurant";
  @Input() currentUser: string = "Saptam";
  @Input() currentUserId: string = "GVSP";
  @Output() logout: EventEmitter<any> = new EventEmitter<any>();
  @Output() support: EventEmitter<any> = new EventEmitter<any>();
  @Output() settings: EventEmitter<any> = new EventEmitter<any>();
  @Output() lock: EventEmitter<any> = new EventEmitter<any>();
  constructor(private dialog:Dialog,private dataProvider:DataProvider){}

  openSettings(){
    const dialog = this.dialog.open(SettingsComponent);
  }

  openChat(){
    // const dialog = this.dialog.open(ChatComponent)
    jivo_api.open()
  }
}
