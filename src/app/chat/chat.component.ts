import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { User } from '../services/user.service';
import { Channel, Group, Message } from '../services/group.service';
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

  message:any = ''; // Message from user
  
  current_group:Group = new Group();
  current_channel:Channel = new Channel();
  groups:Array<Group> = [];
  current_user:User = new User("0", "0", 0);
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
        // Open the first channel of the first group.
        this.current_group = this.groups[0];
        this.current_channel = this.current_group.channels[0];
      });
    }
  }

  // Connect to server
  initToConnection() {
    this.ioConnection = this.socketService.getMessage()
    .subscribe((message:any) => {
      this.current_channel.messages.unshift(message.message);
    })
  }

  // Set the current group to the group the user clicks
  open_group(group:Group) {
    this.current_group = group;
  }
  
  // Set the current channel to the channel the user clicks
  open_channel(channel:Channel) {
    this.current_channel = channel;
  }

  // Send a message to the server using sockets
  send_message():void {
    if (this.message != '') {
      const msg = {
        message: new Message(this.current_user.username, this.message),
        group: this.current_group.name,
        channel: this.current_channel.name
      };

      this.socketService.send(msg);
      this.message = '';
    }
  }

}
