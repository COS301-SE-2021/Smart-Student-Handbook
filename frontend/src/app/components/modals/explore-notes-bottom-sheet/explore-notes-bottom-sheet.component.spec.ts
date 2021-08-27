import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreNotesBottomSheetComponent } from './explore-notes-bottom-sheet.component';

describe('ExploreNotesBottomSheetComponent', () => {
  let component: ExploreNotesBottomSheetComponent;
  let fixture: ComponentFixture<ExploreNotesBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreNotesBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreNotesBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
