import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkItemPopupComponent } from './work-item-popup.component';

describe('WorkItemPopupComponent', () => {
  let component: WorkItemPopupComponent;
  let fixture: ComponentFixture<WorkItemPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkItemPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkItemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
