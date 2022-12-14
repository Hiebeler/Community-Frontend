import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ShoppingService } from 'src/app/services/shopping.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  communityExists = false;
  numberOfOpenShoppingItems = 0;

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private shoppingService: ShoppingService
  ) { }

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

    this.shoppingService.getOpenShoppingItems().subscribe((openItems) => {
      this.numberOfOpenShoppingItems = openItems.length;
    });
  }
}
