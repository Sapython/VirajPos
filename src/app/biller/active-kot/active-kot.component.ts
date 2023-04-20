import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataProvider } from 'src/app/provider/data-provider.service';
import { Product } from '../constructors';
import { Kot } from '../Kot';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
@Component({
  selector: 'app-active-kot',
  templateUrl: './active-kot.component.html',
  styleUrls: ['./active-kot.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),
  ],
})
export class ActiveKotComponent implements OnChanges {
  kots: Kot[] = [];
  allKot: Kot[] = [];
  labels: { color: { color: string; contrast: string }; name: string }[] = [];
  activeKotIndex: number = 0;
  activeKotSubscription: Subscription = Subscription.EMPTY;
  kotNoColors: { color: string; contrast: string }[] = [
    { color: '#4dc9f6', contrast: '#000000' },
    { color: '#f67019', contrast: '#000000' },
    { color: '#f53794', contrast: '#000000' },
    { color: '#537bc4', contrast: '#000000' },
    { color: '#acc236', contrast: '#000000' },
    { color: '#166a8f', contrast: '#000000' },
    { color: '#00a950', contrast: '#000000' },
    { color: '#58595b', contrast: '#000000' },
    { color: '#8549ba', contrast: '#000000' },
  ];
  constructor(public dataProvider: DataProvider) {
    this.dataProvider.billAssigned.subscribe(() => {
      this.generateLabels();
      if (this.dataProvider.currentBill) {
        this.activeKotSubscription.unsubscribe();
        this.activeKotSubscription =
          this.dataProvider.currentBill.updated.subscribe((bill: any) => {
            this.generateLabels();
            if (!this.dataProvider.currentBill) {
              this.activeKotSubscription.unsubscribe();
              return;
            }
            if (this.dataProvider.currentBill.kots) {
              this.allKot = this.dataProvider.currentBill.kots;
              let activeKot = this.dataProvider.currentBill.kots.find(
                (kot: Kot) => kot.stage === 'active' || kot.stage === 'edit'
              );
              this.activeKotIndex =
                this.dataProvider.currentBill.kots.findIndex(
                  (kot: Kot) => kot.stage === 'active' || kot.stage === 'edit'
                );
              console.log('this.activeKotIndex', this.activeKotIndex);
              if (activeKot) {
                this.kots = [activeKot];
              } else {
                this.kots = [];
              }
            } else {
              this.kots = [];
            }
          });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateLabels();
  }

  generateLabels() {
    this.labels = [];
    if (this.dataProvider.currentBill && this.dataProvider.currentBill.kots) {
      for (let i = 0; i < this.dataProvider.currentBill.kots.length; i++) {
        this.labels.push({
          color: this.kotNoColors[i % this.kotNoColors.length],
          name: this.dataProvider.currentBill.kots[i].id,
        });
      }
    }
    console.log('this.labels', this.labels);
  }

  delete(index: Product) {
    this.dataProvider.currentBill?.removeProduct(index, this.activeKotIndex);
  }

  printKot(kot: Kot) {}

  deleteKot(kot: Kot) {}

  editKot(kot: Kot) {
    this.dataProvider.currentBill?.editKot(kot);
  }

  saveEditedKot(kot: Kot) {}

  get showImage() {
    if (this.dataProvider.currentBill) {
      if (this.dataProvider.currentBill.kots.length > 0) {
        if (this.dataProvider.currentBill.editKotMode) {
          if (this.dataProvider.currentBill.editKotMode.newKot.length > 0) {
            return false;
          }
        } else if (this.kots.length>0 && this.kots[0].products.length > 0) {
          return false;
        }
      }
    }
    return true;
  }
}
