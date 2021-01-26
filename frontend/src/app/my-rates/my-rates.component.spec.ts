import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRatesComponent } from './my-rates.component';

describe('MyRatesComponent', () => {
  let component: MyRatesComponent;
  let fixture: ComponentFixture<MyRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
