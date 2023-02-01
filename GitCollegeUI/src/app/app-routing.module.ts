import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { DepartmentComponent } from './department/department.component';
import { CourseComponent } from './course/course.component';
import { CollegeComponent } from './college/college.component';

const routes: Routes = [
  {path:"", component:CollegeComponent,pathMatch:"full"},
  {path:"CollegeComponent", component:CollegeComponent},
  {path:"StudentComponent", component:StudentComponent},
  {path:"DepartmentComponent", component:DepartmentComponent},
  {path:"CourseComponent", component:CourseComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule]
})
export class AppRoutingModule { }
