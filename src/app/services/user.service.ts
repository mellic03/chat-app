import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  USER_PERMISSIONS:Array<number>            = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  GROUP_ASSISTANT_PERMISSIONS:Array<number> = [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1 ];
  GROUP_ADMIN_PERMISSIONS:Array<number>     = [ 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1 ];
  SUPER_ADMIN_PERMISSIONS:Array<number>     = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];

  USER = 0;
  GROUP_ASSISTANT = 1;
  GROUP_ADMIN = 2;
  SUPER_ADMIN = 3;
  ROLES:Array<string> = ["user", "group assistant", "group admin", "super admin"];


  constructor() { }

  // Change the role of a user.
  setRole(user:User, role:number)
  {
    switch (role) {
      case (0): user.permissions = this.USER_PERMISSIONS;            break;
      case (1): user.permissions = this.GROUP_ASSISTANT_PERMISSIONS; break;
      case (2): user.permissions = this.GROUP_ADMIN_PERMISSIONS;     break;
      case (3): user.permissions = this.SUPER_ADMIN_PERMISSIONS;     break; 
    }
  }

}



export class User {

  email:string;
  username:string;
  role:number = 0;
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
