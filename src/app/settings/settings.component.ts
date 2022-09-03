import { Component, OnInit } from '@angular/core';
import { User } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  user:User = new User("", "", 0);

  constructor(private router:Router) { }


  ngOnInit(): void {
    if (typeof(localStorage) !== undefined)
      this.user = JSON.parse(String(localStorage.getItem("user_info")));
  }


}
