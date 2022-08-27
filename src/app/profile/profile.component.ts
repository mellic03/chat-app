import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

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
