import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '../../services/user/user.service';
import { Channel, Group, GroupService, Message } from '../../services/group/group.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../services/socket/socket.service';

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


  constructor(private router:Router, private http:HttpClient,
              private socketService:SocketService, private groupService:GroupService,
              private userService:UserService, private route:ActivatedRoute)
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

    // Get group/channel data from groupService
    this.groupService.current_group.subscribe((group) => {
      this.current_group = group;
    });
    this.groupService.current_channel.subscribe((channel) => {
      this.current_channel = channel;
    });

    // Listen for messages
    this.socketService.join_channel("test");
    this.socketService.listen_for_event("message").subscribe((data:any) => {
      console.log(data);
    });
  }


  send_message() {
    let msg = {
      message: new Message(this.current_user.username, this.message),
      group_name: this.current_group.name,
      channel_name: this.current_channel.name
    }
    this.socketService.emit(this.current_channel.name, "message", msg);
    this.message = '';
  }


}
