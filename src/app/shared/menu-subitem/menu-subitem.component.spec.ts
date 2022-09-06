import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSubitemComponent } from './menu-subitem.component';

describe('MenuSubitemComponent', () => {
  let component: MenuSubitemComponent;
  let fixture: ComponentFixture<MenuSubitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuSubitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSubitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
