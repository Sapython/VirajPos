import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent {
  @Input() stageNumber: number = 2;
  @Input() version = '1.0.0';
  @Output() upgrade:EventEmitter<void> = new EventEmitter();
  // generate list of stages
  stages: string[] = Array.from(Array(this.stageNumber).keys()).map((i) => `Stage ${i + 1}`);
}
