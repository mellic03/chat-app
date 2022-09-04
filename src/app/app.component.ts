import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme/theme.service';
import { UserService } from './services/user/user.service';
import { User } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  theme:string = "";
  current_user_role:number = 0;
  logged_in:boolean = false;

  constructor(private router:Router, private themeService:ThemeService, private userService:UserService) {

    // Determine if a user is already logged in.
    if (typeof(localStorage) !== undefined) {
      if (localStorage.getItem("user_info") != null) {
        this.logged_in = true;
      }
    }

    // Observe the role of the current user. Used to show admin panel.
    this.userService.current_user_role.subscribe(data => {
      this.current_user_role = data;
    });

    // Observe the current theme set by the user. Used to switch theme.
    this.themeService.theme.subscribe((current_theme) => {
      this.theme = current_theme;
    });
    // Light by default on launch
    this.themeService.set_theme("light");

  }
  
  // Clear local storage
  logout():void {
    localStorage.clear();
    this.router.navigateByUrl('login');
  }

}
