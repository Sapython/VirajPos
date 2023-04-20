import { Component } from '@angular/core';
import { PopoverService } from 'src/app/popover/popover.service';
import { DataProvider } from 'src/app/provider/data-provider.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private popoverService: PopoverService,public dataProvider:DataProvider) {}

  closePopover() {
    this.popoverService.setState(true);
  }

  
}
