import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component'
import { PayrollFormComponent } from './components/payroll-form/payroll-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PayrollFormComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
