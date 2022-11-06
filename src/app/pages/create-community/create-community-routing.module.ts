import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCommunityPage } from './create-community.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCommunityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCommunityPageRoutingModule {}
