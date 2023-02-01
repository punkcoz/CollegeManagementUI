import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  getDepartmentAndCollege: any = [];
  departmentSearch = "";
  paginationPageNumber = 0;
  itemsPerPage = 0;
  buttonMode: boolean = true;
  departmentObj: any = {
    departmentId:0,
    departmentName: "",
    collegeId: ""
  };
  constructor(private waiter: HttpClient) {
    this.GetDepartmentAndColleges();
  }

  ngOnInit(): void {
    this.paginationPageNumber = 1;
    this.itemsPerPage = 10;
  }

  // Fetch College and Department 
GetDepartmentAndColleges() {
    this.waiter.get("https://localhost:44377/api/Department/GetDepartmentAndColleges").subscribe((res: any) => {
      this.getDepartmentAndCollege = res.result;
      console.log(this.getDepartmentAndCollege);
    },
      (error: any) => {
        console.log(error)
      });
  }
//End 

// to check select value is coming or not
  // (change)="collegeselect($event)"
// collegeselect(item:any){
// console.log(item.target.value);

//   }
//check end

// Function To Add New Department
  addButton() {
    this.buttonMode = true;
    this.departmentObj = {};
  }

  addDepartment() {
    console.log("for add", this.departmentObj);
    this.waiter.post("https://localhost:44377/api/Department/AddNewDepartment", this.departmentObj).subscribe((res: any) => {
      this.departmentObj = res.result;
      console.log(res);
      this.GetDepartmentAndColleges();
      if (res.result == true) {
        swal2.fire({
          icon: 'success',
          title: 'New Department Added'
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
//End


// delete function
DeleteDepartment(item: any) {
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
      this.waiter.delete("https://localhost:44377/api/Department/DeleteDepartment/" + item.departmentid).subscribe((res: any) => {
        console.log(res);    
        this.GetDepartmentAndColleges();
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
