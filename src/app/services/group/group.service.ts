import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})

export class GroupService {

  constructor(private http:HttpClient) { }

  API_CREATE_CHANNEL:string = "http://159.196.6.181:3000/channel/create";

  create_channel(name:string)
  {
    this.http.post<Channel>(this.API_CREATE_CHANNEL, name, {}).subscribe((ret) => {
      console.log(ret);
    })
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
  group_assistants:Array<User> = [];
  group_admins:Array<User> = [];

  messages:Array<Message> = [];
  
  constructor(name:string = "New Channel") {
    this.name = name;
  }
}

export class Group {
  name:string;
  users:Array<User> = [];
  group_assistants:Array<User> = [];
  channels:Array<Channel> = [];

  constructor(name:string = "New Group") {
    this.name = name;
  }
}
