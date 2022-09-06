import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GroupService, Group, Channel } from 'src/app/services/group/group.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { User, UserService } from 'src/app/services/user/user.service';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-groupsettings',
  templateUrl: './groupsettings.component.html',
  styleUrls: ['./groupsettings.component.scss']
})
export class GroupsettingsComponent implements OnInit {

  group_name:string = "";
  group:Group = new Group();

  channels:Array<Channel> = [];
  channel_to_delete:string = '';
  channel_to_remove_from:string = '';

  user_to_add_to_channel:string = '';
  channel_to_add_user_to:string = '';

  users:Array<User> = [];
  selected_user_name:string = '';

  constructor(private route:ActivatedRoute,
              private http:HttpClient,
              private groupService:GroupService,
              private userService:UserService,
              private socketService:SocketService,
              private formBuilder:FormBuilder)
  { }

  ngOnInit(): void {
    this.route.params.subscribe((params:any) => {
      this.group_name = params.group_name;
    });


    this.socketService.listen(this.group_name).subscribe((group:any) => {
      this.group = group;
    });

    // Get list of channels in group from server
    let api_url = `http://159.196.6.181:3000/api/groups/${this.group_name}/channels`;
    this.http.get(api_url).subscribe((channels:any) => {
      this.channels = channels;
    });

    // Get list of all users from server
    api_url = `http://159.196.6.181:3000/api/users/users`;
    this.http.get(api_url).subscribe((users:any) => {
      this.users = users;
    });


  }


  // Forms
  //-------------------------------------------------------
  // Add user to channel
  add_user_to_channel_form = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    channel_name: new FormControl('', [Validators.required])
  });
  add_user_to_channel() {
    const data = this.add_user_to_channel_form.value;
    this.userService.add_user_to_channel(data.username, this.group_name, data.channel_name);
  }

  // Remove user from channel
  remove_user_from_channel_form = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    channel_name: new FormControl('', [Validators.required])
  });
  remove_user_from_channel() {
    const data = this.remove_user_from_channel_form.value;
    this.userService.remove_user_from_channel(data.username, this.group_name, data.channel_name);
  }

  // Create channel
  create_channel_form = this.formBuilder.group({
    channel_name: new FormControl('', [Validators.required])
  });
  create_channel() {
    const data = this.create_channel_form.value;
    this.userService.create_channel(data.channel_name, this.group_name);
    this.http.get(`http://159.196.6.181:3000/api/groups/${this.group_name}/channels`);
  }

  // Delete channel   
  delete_channel_form = this.formBuilder.group({
    channel_name: new FormControl('', [Validators.required])
  });
  delete_channel() {
    const data = this.delete_channel_form.value;
    this.userService.delete_channel(data.channel_name, this.group_name);
  }
  //-------------------------------------------------------

}
