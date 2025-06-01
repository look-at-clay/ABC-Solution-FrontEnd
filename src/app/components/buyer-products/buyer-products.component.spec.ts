import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerProductsComponent } from './buyer-products.component';

describe('BuyerProductsComponent', () => {
  let component: BuyerProductsComponent;
  let fixture: ComponentFixture<BuyerProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
