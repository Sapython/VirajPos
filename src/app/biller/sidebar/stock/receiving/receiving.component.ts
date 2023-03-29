import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-receiving',
  templateUrl: './receiving.component.html',
  styleUrls: ['./receiving.component.scss']
})
export class ReceivingComponent {
  @Input() approved:number = 40;
  @Input() pending:number = 40;
}
