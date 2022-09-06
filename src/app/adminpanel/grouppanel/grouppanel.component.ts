import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { Group } from 'src/app/services/group/group.service';

@Component({
  selector: 'app-grouppanel',
  templateUrl: './grouppanel.component.html',
  styleUrls: ['./grouppanel.component.scss']
})
export class GrouppanelComponent implements OnInit {

  all_groups:Array<Group> = [];

  constructor(private userService:UserService,
              private formBuilder:FormBuilder,
              private http:HttpClient) { }

  new_group_form = this.formBuilder.group({
    group_name: new FormControl('', [Validators.required])
  });

  delete_group_form = this.formBuilder.group({
    group_name: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    // Retrieve list of groups from server
    let api_url = `http://159.196.6.181:3000/api/groups`;
    this.http.get(api_url).subscribe((groups:any) => {
      this.all_groups = groups;
    });
  }

  create_group() {
    const data = this.new_group_form.value;
    this.userService.create_group(data.group_name);
  }

  delete_group() {
    const data = this.delete_group_form.value;
    this.userService.delete_group(data.group_name);
  }

}
