import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDrillComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EditDrillComponent;
  let fixture: ComponentFixture<EditDrillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDrillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
