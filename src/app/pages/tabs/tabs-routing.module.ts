import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'find-community',
        loadChildren: () => import('../find-community/find-community.module').then( m => m.FindCommunityPageModule)
      },
      {
        path: 'create-community',
        loadChildren: () => import('../create-community/create-community.module').then( m => m.CreateCommunityPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'tasks',
        loadChildren: () => import('../tasks/tasks.module').then( m => m.TasksPageModule)
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
