import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PeerService } from './services/peer/peer.service';
import { ThemeService } from './services/theme/theme.service';
import { UserService } from './services/user/user.service';
import { User } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  theme:string = "light";
  current_user:User = new User("", "");
  logged_in:boolean = false;

  constructor(private router:Router,
              private themeService:ThemeService,
              private userService:UserService,
              private peerService:PeerService) {

    this.initialise();
  }

  // Initialise app
  initialise() {
    // Observe any changes to the theme set by the user.
    this.themeService.theme.subscribe((current_theme) => {
      this.theme = current_theme;
    });

    this.userService.current_user.subscribe(user => {
      this.current_user = user;
    });

    // Retrieve information from local storage
    if (localStorage.getItem("user_info") != null) {
      this.logged_in = true;

      // Retrieve user info
      this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
      
      // If user is logged in, retieve theme preference.
      // If theme preference doesn't exist, default to light.
      this.theme = String(localStorage.getItem("theme"));
      if (this.theme != '' && this.theme != null && this.theme != undefined) {
        this.themeService.set_theme(this.theme);
      }
      else {
        console.log("theme not set, defaulting to light");
        this.themeService.set_theme("light");
      }
    }

    // If nothing in localStorage
    else {
      this.themeService.set_theme('dark');
    }

    // Send peer id to server
    this.peerService.update_peer_id();
  }

  
  // Clear local storage
  logout():void {
    this.themeService.set_theme("dark");
    localStorage.clear();
    this.logged_in = false;
    this.current_user = new User("", "");
    this.router.navigateByUrl('login');
  }

}
