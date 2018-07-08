import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDrillComponent } from './select-drill.component';

describe('SelectDrillComponent', () => {
  let component: SelectDrillComponent;
  let fixture: ComponentFixture<SelectDrillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDrillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDrillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
