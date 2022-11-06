import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  communityExists = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getLatestUser().subscribe((user) => {
      if (user) {
        if (user.communityId) {
          this.communityExists = true;
        } else {
          this.communityExists = false;
        }
      }
    });
  }

}
