import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreNoteListBottomsheetComponent } from './explore-note-list-bottomsheet.component';

describe('ExploreNoteListBottomsheetComponent', () => {
  let component: ExploreNoteListBottomsheetComponent;
  let fixture: ComponentFixture<ExploreNoteListBottomsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreNoteListBottomsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreNoteListBottomsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
