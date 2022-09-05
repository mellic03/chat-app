import { Component, OnInit } from '@angular/core';
import { User } from '../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  user:User = new User("", "");

  page_title:string = "Settings";

  constructor(private router:Router) { }


  ngOnInit(): void {
    if (typeof(localStorage) !== undefined)
      this.user = JSON.parse(String(localStorage.getItem("user_info")));
    if (this.user?.username == null)
      this.router.navigateByUrl("/login");
    if (this.page_title == "Settings")
      this.page_title = "Account";
  }

  set_page_title(title:string) {
    this.page_title = title;
  }

}
