import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindCommunityPage } from './find-community.page';

const routes: Routes = [
  {
    path: '',
    component: FindCommunityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindCommunityPageRoutingModule {}
