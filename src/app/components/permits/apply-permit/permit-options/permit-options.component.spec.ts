import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitOptionsComponent } from './permit-options.component';

describe('PermitOptionsComponent', () => {
  let component: PermitOptionsComponent;
  let fixture: ComponentFixture<PermitOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
