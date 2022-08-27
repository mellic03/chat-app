import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelbuttonComponent } from './channelbutton.component';

describe('ChannelbuttonComponent', () => {
  let component: ChannelbuttonComponent;
  let fixture: ComponentFixture<ChannelbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelbuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
