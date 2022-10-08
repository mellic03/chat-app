import { Component, OnInit } from '@angular/core';
import { User, UserService } from 'src/app/services/user/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-userpanel',
  templateUrl: './userpanel.component.html',
  styleUrls: ['./userpanel.component.scss']
})
export class UserpanelComponent implements OnInit {

  // Currently logged in user
  current_user:User = new User("", "");
  
  // Array of usernames and matching user ids.
  all_users:Array<User> = [];

  create_user_displayStyle:string = "none"; // show/hide modal
  delete_user_displayStyle:string = "none";
  
  selected_user:string = '';
  selected_role:string = '';

  show_create_user_error:boolean = false;
  show_create_user_success:boolean = false;
  show_delete_user_success:boolean = false;

  group_names:Array<string> = [];

  constructor(private userService:UserService,
              private http:HttpClient,
              private formBuilder: FormBuilder,
              private socketService:SocketService)
  { }
  

  ngOnInit(): void {
    // Get list of users
    let api_url = "http://159.196.6.181:3000/api/users";
    this.http.get<Array<any>>(api_url).subscribe(users => {
      this.all_users = users;
      console.log(users);
    });

    // Get current user information
    this.current_user = JSON.parse(String(localStorage.getItem("user_info")));

    // Get list of group names;
    api_url = `http://159.196.6.181:3000/api/groups/group_names`;
    this.http.get(api_url).subscribe((group_names:any) => {
      this.group_names = group_names;
    });

    // Listen for changes to user data
    this.socketService.listen_for_event(`${this.current_user.username}/create_user`, "blyat").subscribe((users:any) => {
      console.log(users);
      if (users == false) {
        this.show_create_user_error = true;
        this.show_create_user_success = false;
      }
      else {
        this.all_users = users;
        this.show_create_user_error = false;
        this.show_create_user_success = true;
      }
    });
    this.socketService.listen_for_event(`${this.current_user.username}/delete_user`, "blyat").subscribe((users:any) => {
      if (users == false) {
        console.log(false);
        this.show_delete_user_success = false;
      }
      else {
        console.log(true);
        this.all_users = users;
        this.show_delete_user_success = true;
      }
    });
  }

  // Forms
  //----------------------------------------------------
  // Create user
  new_user_form = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  create_user() {
    this.close_modal("create");
    const data = this.new_user_form.value;
    this.userService.create_user(data.username, data.email, data.password, this.current_user.username);
    this.new_user_form.reset();
  }
  create_user_clear_msg() {
    this.show_create_user_error = false;
    this.show_create_user_success = false;
  }

  // Delete user
  delete_user_form = this.formBuilder.group({
    username: new FormControl('', [Validators.required])
  });
  delete_user() {
    this.close_modal("delete");
    const data = this.delete_user_form.value;
    this.userService.delete_user(data.username, this.current_user.username);
    this.delete_user_form.reset();
  }
  delete_user_clear_msg() {
    this.show_delete_user_success = false;
  }

  // Update user permissions
  permission_form = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    group: new FormControl('', [])
  });
  update_user_permissions() {
    const data = this.permission_form.value;
    if ((data.role == 1 || data.role == 2) && (data.group == '')) {
      return;
    }
    else {
      console.log("E");
      this.userService.set_role(data.username, data.role, data.group);
      this.permission_form.reset();
    }
  }
  //----------------------------------------------------


  open_modal(modal:string) {
    if (modal == "create") {
      this.create_user_displayStyle = "block";
    }
    else if (modal == "delete") {
      this.delete_user_displayStyle = "block";
    }
  }

  close_modal(modal:string) {
    if (modal == "create") {
      this.create_user_displayStyle = "none";
    }
    else if (modal == "delete") {
      this.delete_user_displayStyle = "none";
    }
  }


}
