import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, Input } from '@angular/core';

@Component({
  selector: 'app-reorder-view',
  templateUrl: './reorder-view.component.html',
  styleUrls: ['./reorder-view.component.scss']
})
export class ReorderViewComponent {
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
  constructor(@Inject(DIALOG_DATA) public items:string[],public dialogRef:DialogRef){}
}
