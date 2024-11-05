import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTrashComponent } from './message-trash.component';

describe('MessageTrashComponent', () => {
  let component: MessageTrashComponent;
  let fixture: ComponentFixture<MessageTrashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageTrashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
