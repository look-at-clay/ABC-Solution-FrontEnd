import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfitComponent } from './view-profit.component';

describe('ViewProfitComponent', () => {
  let component: ViewProfitComponent;
  let fixture: ComponentFixture<ViewProfitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewProfitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
