import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['none']
    }
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['none']
    }
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['community']
    }
  },
  {
    path: 'find-community',
    loadChildren: () => import('./pages/find-community/find-community.module').then( m => m.FindCommunityPageModule)
  },
  {
    path: 'create-community',
    loadChildren: () => import('./pages/create-community/create-community.module').then( m => m.CreateCommunityPageModule),
  },
  {
    path: 'task',
    loadChildren: () => import('./modals/task/task.module').then( m => m.TaskPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['user']
    }
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
