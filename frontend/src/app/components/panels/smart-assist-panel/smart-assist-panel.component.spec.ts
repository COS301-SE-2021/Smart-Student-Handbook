import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartAssistPanelComponent } from './smart-assist-panel.component';

describe('SmartAssistPanelComponent', () => {
  let component: SmartAssistPanelComponent;
  let fixture: ComponentFixture<SmartAssistPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartAssistPanelComponent ],
      imports: []
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartAssistPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
