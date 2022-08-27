import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  theme:string = "light";

  constructor(private router:Router) {  }
  
  logout():void {
    localStorage.clear();
    this.router.navigateByUrl('login');
  }

  switch_theme() {
    this.theme = (this.theme == "light") ? "dark" : "light";
    console.log(this.theme);
  }

}
