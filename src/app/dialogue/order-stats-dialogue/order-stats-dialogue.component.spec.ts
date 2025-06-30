import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatsDialogueComponent } from './order-stats-dialogue.component';

describe('OrderStatsDialogueComponent', () => {
  let component: OrderStatsDialogueComponent;
  let fixture: ComponentFixture<OrderStatsDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderStatsDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatsDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
