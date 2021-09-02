import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneNoteComponent } from './clone-note.component';

describe('CloneNoteComponent', () => {
  let component: CloneNoteComponent;
  let fixture: ComponentFixture<CloneNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
