import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLevelStatsDialogueComponent } from './user-level-stats-dialogue.component';

describe('UserLevelStatsDialogueComponent', () => {
  let component: UserLevelStatsDialogueComponent;
  let fixture: ComponentFixture<UserLevelStatsDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserLevelStatsDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLevelStatsDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
