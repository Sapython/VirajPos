import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { PopoverService } from 'src/app/popover/popover.service';
import { DataProvider } from 'src/app/provider/data-provider.service';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  closeStockListPanelSubscription:Subject<boolean> = new Subject<boolean>();
  isStockListOpen = false;
  stockConsumption:number = 0;
  constructor(private popoverService: PopoverService,public dataProvider:DataProvider,private dialog:Dialog) {
    this.closeStockListPanelSubscription.pipe(debounceTime(600)).subscribe((data)=>{
      this.isStockListOpen = data;
    })
  }

  closePopover() {
    this.popoverService.setState(true);
  }
  
  editMenu(){
    const dialog = this.dialog.open(EditMenuComponent)
    dialog.closed.subscribe((data)=>{
      // update all menus
      this.dataProvider.menus.forEach((menu)=>{
        menu.getAllData();
      })
    })
  }

  
}
