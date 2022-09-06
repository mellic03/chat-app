import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'menu-subitem',
  templateUrl: './menu-subitem.component.html',
  styleUrls: ['./menu-subitem.component.scss']
})
export class MenuSubitemComponent implements OnInit {
  @Input() title:string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
