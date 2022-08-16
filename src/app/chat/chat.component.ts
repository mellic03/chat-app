import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { User } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  current_group:string = "DEFAULT";
  current_user:User = new User();

  constructor(private router:Router) { }

  ngOnInit(): void {
    if (typeof(localStorage) !== "undefined") {
      this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
    }
    if (this.current_user?.username == null) {
      this.router.navigateByUrl("/login");
    }
  }

  open_group(group_name:string) {
    this.current_group = group_name;
  }

}
