import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutinesPage } from './routines.page';

const routes: Routes = [
  {
    path: '',
    component: RoutinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutinesPageRoutingModule {}
