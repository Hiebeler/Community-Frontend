import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebtsHistoryPageRoutingModule } from './debts-history-routing.module';

import { DebtsHistoryPage } from './debts-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebtsHistoryPageRoutingModule
  ],
  declarations: [DebtsHistoryPage]
})
export class DebtsHistoryPageModule {}
