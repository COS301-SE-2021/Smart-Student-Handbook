import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartAssistModalComponent } from './smart-assist-modal.component';

describe('SmartAssistModalComponent', () => {
  let component: SmartAssistModalComponent;
  let fixture: ComponentFixture<SmartAssistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartAssistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartAssistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
