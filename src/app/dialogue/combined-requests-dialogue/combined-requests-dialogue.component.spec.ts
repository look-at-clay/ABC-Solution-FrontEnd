import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedRequestsDialogueComponent } from './combined-requests-dialogue.component';

describe('CombinedRequestsDialogueComponent', () => {
  let component: CombinedRequestsDialogueComponent;
  let fixture: ComponentFixture<CombinedRequestsDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CombinedRequestsDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinedRequestsDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
