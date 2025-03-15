import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBuyersComponent } from './view-buyers.component';

describe('ViewBuyersComponent', () => {
  let component: ViewBuyersComponent;
  let fixture: ComponentFixture<ViewBuyersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBuyersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
