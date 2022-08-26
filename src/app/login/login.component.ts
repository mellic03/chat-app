import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../services/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, observable } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  show_error_message:boolean = false;

  constructor(private http:HttpClient, private router:Router, private userService:UserService) {  }

  ngOnInit(): void {}

  email:string = "";
  pass:string = "";

  login(email:string, pass:string) {

    this.http.post<User>('http://159.196.6.181:3000/api/auth', {email: email, password: pass}).subscribe((res) => {
        if (res.valid == true) {
          let user_info = res;
          user_info.password = "";
          localStorage.setItem("user_info", JSON.stringify(user_info));
          this.router.navigateByUrl("/chat");
        }
        else {
          this.show_error_message = true;
        }
      }
    );

  }
}
