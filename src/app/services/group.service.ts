import { Injectable } from '@angular/core';
import { User } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor() { }
}


export class Group {
  
  users:Array<User> = [];

}