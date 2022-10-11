import { Component, OnInit, Input } from '@angular/core';

declare var $: any;

@Component({
  selector: 'groupbutton',
  templateUrl: './groupbutton.component.html',
  styleUrls: ['./groupbutton.component.scss']
})

export class GroupbuttonComponent implements OnInit {

  @Input() group_name:string = "";
  @Input() group_image:any;

  constructor() { }
  
  ngOnInit(): void {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

}
