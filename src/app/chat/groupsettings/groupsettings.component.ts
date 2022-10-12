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

  // Permission level
  current_role:number = 0;

  group_name:string = "";
  group:Group = new Group();
  channels:Array<Channel> = [];
  users_of_group:Array<User> = [];
  all_users:Array<User> = [];
  

  // Selected group image for upload
  image:any;
  image_selected:boolean = false;
  show_image_success:boolean = false;
  show_image_error:boolean = false;

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
      
    // Get permission level from localStorage
    this.current_role = JSON.parse(String(localStorage.getItem("user_info"))).role;
    
    // Get list of channels in group from server
    let api_url = `https://159.196.6.181:3000/api/groups/${this.group_name}/channels`;
    this.http.get(api_url).subscribe((channels:any) => {
      this.channels = channels;
    });
    
    // Get group data from server
    api_url = `https://159.196.6.181:3000/api/groups/${this.group_name}`;
    this.http.get(api_url).subscribe((group:any) => {
      this.group = group;
    });
    
    // Get list of all users from server
    api_url = `https://159.196.6.181:3000/api/users`;
    this.http.get(api_url).subscribe((users:any) => {
      this.all_users = users;
    });

    // Get list of all users in current group from server
    api_url = `https://159.196.6.181:3000/api/groups/${this.group_name}/users`;
    this.http.get(api_url).subscribe((users:any) => {
      this.users_of_group = users;
    });
    
    // this.socketService.listen_for_event(this.group_name, "blyat").subscribe((data:any) => {
    //   console.log("Sservice");
    //   this.groupService.set_current_group(data);
    // });
    
    this.groupService.current_group.subscribe((group:any) => {
      this.group = group;
      console.log(this.group);
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

  // Remove user from group
  remove_user_from_group_form = this.formBuilder.group({
    username: new FormControl('', [Validators.required])
  });
  remove_user_from_group() {
    const data = this.remove_user_from_group_form.value;
    this.userService.remove_user_from_group(data.username, this.group_name);
  }

  // Create channel
  create_channel_form = this.formBuilder.group({
    channel_name: new FormControl('', [Validators.required])
  });
  create_channel() {
    const data = this.create_channel_form.value;
    this.userService.create_channel(data.channel_name, this.group_name);
    this.http.get(`https://159.196.6.181:3000/api/groups/${this.group_name}/channels`);
    this.create_channel_form.value.channel_name = '';
    this.create_channel_form.reset()
  }

  // Delete channel   
  delete_channel_form = this.formBuilder.group({
    channel_name: new FormControl('', [Validators.required])
  });
  delete_channel() {
    const data = this.delete_channel_form.value;
    this.userService.delete_channel(data.channel_name, this.group_name);
    // this.delete_channel_form.reset();
  }
  //-------------------------------------------------------


  on_image_select(event:any) {
    this.image_selected = true;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event:any) => {
        this.group.image = event.target.result;
      }
    }
  }

  // Upload selected image to server
  upload_image() {
    this.http.post<any>(`https://159.196.6.181:3000/api/groups/${this.group.name}/update_photo/`, {
      photo: this.group.image
    }).subscribe((response) => {
      if (response == true) {
        this.show_image_success = true;
      }
      else {
        
      }
    });
  }


}
