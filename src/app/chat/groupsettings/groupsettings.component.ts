import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GroupService, Group, Channel } from 'src/app/services/group/group.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { User, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-groupsettings',
  templateUrl: './groupsettings.component.html',
  styleUrls: ['./groupsettings.component.scss']
})
export class GroupsettingsComponent implements OnInit {

  group_name:string = "";
  channels:Array<Channel> = [];
  channel_to_delete:string = '';
  channel_to_add_to:string = '';
  channel_to_remove_from:string = '';

  users:Array<User> = [];
  selected_user_name:string = '';

  constructor(private route:ActivatedRoute,
              private http:HttpClient,
              private groupService:GroupService,
              private userService:UserService,
              private socketService:SocketService)
  { }

  ngOnInit(): void {
    this.socketService.join_channel("admin");
    
    this.route.params.subscribe((params:any) => {
      this.group_name = params.group_name;
    });

    // Get list of channels in group from server
    let api_url = `http://159.196.6.181:3000/api/groups/${this.group_name}/channels`;
    this.http.get(api_url).subscribe((channels:any) => {
      this.channels = channels;
      this.channel_to_delete = channels[0].name;
      this.channel_to_add_to = channels[0].name;
    });

    // Get list of users in group from server
    api_url = `http://159.196.6.181:3000/api/groups/${this.group_name}/users`;
    this.http.get(api_url).subscribe((users:any) => {
      this.users = users;
      console.log(users);
    });
  }

  delete_channel(channel_name:string) {
    console.log("Deleting " + channel_name);
    this.userService.delete_channel(channel_name);
  }


}
