import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskPage } from './task.page';

const routes: Routes = [
  {
    path: '',
    component: TaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskPageRoutingModule {}
