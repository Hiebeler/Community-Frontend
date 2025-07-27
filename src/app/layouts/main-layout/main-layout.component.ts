import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CalendarIcon,
  CheckCheckIcon,
  CircleUserRoundIcon,
  LucideAngularModule,
  ShoppingCartIcon,
  WalletIcon,
} from 'lucide-angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ShoppingService } from 'src/app/services/shopping.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, LucideAngularModule],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  readonly calendarIcon = CalendarIcon;
  readonly todosIcon = CheckCheckIcon;
  readonly cartIcon = ShoppingCartIcon;
  readonly debtsIcon = WalletIcon;
  readonly profileIcon = CircleUserRoundIcon;

  subscriptions: Subscription[] = [];

  numberOfOpenShoppingItems = 0;
  tasksForTodayExists = false;

  constructor(
    private authService: AuthService,
    private shoppingService: ShoppingService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.authService.activeUserId.subscribe((userId) => {
        if (userId) {
          this.subscriptions.push(
            this.taskService
              .getTasks(new Date(), new Date())
              .subscribe((res) => {
                this.tasksForTodayExists = res.some(
                  (element) =>
                    element.assignedUsers.some((usr) => usr.id === userId) &&
                    !element.done
                );
              })
          );
        }
      })
    );

    this.subscriptions.push(
      this.shoppingService.getOpenShoppingItems().subscribe((openItems) => {
        this.numberOfOpenShoppingItems = openItems.length;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
