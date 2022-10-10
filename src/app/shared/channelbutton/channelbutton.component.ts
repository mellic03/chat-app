import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'channelbutton',
  templateUrl: './channelbutton.component.html',
  styleUrls: ['./channelbutton.component.scss']
})
export class ChannelbuttonComponent implements OnInit {

  @Input() name:string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
