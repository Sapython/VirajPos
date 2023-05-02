import { Component, EventEmitter, Inject, Input } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  buttons:string[];
  primary:number[];
  @Input() title:string;
  @Input() description:string;
  click: EventEmitter<number> = new EventEmitter<number>();
  constructor(@Inject(DIALOG_DATA) data:{title:string,description:string,buttons:string[],primary:number[]}) {
    this.title = data.title || 'Are you sure ?';
    this.description = data.description || 'This action cannot be undone.';
    this.buttons = data.buttons || ['Cancel','Confirm'];
    this.primary = data.primary || [1];
  }
}
