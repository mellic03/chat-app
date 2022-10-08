import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  current_group:Group = this.groupService.group;
  current_group_images:any = [];

  current_channel:Channel = this.groupService.channel;
  group_name:string = ""
  channel_name:string = ""

  constructor(private router:Router,
              private route:ActivatedRoute,
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

    // Get group and channel name from route parameters
    this.route.params.subscribe((params:any) => {
      this.group_name = params.group_name;
      this.channel_name = params.channel_name;
      this.current_group = this.groupService.group;
      this.current_group_images = this.groupService.current_group_images;
      console.log(this.current_group_images);
    });


    this.groupService.current_channel.subscribe((channel:any) => {
      this.current_channel = channel;
      // console.log(channel);
    });

  }

  send_message() {

    let msg = {
      message: new Message(this.current_user.username, this.message),
      group_name: this.group_name,
      channel_name: this.channel_name
    }
    
    console.log(msg);

    this.socketService.emit("message", msg);
    this.message = '';
  }

}
