import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupbuttonComponent } from './groupbutton/groupbutton.component';



@NgModule({
  declarations: [
    GroupbuttonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GroupbuttonComponent
  ]
})
export class SharedModule { }
