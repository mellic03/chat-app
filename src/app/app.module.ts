import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './settings/account/account.component';
import { ChatComponent } from './chat/chat.component';
import { SettingsComponent } from './settings/settings.component';
import { PreferencesComponent } from './settings/preferences/preferences.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { UserpanelComponent } from './adminpanel/userpanel/userpanel.component';
import { GrouppanelComponent } from './adminpanel/grouppanel/grouppanel.component';
import { ChatwindowComponent } from './chat/chatwindow/chatwindow.component';
import { GroupsettingsComponent } from './chat/groupsettings/groupsettings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccountComponent,
    ChatComponent,
    SettingsComponent,
    PreferencesComponent,
    AdminpanelComponent,
    UserpanelComponent,
    GrouppanelComponent,
    ChatwindowComponent,
    GroupsettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
