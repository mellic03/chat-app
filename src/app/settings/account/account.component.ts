import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket/socket.service';
import { UserService, User } from '../../services/user/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  
  @ViewChild('myModal') myModal?: HTMLElement;
  @ViewChild('myInput') myInput?: HTMLElement;

  image:any;
  image_selected:boolean = false;
  image_uploaded:boolean = false;

  roles:Array<string> = ["User", "Group Assistant", "Group Admin", "Super Admin"];

  user:User = new User("", "");
  show_success_message:boolean = false;

  show_update_user_error:boolean = false;
  show_update_user_success:boolean = false;

  constructor( private router:Router,
               public userService:UserService,
               private socketService:SocketService,
               private formBuilder:FormBuilder ) { }

  ngOnInit(): void {
    if (typeof(Storage) !== "undefined") {
      this.user = JSON.parse(String(localStorage.getItem("user_info")));
    }
    this.socketService.listen_for_event(`${this.user.username}/update_user_credentials`).subscribe((response:any) => {
      this.user.email = response.email;
      this.user.password = response.password;
    });
  }

  update_user_form = this.formBuilder.group({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  update_user_credentials() {
    console.log("E");
    const data = this.update_user_form.value;
    this.userService.update_user_credentials(data.email, data.password, this.user.username);
    this.update_user_form.reset();
  }
  update_user_clear_msg() {
    this.show_update_user_error = false;
    this.show_update_user_success = false;
  }

  on_image_select(event:any) {
    this.image_selected = true;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event:any) => {
        this.image = event.target.result;
      }
    }
  }

  upload_image() {
    const reader = new FileReader();
    this.userService.update_profile_photo(this.user.username, {image: this.image});
  }

}
