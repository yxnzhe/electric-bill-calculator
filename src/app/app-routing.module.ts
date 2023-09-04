import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculatorComponent } from './calculator/calculator.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FaqComponent } from './faq/faq.component';
import { TncComponent } from './tnc/tnc.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'tnc', component: TncComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
