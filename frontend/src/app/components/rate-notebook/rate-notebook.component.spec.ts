import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateNotebookComponent } from './rate-notebook.component';

describe('RateNotebookComponent', () => {
  let component: RateNotebookComponent;
  let fixture: ComponentFixture<RateNotebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateNotebookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
