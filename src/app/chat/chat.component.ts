import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '../services/user/user.service';
import { Channel, Group, GroupService, Message } from '../services/group/group.service';
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

  all_groups:Array<Group> = [];

  current_group:Group = new Group();
  current_channel:Channel = new Channel("");
  
  admin_panel_open:boolean = false;

  constructor(private router:Router,
              private http:HttpClient,
              private groupService:GroupService,
              private socketService:SocketService)
  { }

  ngOnInit(): void {
    console.log("init");
    // Get info of logged-in user. If null, redirect to login page.
    if (typeof(localStorage) !== undefined) {
      // First get info from localStorage, then get updated info from server.
      let user_info = JSON.parse(String(localStorage.getItem("user_info")));
      if (user_info != null) {
        this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
        this.http.get<User>(`http://127.0.0.1:3000/api/users/${this.current_user.username}`)
        .subscribe(user => {
          this.current_user = user;
        });
      }
      else {
        this.router.navigateByUrl("/login");
      }
    }

    this.retrieve_group_data(true);
  }

  // Get permission level for current group
  get_permission_level() {
    // console.log(this.current_user);
    // If system-wide role is super admin, set to 3 and skip rest
    if (this.current_user.role >= 3) {
      this.permissionlevel = 3;
      return;
    }

    this.permissionlevel = 0; // reset permissionlevel
    let permissions = this.current_user.permission_levels;
    // console.log(this.current_user)
    Object.entries(permissions).forEach(([key, value]) => {
      if (key == this.current_group.name) {
        console.log(key + " == " + this.current_group.name + "?");
        this.permissionlevel = value;
      }
    });
  }

  // Retrieve groups the user is a member of
  retrieve_group_data(open_first:boolean = false) {
    const username = this.current_user.username;
    const API_URL = `http://127.0.0.1:3000/api/users/${username}/groups`;

    this.http.get<Array<Group>>(API_URL).subscribe((groups) => {
      console.log(groups);
      this.all_groups = groups;
      if (open_first)
        this.open_group(groups[0]);
      else {
        for (let i=0; i<groups.length; i++) {
          if (groups[i].name == this.current_group.name) {
            this.open_group(groups[i]);
            break;
          }
        }
      }
    });

    this.current_group = this.groupService.group;
    this.current_channel = this.groupService.channel;

    this.groupService.current_group.subscribe((group) => {
      this.current_group = group;
    });

    this.groupService.current_channel.subscribe((channel) => {
      this.current_channel = channel;
    });
  }

  // View the channels in a group
  open_group(group:Group) {
    this.groupService.set_current_group(group);
    this.get_permission_level();
    this.open_channel(group.channels[0]);

    // Listen for changes to group data
    this.socketService.listen_for_event(group.name, "blyat").subscribe((group:any) => {

      // If group already exists in all_groups, replace it
      for (let i=0; i<this.all_groups.length; i++) {
        if (this.all_groups[i].name == group.name) {
          this.all_groups[i] = group;
          break;
        }        
      }

      this.current_group = group;
      this.groupService.set_current_group(group);
    });
  }
  
  // Navigate to the chat window of a given channel
  open_channel(channel:Channel) {
    
    const username = this.current_user.username;
    const API_URL = `http://127.0.0.1:3000/api/users/${username}/groups`;

    this.http.get<Array<Group>>(API_URL).subscribe((groups) => {
      console.log(groups);
      this.all_groups = groups;
      for (let i=0; i<groups.length; i++) {
        if (groups[i].name == this.current_group.name) {
          this.current_group.channels = groups[i].channels;
          for (let j=0; j<groups[i].channels.length; j++)
            if (groups[i].channels[j].name == channel.name)
              channel.messages = groups[i].channels[j].messages;
          break;
        }
      }

      this.socketService.join_channel(`${this.current_group?.name}/${channel?.name}`);
      
      this.groupService.set_current_channel(channel);
      this.current_channel = channel;
      
      this.socketService.listen_for_event("message").subscribe((data:any) => {
        this.current_channel.messages.unshift(data.message);
      });
      
      if (this.current_channel != undefined)
        this.router.navigate(["/chat/chatwindow", this.current_group.name, this.current_channel.name]);
      else
        this.router.navigate(["/chat/chatwindow", this.current_group.name]);  
    });

  }

  // Open the settings page for the current group.
  open_admin_panel() {
    this.admin_panel_open = true;
    if (this.current_channel != undefined)
      this.router.navigate(["/chat/groupsettings/", this.current_group.name, this.current_channel.name]);
    else
      this.router.navigate(["/chat/groupsettings", this.current_group.name]); 
  }

  // Close the settings page for the current group.
  close_admin_panel() {
    this.admin_panel_open = false;
    if (this.current_channel != undefined)
      this.router.navigate(["/chat/chatwindow/", this.current_group.name, this.current_channel.name]);
    else
      this.router.navigate(["/chat/chatwindow/", this.current_group.name]);
  }
}
