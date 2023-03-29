import { Component } from '@angular/core';
import { PopoverService } from 'src/app/popover/popover.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private popoverService: PopoverService) {}

  closePopover() {
    this.popoverService.setState(true);
  }

  
}
