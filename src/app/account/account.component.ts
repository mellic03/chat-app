import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user_info:any = {}; 

  constructor(private router:Router) { }

  ngOnInit(): void {
    if (typeof(localStorage) !== "undefined") {
      this.user_info = JSON.parse(String(localStorage.getItem("user_info")));
    }
    if (this.user_info?.username == null) {
      this.router.navigateByUrl("/login");
    }
  }

}
