import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ShoppingService } from 'src/app/services/shopping.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, IonicModule],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  communityExists = false;
  numberOfOpenShoppingItems = 0;
  tasksForTodayExists = false;

  constructor(
    private userService: UserService,
    private shoppingService: ShoppingService,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        if (user.communities.length > 0) {
          this.communityExists = true;
          this.subscriptions.push(this.taskService.getTasks(new Date(), new Date()).subscribe(res => {
            this.tasksForTodayExists = res.some(element => element.assignedUsers.some(usr => usr.id === user.id) && !element.done);
          }));
        } else {
          this.communityExists = false;
        }
      }
    }));

    this.subscriptions.push(this.shoppingService.getOpenShoppingItems().subscribe((openItems) => {
      this.numberOfOpenShoppingItems = openItems.length;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
