import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageArchivedComponent } from './message-archived.component';

describe('MessageArchivedComponent', () => {
  let component: MessageArchivedComponent;
  let fixture: ComponentFixture<MessageArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageArchivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
