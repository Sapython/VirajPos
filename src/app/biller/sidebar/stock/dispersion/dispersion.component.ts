import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dispersion',
  templateUrl: './dispersion.component.html',
  styleUrls: ['./dispersion.component.scss']
})
export class DispersionComponent {
  @Input() approved:number = 40;
  @Input() pending:number = 40;
}
