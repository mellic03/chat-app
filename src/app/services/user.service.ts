import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  // Change the role of a user.
  setRole(user:User, role:number)
  {
    switch (role) {
      case (0): user.permissions = USER_PERMISSIONS;            break;
      case (1): user.permissions = GROUP_ASSISTANT_PERMISSIONS; break;
      case (2): user.permissions = GROUP_ADMIN_PERMISSIONS;     break;
      case (3): user.permissions = SUPER_ADMIN_PERMISSIONS;     break; 
    }
  }

}

const USER_PERMISSIONS:Array<number>            = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
const GROUP_ASSISTANT_PERMISSIONS:Array<number> = [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1 ];
const GROUP_ADMIN_PERMISSIONS:Array<number>     = [ 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1 ];
const SUPER_ADMIN_PERMISSIONS:Array<number>     = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];

const USER = 0;
const GROUP_ASSISTANT = 1;
const GROUP_ADMIN = 2;
const SUPER_ADMIN = 3;
const ROLES:Array<string> = ["user", "group assistant", "group admin", "super admin"];

export class User {

  email:string;
  username:string;
  role:number = USER;
  id:number;

  permissions:object = {
    // Users
    CREATE_USER: false,
    DELETE_USER: false,
    PROMOTE_TO_ASSISTANT: false,
    PROMOTE_TO_ADMIN: false,
    PROMOTE_TO_SUPER_ADMIN: false,
  
    // Groups
    CREATE_GROUP: false,
    DELETE_GROUP: false,
    ADD_USER_TO_GROUP: false,
    REMOVE_USER_FROM_GROUP: false,
  
    // Channels
    CREATE_CHANNEL: false,
    DELETE_CHANNEL: false,
    ADD_USER_TO_CHANNEL: false,
    REMOVE_USER_FROM_CHANNEL: false,
  };

  constructor(username:string, email:string, id:number) {
    this.username = username;
    this.email = email;
    this.id = id;
  }
}
