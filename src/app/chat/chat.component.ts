import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '../services/user/user.service';
import { Channel, Group, GroupService } from '../services/group/group.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../services/socket/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  
  current_user:User = new User("", "");
  permissionlevel:number = 0; // Permission level of user in the current group

  groups:Array<Group> = [];

  current_group:Group = new Group();
  current_channel:Channel = new Channel();
  
  admin_panel_open:boolean = false;

  constructor(private router:Router,
              private route:ActivatedRoute,
              private http:HttpClient,
              private userService:UserService,
              private groupService:GroupService,
              private socketService:SocketService)
  { }

  ngOnInit(): void {
    // Get info of logged-in user. If null, redirect to login page.
    if (typeof(localStorage) !== undefined) {
      // First get info from localStorage, then get updated info from server.
      let user_info = JSON.parse(String(localStorage.getItem("user_info")));
      if (user_info != null) {
        this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
        this.http.get<User>(`http://159.196.6.181:3000/api/users/${this.current_user.username}`)
        .subscribe(user => {
          this.current_user = user;
        });
      }
      else {
        this.router.navigateByUrl("/login");
      }
    }

    this.retrieve_group_data();
  }

  // Get permission level for current group
  get_permission_level() {

    // If system-wide role is super admin, set to 3 and skip rest
    if (this.current_user.role >= 3) {
      this.permissionlevel = 3;
      return;
    }

    this.permissionlevel = 0; // reset permissionlevel
    let permissions = this.current_user.permissionlevels;
    // console.log(this.current_user)
    Object.entries(permissions).forEach(([key, value]) => {
      if (key == this.current_group.name) {
        console.log(key + " == " + this.current_group.name + "?");
        this.permissionlevel = value;
      }
    });
  }

  // Retrieve groups the user is a member of
  retrieve_group_data() {
    const username = this.current_user.username;
    const API_URL = `http://159.196.6.181:3000/api/users/${username}/groups`;

    this.http.get<Array<Group>>(API_URL).subscribe((data) => {
      this.groups = data;

      this.groupService.current_group.subscribe((group) => {
        this.current_group = group;
      });

      this.groupService.current_channel.subscribe((channel) => {
        this.current_channel = channel;
      });

      this.groupService.set_current_group(this.groups[0]);
      this.groupService.set_current_channel(this.current_group.channels[0]);
      this.open_group(this.current_group);
    });
  }

  set_group(group:Group) {
    this.groupService.set_current_group(group);
  }
  set_channel(channel:Channel) {
    this.groupService.set_current_channel(channel);
  }

  // View the channels in a group
  open_group(group:Group) {
    this.set_group(group);
    this.set_channel(group.channels[0]);
    this.get_permission_level();

    // Listen for changes to group data.
    this.socketService.listen_for_event(group.name).subscribe((group:any) => {
      if (group != false) {
        // this.groupService.set_current_group(group);
        this.current_group = group;
        this.current_channel = group.channels?.[0];
      }
    });
  }
  
  // Navigate to the chat window of a given channel
  open_channel(channel:Channel) {
    this.set_channel(channel);
  }

  // Open the settings page for the current group.
  open_admin_panel() {
    this.admin_panel_open = true;
    this.router.navigate(["/chat/groupsettings", this.current_group.name]);
  }

  close_admin_panel() {
    this.admin_panel_open = false;
    this.router.navigate(["/chat"]);
    this.retrieve_group_data();
  }

}
