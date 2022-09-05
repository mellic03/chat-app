import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GroupService {

  public current_group = new Subject<Group>();
  public current_channel = new Subject<Channel>();

  constructor(private http:HttpClient) { }

  API_CREATE_CHANNEL:string = "http://159.196.6.181:3000/channel/create";

  create_channel(name:string)
  {
    this.http.post<Channel>(this.API_CREATE_CHANNEL, name, {}).subscribe((ret) => {
      console.log(ret);
    })
  }

  open_group(group:Group) {
    this.current_group.next(group);
  }
  open_channel(channel:Channel) {
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
  id:number;
  
  users:Array<User> = [];
  group_assistants:Array<User> = [];
  group_admins:Array<User> = [];

  messages:Array<Message> = [];
  
  constructor(name:string = "New Channel") {
    this.name = name;
    this.id = 0;
  }
}

export class Group {
  name:string;
  id:number;

  users:Array<User> = [];
  group_assistants:Array<User> = [];
  channels:Array<Channel> = [];

  constructor(name:string = "New Group") {
    this.name = name;
    this.id = 0;
  }
}
