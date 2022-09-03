import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  
  @ViewChild('myModal') myModal?: HTMLElement;
  @ViewChild('myInput') myInput?: HTMLElement;

  user:User = new User("", "", 0);
  show_success_message:boolean = false;

  constructor(private router:Router, public userService:UserService) { }

  ngOnInit(): void {
    if (typeof(Storage) !== "undefined") {
      this.user = JSON.parse(String(localStorage.getItem("user_info")));
    }
    if (this.user?.username == null) {
      this.router.navigateByUrl("/login");
    }
  }

  update_user_info() {
    localStorage.setItem("user_info", JSON.stringify(this.user));
    this.show_success_message = true;
  }


}
