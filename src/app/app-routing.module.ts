import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../app/components/home/home.component';
import { PayrollFormComponent } from '../app/components/payroll-form/payroll-form.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'payroll-form',
    component: PayrollFormComponent
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
