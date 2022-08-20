import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupbuttonComponent } from './groupbutton/groupbutton.component';
import { MessageComponent } from './message/message.component';



@NgModule({
  declarations: [
    GroupbuttonComponent,
    MessageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GroupbuttonComponent,
    MessageComponent
  ]
})
export class SharedModule { }
