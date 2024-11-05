import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageStarredComponent } from './message-starred.component';

describe('MessageStarredComponent', () => {
  let component: MessageStarredComponent;
  let fixture: ComponentFixture<MessageStarredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageStarredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageStarredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
