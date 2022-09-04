import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme/theme.service';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  theme:string = "";

  constructor(private router:Router, private themeService:ThemeService) {

    this.themeService.theme.subscribe((current_theme) => {
      this.theme = current_theme;
    })

    // Light by default on launch
    this.themeService.theme.next("light");
  }
  
  // Clear local storage
  logout():void {
    localStorage.clear();
    this.router.navigateByUrl('login');
  }

}
