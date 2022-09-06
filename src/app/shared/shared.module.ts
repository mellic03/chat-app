import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupbuttonComponent } from './groupbutton/groupbutton.component';
import { MessageComponent } from './message/message.component';
import { ChannelbuttonComponent } from './channelbutton/channelbutton.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuSubitemComponent } from './menu-subitem/menu-subitem.component';



@NgModule({
  declarations: [
    GroupbuttonComponent,
    MessageComponent,
    ChannelbuttonComponent,
    MenuItemComponent,
    MenuSubitemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GroupbuttonComponent,
    ChannelbuttonComponent,
    MessageComponent,
    MenuItemComponent,
    MenuSubitemComponent
  ]
})
export class SharedModule { }
