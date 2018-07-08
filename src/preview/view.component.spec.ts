import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDrillComponent } from './view.component';

describe('ViewComponent', () => {
  let component: ViewDrillComponent;
  let fixture: ComponentFixture<ViewDrillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDrillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDrillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
