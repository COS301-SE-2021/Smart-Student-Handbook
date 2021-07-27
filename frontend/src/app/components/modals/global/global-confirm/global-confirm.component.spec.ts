import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalConfirmComponent } from './global-confirm.component';

describe('GlobalConfirmComponent', () => {
  let component: GlobalConfirmComponent;
  let fixture: ComponentFixture<GlobalConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
