import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelDialogueComponent } from './level-dialogue.component';

describe('LevelDialogueComponent', () => {
  let component: LevelDialogueComponent;
  let fixture: ComponentFixture<LevelDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LevelDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
