import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotebookComponent } from './add-notebook.component';

describe('AddNotebookComponent', () => {
  let component: AddNotebookComponent;
  let fixture: ComponentFixture<AddNotebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNotebookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
