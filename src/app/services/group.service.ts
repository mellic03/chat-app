import { Injectable } from '@angular/core';
import { User } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor() { }
}


export class Group {
  
  name:string = '';
  users:Array<User> = [];
  messages:Array<Message> = [];

}

export class Message {
  sender:string = '';
  content:string = '';
}