import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { User } from '../services/user.service';
import { Group } from '../services/group.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  current_group:Group = new Group();
  groups:Array<Group> = [];
  current_user:User = new User();

  constructor(private router:Router, private http:HttpClient) { }

  ngOnInit(): void {
    if (typeof(localStorage) !== "undefined") {
      this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
    }
    if (this.current_user?.username == null) {
      this.router.navigateByUrl("/login");
    }
    else {
      this.http.post<Array<Group>>('http://localhost:3000/api/users/groups', this.current_user).subscribe((res) => {
        this.groups = res;
        this.current_group = this.groups[0];
      });
    }
  }

  open_group(group:Group) {
    this.current_group = group;
  }

}
