import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingListPageRoutingModule } from './shopping-list-routing.module';

import { ShoppingListPage } from './shopping-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ShoppingListPageRoutingModule
  ],
  declarations: [ShoppingListPage]
})
export class ShoppingListPageModule {}
