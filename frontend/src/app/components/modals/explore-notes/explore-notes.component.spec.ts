import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreNotesComponent } from './explore-notes.component';

describe('ExploreNotesComponent', () => {
  let component: ExploreNotesComponent;
  let fixture: ComponentFixture<ExploreNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
