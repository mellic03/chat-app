import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { User } from '../services/user.service';
import { Group, Message } from '../services/group.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  key:string = '';

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key == "Enter")
      this.send_message();
  }

  current_group:Group = new Group();
  groups:Array<Group> = [];
  current_user:User = new User();

  message:any = '';
  message_array:Array<string> = [];
  ioConnection:any;

  constructor(private router:Router, private http:HttpClient, private socketService:SocketService) { }

  ngOnInit(): void {
    this.initToConnection();

    if (typeof(localStorage) !== "undefined") {
      this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
    }

    if (this.current_user?.username == null) {
      this.router.navigateByUrl("/login");
    }
    
    else {
      // Retrieve groups this user is a part of
      this.http.get<Array<Group>>(`http://159.196.6.181:3000/api/${this.current_user.username}/groups`).subscribe((res) => {
        this.groups = res;
        this.current_group = this.groups[0];
      });
    }
  }

  initToConnection() {
    this.ioConnection = this.socketService.getMessage()
    .subscribe((message:any) => {
      this.current_group.messages.unshift(message.message);
    })
  }

  open_group(group:Group) {
    this.current_group = group;
  }

  send_message():void
  {
    if (this.message != '')
    {
      const msg = {
        message: new Message(this.current_user.username, this.message),
        group: this.current_group.name
      };

      this.socketService.send(msg);
      this.message = '';
    }
  }

}
