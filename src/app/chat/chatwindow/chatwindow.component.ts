import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../services/user/user.service';
import { Channel, Group, GroupService, Message } from '../../services/group/group.service';
import { SocketService } from '../../services/socket/socket.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.scss']
})
export class ChatwindowComponent implements OnInit {

  key:string = '';

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key == "Enter")
      this.send_message();
  }
  
  current_user:User = new User("", "");
  message:any = ''; // Message from user

  current_group:Group = new Group();
  current_channel:Channel = new Channel("");


  constructor(private router:Router,
              private socketService:SocketService,
              private groupService:GroupService,
              private http:HttpClient)
  { }

  ngOnInit(): void {

    // Get info of logged-in user. If null, redirect to login page.
    if (typeof(localStorage) !== undefined) {
      let user_info = JSON.parse(String(localStorage.getItem("user_info")));
      if (user_info != null) {
        this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
      }
      else {
        this.router.navigateByUrl("/login");
      }
    }


  }

  send_message() {
    let msg = {
      message: new Message(this.current_user.username, this.message),
      group_name: this.current_group.name,
      channel_name: this.current_channel.name
    }
    this.socketService.emit("message", msg);
    this.message = '';
  }

}
