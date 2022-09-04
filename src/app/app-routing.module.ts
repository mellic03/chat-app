import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { GrouppanelComponent } from './adminpanel/grouppanel/grouppanel.component';
import { UserpanelComponent } from './adminpanel/userpanel/userpanel.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

import { SettingsComponent } from './settings/settings.component';
import { PreferencesComponent } from './settings/preferences/preferences.component';
import { AccountComponent } from './settings/account/account.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'settings', component: SettingsComponent,
    children: [
      { path: 'account', component: AccountComponent},
      { path: 'preferences', component: PreferencesComponent}
    ]
  },
  { path: 'adminpanel', component: AdminpanelComponent,
    children: [
      { path: 'userpanel', component: UserpanelComponent },
      { path: 'grouppanel', component: GrouppanelComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
