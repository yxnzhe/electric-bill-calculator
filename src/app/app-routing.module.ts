import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculatorComponent } from './calculator/calculator.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FaqComponent } from './faq/faq.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'faq', component: FaqComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
