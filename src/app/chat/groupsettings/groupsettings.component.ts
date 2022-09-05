import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-groupsettings',
  templateUrl: './groupsettings.component.html',
  styleUrls: ['./groupsettings.component.scss']
})
export class GroupsettingsComponent implements OnInit {

  group_name:string = '';
  channel_name:string = '';

  constructor(private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params:any) => {
      this.group_name = params.group_name;
      this.channel_name = params.channel_name;
    });
  }

  // Navigate back to /settings/chatwindow with the correct group open
  navigate_back() {
    this.router.navigate(['/chat/chatwindow', this.group_name, this.channel_name]);
  }

}
