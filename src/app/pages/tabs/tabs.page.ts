import { Component, OnInit } from '@angular/core';
import { ShoppingService } from 'src/app/services/shopping.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  communityExists = false;
  numberOfOpenShoppingItems = 0;
  tasksForTodayExists = false;

  constructor(
    private userService: UserService,
    private shoppingService: ShoppingService,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        if (user.communityId) {
          this.communityExists = true;
          this.taskService.getTasks(new Date(), new Date()).subscribe(res => {
            this.tasksForTodayExists = res.some(element => element.assignedUsers.some(usr => usr.id === user.id) && !element.done);
          });
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
