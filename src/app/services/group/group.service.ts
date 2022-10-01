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

  constructor(private http:HttpClient, private socketService:SocketService) { }

  set_current_group(group:Group) {
    this.current_group.next(group);
    this.group = group;
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
  users:Array<string> = [];
  channels:Array<Channel> = [];

  constructor(name:string = "") {
    this.name = name;
  }
}
