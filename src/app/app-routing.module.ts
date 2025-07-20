import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LandingPage } from './pages/landing/landing.page';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { FindCommunityPage } from './pages/find-community/find-community.page';
import { CreateCommunityPage } from './pages/create-community/create-community.page';
import { TaskPage } from './modals/task/task.page';
import { ProfilePage } from './pages/profile/profile.page';
import { VerifyPage } from './pages/verify/verify.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [AuthGuard],
    data: {
      roles: ['none'],
    },
  },
  {
    path: 'register',
    component: RegisterPage,
    canActivate: [AuthGuard],
    data: {
      roles: ['none'],
    },
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['community'],
    },
  },
  {
    path: 'find-community',
    component: FindCommunityPage,
    canActivate: [AuthGuard],
    data: {
      roles: ['user'],
    },
  },
  {
    path: 'create-community',
    component: CreateCommunityPage,
    canActivate: [AuthGuard],
    data: {
      roles: ['user'],
    },
  },
  {
    path: 'task',
    component: TaskPage,
    canActivate: [AuthGuard],
    data: {
      roles: ['community'],
    },
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [AuthGuard],
    data: {
      roles: ['user'],
    },
  },
  {
    path: 'verify/:code',
    component: VerifyPage,
    canActivate: [AuthGuard],
    data: {
      roles: ['none'],
    },
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
