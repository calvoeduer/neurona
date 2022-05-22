import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeuronaFormComponent } from './components/neurona-form/neurona-form.component';

const routes: Routes = [
  {
    path: 'neurona',
    component: NeuronaFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
