import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../services/user/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, observable } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  current_user:User = new User("", "");
  show_error_message:boolean = false;

  constructor(private http:HttpClient, private router:Router) {  }

  ngOnInit(): void {
    if (typeof(localStorage) !== undefined) {
      this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
      if (this.current_user?.username != null)
        this.router.navigateByUrl("/chat");
    }
  }

  email:string = "";
  pass:string = "";

  login(email:string, pass:string) {
    
    this.http.post<User>('http://159.196.6.181:3000/api/auth',
      {email: email, password: pass}).subscribe((res) => {
        if (res.email == "false") {
          this.show_error_message = true;
        }
        else {
          let user_info = res;
          localStorage.setItem("user_info", JSON.stringify(user_info));
          this.router.navigateByUrl("/chat");
        }
      }
    );
  }
}
