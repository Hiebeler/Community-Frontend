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
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { TasksPage } from './pages/tasks/tasks.page';
import { RoutinesPage } from './pages/routines/routines.page';
import { ShoppingListPage } from './pages/shopping-list/shopping-list.page';
import { DebtsPage } from './pages/debts/debts.page';
import { DebtsHistoryPage } from './pages/debts-history/debts-history.page';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
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
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'profile',
        component: ProfilePage,
      },
      {
        path: 'tasks',
        component: TasksPage,
      },
      {
        path: 'tasks/routines',
        component: RoutinesPage,
      },
      {
        path: 'shopping-list',
        component: ShoppingListPage,
      },
      {
        path: 'debts',
        component: DebtsPage,
      },
      {
        path: 'debts/history',
        component: DebtsHistoryPage,
      },
    ],
    canActivate: [AuthGuard],
    data: {
      roles: ['community'],
    }
  },
  {
    path: 'find-community',
    component: FindCommunityPage,
    canActivate: [AuthGuard],
    data: {
      roles: ['onboarding'],
    },
  },
  {
    path: 'create-community',
    component: CreateCommunityPage,
    canActivate: [AuthGuard],
    data: {
      roles: ['onboarding'],
    },
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['onboarding'],
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
