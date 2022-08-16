import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'groupbutton',
  templateUrl: './groupbutton.component.html',
  styleUrls: ['./groupbutton.component.scss']
})

export class GroupbuttonComponent implements OnInit {

  @Input() group_name:string = "";

  constructor() { }

  ngOnInit(): void {

  }

}
