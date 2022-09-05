import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserService } from '../services/user/user.service';
import { Channel, Group } from '../services/group/group.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  current_user:User = new User("", "");
  
  groups:Array<Group> = [];
  current_group:Group = new Group();
  current_channel:Channel = new Channel();
  
  constructor(private router:Router,
              private http:HttpClient,
              private userService:UserService)
  { }

  ngOnInit(): void {

    if (typeof(localStorage) !== "undefined") {
      this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
      this.userService.update_current_role(this.current_user.role);
    }
    if (this.current_user?.username == null) {
      this.router.navigateByUrl("/login");
    }

    else {
      // Retrieve groups the user is a member of
      const username = this.current_user.username;
      const role = this.current_user.role;
      const API_URL = `http://159.196.6.181:3000/api/${username}/${role}/groups`;
      this.http.get<Array<Group>>(API_URL).subscribe((res) => {
        this.groups = res;
        // Open the first channel of the first group.
        this.current_group = this.groups[0];
        this.current_channel = this.current_group.channels[0];
      });
    }

  }

  // View the channels in a group
  open_group(group_name:string) {
    this.groups.forEach(group => {
      if (group.name == group_name) {
        this.current_group = group;
        // When switching groups, switch to first channel in that group.
        this.current_channel = this.current_group.channels[0];
        this.nav_to_channel(this.current_channel.name);
      }
    });
  }

  // Open the settings page for the current group.
  // Channel name is also passed as param so when navigating
  // backwards the correct chatwindow will still be open.
  nav_to_group_settings() {
    this.router.navigate(["/chat/groupsettings", this.current_group.name, this.current_channel.name]);
  }

  // Navigate to the chat window for a given channel
  nav_to_channel(channel_name:string) {
    this.current_channel = new Channel(channel_name);
    this.router.navigate(["/chat/chatwindow", this.current_group.name, this.current_channel.name]);
  }
}
