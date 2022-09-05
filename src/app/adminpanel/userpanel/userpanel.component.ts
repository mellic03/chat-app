import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/user/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-userpanel',
  templateUrl: './userpanel.component.html',
  styleUrls: ['./userpanel.component.scss']
})
export class UserpanelComponent implements OnInit {

  
  new_user:User = new User("", "");

  usernames:Array<string> = [];
  user_ids:Array<string> = [];

  displayStyle = "none"; // show/hide modal


  constructor(private http:HttpClient, private formBuilder: FormBuilder) { }

  new_user_form = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {

    // Get list of users
    const USER_API = "http://159.196.6.181:3000/api/userids";
    this.http.get<Array<any>>(USER_API).subscribe(data => {
      data.forEach(object => {
        this.usernames.push(object.username);
        this.user_ids.push(object.user_id);
      })
    });
  }



  // Open modal to add channel to group
  open_modal() {
    this.displayStyle = "block";
  }
  // Close modal to add channel to group
  close_modal() {
    this.displayStyle = "none";
  }

  create_user() {

  }

}
