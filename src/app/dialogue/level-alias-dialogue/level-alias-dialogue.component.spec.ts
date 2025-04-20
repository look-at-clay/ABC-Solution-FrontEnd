import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelAliasDialogueComponent } from './level-alias-dialogue.component';

describe('LevelAliasDialogueComponent', () => {
  let component: LevelAliasDialogueComponent;
  let fixture: ComponentFixture<LevelAliasDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LevelAliasDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelAliasDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
