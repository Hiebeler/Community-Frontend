import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebtsPage } from './debts.page';

const routes: Routes = [
  {
    path: '',
    component: DebtsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebtsPageRoutingModule {}
