import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SettingsComponent } from '../settings/settings.component';

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
  constructor(private dialog:Dialog){}

  openSettings(){
    const dialog = this.dialog.open(SettingsComponent);
  }
}
