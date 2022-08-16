import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user_info:any = {};
  show_success_message:boolean = false;

  constructor(private router:Router) { }

  ngOnInit(): void {
    if (typeof(Storage) !== "undefined") {
      this.user_info = JSON.parse(String(localStorage.getItem("user_info")));
    }
    if (this.user_info?.username == null) {
      this.router.navigateByUrl("/login");
    }
  }

  update_user_info() {
    localStorage.setItem("user_info", JSON.stringify(this.user_info));
    this.show_success_message = true;
  }

}
