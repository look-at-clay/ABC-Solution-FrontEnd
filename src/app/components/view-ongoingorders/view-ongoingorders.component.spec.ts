import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOngoingordersComponent } from './view-ongoingorders.component';

describe('ViewOngoingordersComponent', () => {
  let component: ViewOngoingordersComponent;
  let fixture: ComponentFixture<ViewOngoingordersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewOngoingordersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOngoingordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
