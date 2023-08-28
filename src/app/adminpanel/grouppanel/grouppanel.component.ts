import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { User, UserService } from 'src/app/services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { Group, GroupService } from 'src/app/services/group/group.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-grouppanel',
  templateUrl: './grouppanel.component.html',
  styleUrls: ['./grouppanel.component.scss']
})
export class GrouppanelComponent implements OnInit {

  all_group_names:Array<string> = [];
  current_user:User = new User("", "");

  show_create_group_error:boolean = false;
  show_create_group_success:boolean = false;

  show_delete_group_success:boolean = false;

  constructor(private userService:UserService,
              private formBuilder:FormBuilder,
              private http:HttpClient,
              private groupService:GroupService,
              private socketService:SocketService) { }

  ngOnInit(): void {

    // Retrieve user info from localStorage
    if (typeof(localStorage) !== undefined)
      this.current_user = JSON.parse(String(localStorage.getItem("user_info")));

    // Retrieve list of groups from server
    let api_url = `http://127.0.0.1:3000/api/groups/group_names`;
    this.http.get(api_url).subscribe((group_names:any) => {
      this.all_group_names = group_names;
    });

    this.socketService.listen_for_event(`${this.current_user.username}/group_created`, "blyat").subscribe((group_names:any) => {
      this.all_group_names = group_names;
      this.show_create_group_success = true;
    });

    this.socketService.listen_for_event(`${this.current_user.username}/group_not_created`, "blyat").subscribe((group_names:any) => {
      this.show_create_group_error = true;
      this.show_create_group_success = false;
    });

    this.socketService.listen_for_event(`${this.current_user.username}/delete_group`, "blyat").subscribe((group_names:any) => {
      console.log(group_names);
      if (group_names != false) {
        this.all_group_names = group_names;
        this.show_delete_group_success = true;
      }
    });
  }

  // Forms
  //--------------------------------------------------------------------------- 
  create_group_form = this.formBuilder.group({
    group_name: new FormControl('', [Validators.required])
  });
  create_group() {
    const data = this.create_group_form.value;
    this.userService.create_group(data.group_name, this.current_user.username);
    this.create_group_form.reset();
  }
  create_group_clear_msg() {
    this.show_create_group_success = false;
    this.show_create_group_error = false;
  }

  delete_group_form = this.formBuilder.group({
    group_name: new FormControl('', [Validators.required])
  });
  delete_group() {
    const data = this.delete_group_form.value;
    this.userService.delete_group(data.group_name, this.current_user.username);
    this.delete_group_form.reset();
    this.all_group_names.splice(this.all_group_names.indexOf(data.group_name), 1);
  }
  delete_group_clear_msg() {
    this.show_delete_group_success = false;
  }
  //--------------------------------------------------------------------------- 

}
