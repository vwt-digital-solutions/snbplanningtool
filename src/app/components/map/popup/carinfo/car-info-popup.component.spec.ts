import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarInfoPopupComponent } from './car-info-popup.component';

describe('CarInfoPopupComponent', () => {
  let component: CarInfoPopupComponent;
  let fixture: ComponentFixture<CarInfoPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarInfoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
