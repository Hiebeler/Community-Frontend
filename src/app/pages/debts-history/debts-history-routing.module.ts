import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebtsHistoryPage } from './debts-history.page';

const routes: Routes = [
  {
    path: '',
    component: DebtsHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebtsHistoryPageRoutingModule {}
