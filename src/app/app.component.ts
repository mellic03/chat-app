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
  current_user:User = new User("", "");
  logged_in:boolean = false;

  constructor(private router:Router, private themeService:ThemeService, private userService:UserService) {

    if (typeof(localStorage) !== "undefined") {
      if (localStorage.getItem("user_info") != null) {
        this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
        this.userService.update_current_role(this.current_user.role);
        this.logged_in = true;
      }
    }



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
    this.current_user = new User("", "");
    this.router.navigateByUrl('login');
  }

}
