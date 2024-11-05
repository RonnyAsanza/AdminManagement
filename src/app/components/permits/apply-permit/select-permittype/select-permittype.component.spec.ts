import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPermittypeComponent } from './select-permittype.component';

describe('SelectPermittypeComponent', () => {
  let component: SelectPermittypeComponent;
  let fixture: ComponentFixture<SelectPermittypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPermittypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPermittypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
