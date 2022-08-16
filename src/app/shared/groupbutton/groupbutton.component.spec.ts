import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupbuttonComponent } from './groupbutton.component';

describe('GroupbuttonComponent', () => {
  let component: GroupbuttonComponent;
  let fixture: ComponentFixture<GroupbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupbuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
