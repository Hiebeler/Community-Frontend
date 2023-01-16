import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'find-community',
        loadChildren: () => import('../find-community/find-community.module').then( m => m.FindCommunityPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'create-community',
        loadChildren: () => import('../create-community/create-community.module').then( m => m.CreateCommunityPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tasks',
        loadChildren: () => import('../tasks/tasks.module').then( m => m.TasksPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tasks/routines',
        loadChildren: () => import('../routines/routines.module').then( m => m.RoutinesPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'shopping-list',
        loadChildren: () => import('../shopping-list/shopping-list.module').then( m => m.ShoppingListPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'debts',
        loadChildren: () => import('../debts/debts.module').then( m => m.DebtsPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/tabs/profile',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
