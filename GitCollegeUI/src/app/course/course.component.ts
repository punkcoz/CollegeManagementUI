import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  collegeList: any =[];
  departmentList: any =[];
  getCourseDepartmentAndCollege: any = [];
  courseSearch = "";
  paginationPageNumber = 0;
  itemsPerPage = 0;
  buttonMode: boolean = true;
  courseModalTital = ""
  

  courseObj: any = {
    courseId:0,
    departmentId:0,
    courseName: "",
    collegeId: 0
  };


  addMode: boolean = true;

  constructor(private waiter: HttpClient) {
    this.getAllCourseDepartmentAndCollege();
   }

  ngOnInit(): void {
    this.paginationPageNumber = 1;
    this.itemsPerPage = 10;
    this.GetCollegeForCourse();
    // this.GetDepartmentForCource();
  }
// Fetch College and Department 
  getAllCourseDepartmentAndCollege() {
  this.waiter.get("https://localhost:44377/api/Course/GetCourseDepartmentAndColleges").subscribe((res: any) => {
    this.getCourseDepartmentAndCollege = res.result;
    console.log(this.getCourseDepartmentAndCollege);
  },
    (error: any) => {
      console.log(error)
    });
}

GetCollegeForCourse(){
  this.waiter.get("https://localhost:44377/api/College/GetAllCollege").subscribe((res:any)=>{
    this.collegeList = res.result;
    console.log(res.result);
    
  })
}

GetDepartmentForCourse($event: any){
  let collegeID = $event.target.value;
  this.waiter.get("https://localhost:44377/api/Department/GetAllDepartment/" + collegeID).subscribe((res:any)=>{
    this.departmentList= res.result;
    console.log(res.result);
  })
}
//End 

addButton() {
  this.addMode = true;
  this.courseObj = {};
  this.courseModalTital = "Add Course"
}

addNewCourse() {
  // console.log("for add", this.collegeDetailsObj);
  this.waiter.post(`${environment.URL}Course/AddNewCourse`, this.courseObj).subscribe((res: any) => {
    this.courseObj ={};
    console.log(res);
    this.getAllCourseDepartmentAndCollege();
    if (res.result == true) {
      swal2.fire({
        icon: 'success',
        title: 'New Course Added'
      });
    }
    else {
      swal2.fire({
        icon: 'warning',
        title: 'Error occurred. Fix the following error and try again',
        text: res.errors.join(", ")
      });
    }
  },
    (error: any) => {
      console.log(error)
    });
}

error(){
  swal2.fire({
    icon: 'warning',
        title: 'Error occurred. Fix the following error and try again',
        text: "Fill Proper Details"
  })
}

updateCourseRecord(item: any) {
  this.buttonMode = false;
  this.courseModalTital = "Update Course"
  this.courseObj = {};
  this.courseObj.collegeId = item.collegeid;
  this.courseObj.collegename = item.collegename;
  this.courseObj.departmentName = item.departmentname;
  this.courseObj.departmentId = item.departmentid;
  this.courseObj.courseName = item.coursename;
  this.courseObj.courseId = item.courseid;
  console.log(item)
}

updateCourse(courseObj: any) {
  this.waiter.put("https://localhost:44377/api/Course/UpdateCourse", this.courseObj).subscribe((res: any) => {  
  console.log(res.result);
    this.courseObj = res.result;
    this.getAllCourseDepartmentAndCollege();
    if (res.result == true) {
      swal2.fire({
        icon: 'success',
        title: 'Course Record Has Updated'
      });
    }
    else {
      swal2.fire({
        icon: 'warning',
        title: 'Error occurred. Fix the following error and try again',
        text: res.errors.join(", ")
      });
    }
  })

}

DeleteCourse(item: any) {
  swal2.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.waiter.delete("https://localhost:44377/api/Course/DeleteCourse/" + item.courseid).subscribe((res: any) => {
        console.log(res);    
        this.getAllCourseDepartmentAndCollege();
    });      
      swal2.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })      
}

}
