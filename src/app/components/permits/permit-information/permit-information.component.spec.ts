import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitInformationComponent } from './permit-information.component';

describe('PermitInformationComponent', () => {
  let component: PermitInformationComponent;
  let fixture: ComponentFixture<PermitInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
