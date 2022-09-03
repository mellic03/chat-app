import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  roles:Array<string> = ["user", "group assistant", "group admin", "super admin"];

  constructor() { }

}

// The various permissions a user can have.
// Still deciding on how to implement this.
//
// User has a role (string)
//
// <component *ngIf="current_user.role == superadmin">
//   <admin-stuff></admin-stuff>
// </component>
//
//-----------------------------------------
const permissions:object = {
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
//-----------------------------------------


export class User {

  email:string;
  username:string;
  role:string = "user";
  id:number;

  constructor(username:string, email:string, id:number) {
    this.username = username;
    this.email = email;
    this.id = id;
  }
}
