import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadetComponent } from './cadet.component';

describe('CadetComponent', () => {
  let component: CadetComponent;
  let fixture: ComponentFixture<CadetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
