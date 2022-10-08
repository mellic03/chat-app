import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.service';
import { Subject } from 'rxjs';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})

export class GroupService {

  current_group = new Subject<Group>();
  current_channel = new Subject<Channel>();

  public group = new Group();
  public channel = new Channel();

  public current_group_images:any = {};

  constructor(private http:HttpClient, private socketService:SocketService) { }

  set_current_group(group:Group) {
    this.current_group.next(group);
    this.group = group;
    this.group.users.forEach((user) => {
      this.current_group_images[user.username] = user.profile_photo;
    });
  }

  set_current_channel(channel:Channel) {
    this.current_channel.next(channel);
    this.channel = channel;
  }
}

export class Message {
  sender:string;
  content:string;
  constructor(username:string, content:string) {
    this.sender = username;
    this.content = content;
  }
}

export class Channel {
  name:string;
  parent_group:string = "";
  users:Array<string> = [];
  messages:Array<Message> = [];

  constructor(name:string = "") {
    this.name = name;
  }
}

export class Group {
  name:string;
  users:Array<any> = [];
  channels:Array<Channel> = [];

  constructor(name:string = "") {
    this.name = name;
  }
}
