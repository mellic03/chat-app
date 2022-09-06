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

  constructor(private router:Router,
              private themeService:ThemeService) {

    // Observe any changes to the theme set by the user.
    this.themeService.theme.subscribe((current_theme) => {
      this.theme = current_theme;
    });

    // Retrieve information from local storage
    if (typeof(localStorage) !== "undefined") {
      if (localStorage.getItem("user_info") != null) {
        this.logged_in = true;

        // Retrieve user info
        this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
        
        // If user is logged in, retieve theme preference.
        // If theme preference doesn't exist, default to dark.
        this.theme = String(localStorage.getItem("theme"));
        if (this.theme != "") {
          this.themeService.set_theme(this.theme);
        }
        else {
          this.themeService.set_theme("dark");
        }
      }
    }

    // If no information exists in localStorage, default to dark theme.
    else {
      this.themeService.set_theme("dark");
    }


  }
  
  // Clear local storage
  logout():void {
    localStorage.clear();
    this.logged_in = false;
    this.current_user = new User("", "");
    this.router.navigateByUrl('login');
  }

}
