import { Injectable } from '@angular/core';
import { User } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor() { }
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
  
  constructor(name:string = "New Channel") {
    this.name = name;
  }
}

export class Group {
  name:string;
  users:Array<User> = [];
  group_assistants:Array<User> = [];
  messages:Array<Message> = [];

  constructor(name:string = "New Group") {
    this.name = name;
  }
}
