import { Component, OnInit } from '@angular/core';
import { User, UserService } from 'src/app/services/user/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-userpanel',
  templateUrl: './userpanel.component.html',
  styleUrls: ['./userpanel.component.scss']
})
export class UserpanelComponent implements OnInit {

  // Currently logged in user
  current_user:User = new User("", "");
  
  // Array of usernames and matching user ids.
  usernames:Array<string> = [];
  user_ids:Array<string> = [];

  displayStyle = "none"; // show/hide modal

  // Form for creating new user.
  new_user_form = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private userService:UserService,
              private http:HttpClient,
              private formBuilder: FormBuilder)
  { }
  

  ngOnInit(): void {
    // Get list of users
    const USER_API = "http://159.196.6.181:3000/api/users/userids";
    this.http.get<Array<any>>(USER_API).subscribe(data => {
      data.forEach(object => {
        this.usernames.push(object.username);
        this.user_ids.push(object.user_id);
      })
    });

    // Get current user information
    this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
  }



  open_modal() {
    this.displayStyle = "block";
  }
  close_modal() {
    this.displayStyle = "none";
  }

  // Send data to userService and close modal.
  create_user() {
    this.close_modal();
    const data = this.new_user_form.value;
    this.userService.create_user(data.username, data.email, data.password);
  }

}
