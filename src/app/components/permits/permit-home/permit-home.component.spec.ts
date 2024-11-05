import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitHomeComponent } from './permit-home.component';

describe('PermitHomeComponent', () => {
  let component: PermitHomeComponent;
  let fixture: ComponentFixture<PermitHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
