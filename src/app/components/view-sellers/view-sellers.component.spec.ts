import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSellersComponent } from './view-sellers.component';

describe('ViewSellersComponent', () => {
  let component: ViewSellersComponent;
  let fixture: ComponentFixture<ViewSellersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSellersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
