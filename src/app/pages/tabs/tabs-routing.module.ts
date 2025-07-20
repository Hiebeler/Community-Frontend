import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { TasksPage } from '../tasks/tasks.page';
import { ProfilePage } from '../profile/profile.page';
import { RoutinesPage } from '../routines/routines.page';
import { DebtsPage } from '../debts/debts.page';
import { DebtsHistoryPage } from '../debts-history/debts-history.page';
import { ShoppingListPage } from '../shopping-list/shopping-list.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        component: ProfilePage
      },
      {
        path: 'tasks',
        component: TasksPage
      },
      {
        path: 'tasks/routines',
        component: RoutinesPage
      },
      {
        path: 'shopping-list',
        component: ShoppingListPage
      },
      {
        path: 'debts',
        component: DebtsPage
      },
      {
        path: 'debts/history',
        component: DebtsHistoryPage
      },
      {
        path: '**',
        redirectTo: 'tabs/profile',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'tabs/profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
