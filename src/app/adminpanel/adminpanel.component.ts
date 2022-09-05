import { Component, OnInit } from '@angular/core';
import { User } from '../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {

  user:User = new User("", "");

  page_title:string = "adminpanel";

  constructor(private router:Router) { }


  ngOnInit(): void {
    if (typeof(localStorage) !== undefined)
      this.user = JSON.parse(String(localStorage.getItem("user_info")));
    if (this.user?.username == null)
      this.router.navigateByUrl("/login");
    if (this.page_title == "adminpanel")
      this.page_title = "userpanel"  
  }

  set_page_title(title:string) {
    this.page_title = title;
  }

}
