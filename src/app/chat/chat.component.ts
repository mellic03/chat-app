import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { User } from '../services/user/user.service';
import { Channel, Group, GroupService, Message } from '../services/group/group.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../services/socket/socket.service';

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
  current_user:User = new User("0", "0");

  socket_listener:any;

  constructor(private router:Router, private http:HttpClient,
              private socketService:SocketService, private groupService:GroupService)
  { }

  ngOnInit(): void {

    if (typeof(localStorage) !== "undefined") {
      this.current_user = JSON.parse(String(localStorage.getItem("user_info")));
    }

    if (this.current_user?.username == null) {
      this.router.navigateByUrl("/login");
    }

    else {
      // Retrieve groups the user is a member of
      const username = this.current_user.username;
      const role = this.current_user.role;
      this.http.get<Array<Group>>(`http://159.196.6.181:3000/api/${username}/${role}/groups`)
      .subscribe((res) => {
        this.groups = res;
        // Open the first channel of the first group.
        this.current_group = this.groups[0];
        this.current_channel = this.current_group.channels[0];
        this.open_channel(this.current_channel);
      });
    }
  }


  // Set the current group to the group the user clicks
  open_group(group:Group) {
    this.current_group = group;
    this.open_channel(group.channels[0]);
  }

  // Set the current channel to the channel the user clicks
  open_channel(channel:Channel) {
    this.current_channel = channel;
    this.socketService.join_channel(channel.name);
    
    // Subscribe to channel
    this.socket_listener = this.socketService.connect()
    .subscribe((data:any) => {
      this.current_channel.messages.unshift(data.message);
    });

  }

  // Send a message to the server through sockets
  send_message():void {
    if (this.message != '') {
      const data = {
        message: new Message(this.current_user.username, this.message),
        group: this.current_group.name,
        channel: this.current_channel.name
      };

      this.socketService.emit("message", data);
      this.message = '';
    }
  }

  displayStyle = "none";

  // Open modal to add channel to group
  open_modal() {
    this.displayStyle = "block";
  }
  // Close modal to add channel to group
  close_modal() {
    this.displayStyle = "none";
  }

  // Create a new channel
  create_channel() {
    this.groupService.create_channel("");
  }
}
