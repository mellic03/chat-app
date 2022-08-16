import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }



  valid_users = [
    new User("Michael", "08/04/1999", 23, "michael@mail.com", "mpass", true),
    new User("Sophie", "13/01/2000", 22, "sophie@mail.com", "spass", true),
    new User("Aiden", "26/02/1999", 23, "aiden@mail.com", "apass", true),
  ];


}

export class User {
  username:string;
  birthdate:string;
  age:number;
  email:string;
  password:string;
  valid:boolean;

  constructor(
    username:string = "",
    birthdate:string = "",
    age:number = 0,
    email:string = "",
    password:string = "",
    valid:boolean = false
  ) {
    this.username = username;
    this.birthdate = birthdate;
    this.age = age;
    this.email = email;
    this.password = password;
    this.valid = valid;
  }
}

