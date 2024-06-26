import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgToastModule } from 'ng-angular-popup'

import { CalculatorComponent } from './calculator/calculator.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FaqComponent } from './faq/faq.component';
import { TncComponent } from './tnc/tnc.component';
import { MplusComponent } from './mplus/mplus.component';

// Importing icons

// End of importing icons

const icons = { }
@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent,
    HomepageComponent,
    FaqComponent,
    TncComponent,
    MplusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxBootstrapIconsModule.pick(icons),
    FormsModule,
    ReactiveFormsModule,
    NgToastModule,
    BsDropdownModule.forRoot(),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
