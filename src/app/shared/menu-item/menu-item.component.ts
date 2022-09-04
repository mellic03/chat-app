import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() title:string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
