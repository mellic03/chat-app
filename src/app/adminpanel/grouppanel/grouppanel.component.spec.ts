import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrouppanelComponent } from './grouppanel.component';

describe('GrouppanelComponent', () => {
  let component: GrouppanelComponent;
  let fixture: ComponentFixture<GrouppanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrouppanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrouppanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
