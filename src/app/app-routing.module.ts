import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttachmentsComponent } from './attachments/attachments.component';
import { EmployeesComponent } from './employees/employees.component';

const routes: Routes = [

  { path:'Attachments',  component:AttachmentsComponent},
  { path:'',  component:EmployeesComponent},

  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
