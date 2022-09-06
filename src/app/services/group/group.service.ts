import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GroupService {

  current_group = new Subject<Group>();
  current_channel = new Subject<Channel>();

  constructor(private http:HttpClient) { }

  set_current_group(group:Group) {
    this.current_group.next(group);
  }

  set_current_channel(channel:Channel) {
    this.current_channel.next(channel);
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
  users:Array<User> = [];
  messages:Array<Message> = [];

  constructor(name:string = "") {
    this.name = name;
  }
}

export class Group {
  name:string;
  users:Array<User> = [];
  channels:Array<Channel> = [];

  constructor(name:string = "") {
    this.name = name;
  }
}
