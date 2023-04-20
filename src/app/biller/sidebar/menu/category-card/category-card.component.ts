import { Component, Input } from '@angular/core';
import { DataProvider } from 'src/app/provider/data-provider.service';
import { Category } from 'src/app/structures/general.structure';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent {
  @Input() category:Category|undefined;
  constructor(public dataProvider:DataProvider){}
}
