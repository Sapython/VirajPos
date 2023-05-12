import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderViewComponent } from './reorder-view.component';

describe('ReorderViewComponent', () => {
  let component: ReorderViewComponent;
  let fixture: ComponentFixture<ReorderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReorderViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReorderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
