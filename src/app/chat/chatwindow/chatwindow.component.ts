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

  current_channel:Channel = new Channel();


  constructor(private router:Router, private http:HttpClient,
              private socketService:SocketService, private groupService:GroupService,
              private userService:UserService, private route:ActivatedRoute)
  { }

  ngOnInit(): void {

    // Get channel data from server
    //---------------------------------------------
    this.route.params.subscribe((params:any) => {
      let group:string = params.group_name;
      let channel:string = params.channel_name;
      const API_URL = `http://159.196.6.181:3000/api/groups/${group}/channels/${channel}/`;
      this.http.get(API_URL).subscribe((channel:any) => {
        this.current_channel = channel;
      });
    });
    //---------------------------------------------

  }


  send_message() {
    
  }


}
