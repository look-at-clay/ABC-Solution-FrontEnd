import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationReasonsComponent } from './cancellation-reasons.component';

describe('CancellationReasonsComponent', () => {
  let component: CancellationReasonsComponent;
  let fixture: ComponentFixture<CancellationReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancellationReasonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancellationReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
