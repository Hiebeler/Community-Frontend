import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LandingPage } from './pages/landing/landing.page';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { ProfilePage } from './pages/profile/profile.page';
import { VerifyPage } from './pages/verify/verify.page';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { RoutinesPage } from './pages/routines/routines.page';
import { ShoppingListPage } from './pages/shopping-list/shopping-list.page';
import { DebtsPage } from './pages/debts/debts.page';
import { DebtsHistoryPage } from './pages/debts-history/debts-history.page';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { Todos } from './pages/todos/todos';
import { PrivacyPage } from './pages/privacy-page/privacy-page';
import { ImprintPage } from './pages/imprint-page/imprint-page';
import { LandingLayoutComponent } from './layouts/landing-layout/landing-layout.component';
import { CalendarPage } from './pages/calendar/calendar.page';
import { ResetPassword } from './pages/reset-password/reset-password';
import { RequestPasswordReset } from './pages/request-password-reset/request-password-reset';

const routes: Routes = [
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: '',
        component: LandingPage,
        title: 'Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'imprint',
        component: ImprintPage,
        title:
          'Impressum | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'privacy',
        component: PrivacyPage,
        title:
          'Datenschutzrichtlinie | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'verify/:code',
        component: VerifyPage,
        title:
          'Verify | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'reset/:code',
        component: ResetPassword,
        title:
          'Password zurücksetzen | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPage,
        title:
          'Anmelden | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'register',
        component: RegisterPage,
        title:
          'Registrieren | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'reset',
        component: RequestPasswordReset,
        title:
          'Password zurücksetzen | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
    ],
    canActivate: [AuthGuard],
    data: {
      roles: ['none'],
    },
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'profile',
        component: ProfilePage,
        title:
          'Profil | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'calendar',
        component: CalendarPage,
        title:
          'Kalender | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'todos',
        component: Todos,
        title:
          'Todos | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'calendar/routines',
        component: RoutinesPage,
        title:
          'Routinen | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'shopping-list',
        component: ShoppingListPage,
        title:
          'Einkaufsliste | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'debts',
        component: DebtsPage,
        title:
          'Schulden | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
      {
        path: 'debts/history',
        component: DebtsHistoryPage,
        title:
          'Schulden Verlauf | Together - Aufgabenverwaltung für Haushalte & Communities',
      },
    ],
    canActivate: [AuthGuard],
    data: {
      roles: ['community'],
    },
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
    title:
      'Onboarding | Together - Aufgabenverwaltung für Haushalte & Communities',
    canActivate: [AuthGuard],
    data: {
      roles: ['onboarding', 'community'],
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
