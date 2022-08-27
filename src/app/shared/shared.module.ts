import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupbuttonComponent } from './groupbutton/groupbutton.component';
import { MessageComponent } from './message/message.component';
import { ChannelbuttonComponent } from './channelbutton/channelbutton.component';



@NgModule({
  declarations: [
    GroupbuttonComponent,
    MessageComponent,
    ChannelbuttonComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GroupbuttonComponent,
    ChannelbuttonComponent,
    MessageComponent
  ]
})
export class SharedModule { }
