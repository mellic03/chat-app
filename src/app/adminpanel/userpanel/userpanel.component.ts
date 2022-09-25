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

  constructor(private userService:UserService,
              private http:HttpClient,
              private formBuilder: FormBuilder,
              private socketService:SocketService)
  { }
  

  ngOnInit(): void {
    // Get list of users
    const USER_API = "http://159.196.6.181:3000/api/users";
    this.http.get<Array<any>>(USER_API).subscribe(users => {
      this.all_users = users;
      console.log(users);
    });

    // Get current user information
    this.current_user = JSON.parse(String(localStorage.getItem("user_info")));

    // Listen for changes to user data
    this.socketService.listen_for_event("users").subscribe((users:any) => {
      // console.log(users);
      this.all_users = users;
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
    this.userService.create_user(data.username, data.email, data.password);
  }

  // Delete user
  delete_user_form = this.formBuilder.group({
    username: new FormControl('', [Validators.required])
  });
  delete_user() {
    this.close_modal("delete");
    const data = this.delete_user_form.value;
    this.userService.delete_user(data.username);
  }

  // Update user permissions
  permission_form = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
  });
  update_user_permissions() {
    const data = this.permission_form.value;
    this.userService.set_role(data.username, data.role);
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
