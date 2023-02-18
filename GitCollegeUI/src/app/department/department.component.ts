import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import swal2 from 'sweetalert2';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departmentLogArray: any =[];
  Departmenttoggle: boolean = true;
  getcollege: any = [];
  getDepartmentAndCollege: any = [];
  departmentSearch = "";
  paginationPageNumber = 0;
  itemsPerPage = 0;
  buttonMode: boolean = true;
  departmentModalTital = ""

  departmentObj: any = {
    departmentId:0,
    departmentName: "",
    collegeId: 0
  };
  
  constructor(private waiter: HttpClient) {
    this.GetDepartmentAndColleges();
  }

  ngOnInit(): void {
    this.paginationPageNumber = 1;
    this.itemsPerPage = 5;
    this.GetCollege();
  }

  // Fetch College and Department 
GetDepartmentAndColleges() {
    this.Departmenttoggle = true;
    this.waiter.get(`${environment.URL}Department/GetDepartmentAndColleges`).subscribe((res: any) => {
      this.getDepartmentAndCollege = res.result;
      console.log(this.getDepartmentAndCollege);
    },
      (error: any) => {
        console.log(error)
      });
  }
//End 

GetCollege(){
  this.waiter.get(`${environment.URL}College/GetAllCollege`).subscribe((res:any)=>{
    this.getcollege = res.result;
    console.log(res.result);
    
  })
}

// to check select value is coming or not
  // (change)="collegeselect($event)"
// collegeselect(item:any){
// console.log(item.target.value);

//   }
//check end

// Function To Add New Department
  addButton() {
    this.buttonMode = true;
    this.departmentModalTital ="Add Department"
    this.departmentObj = {};
    this.departmentObj.collegeId="";
  }

  addDepartment() {
    // console.log("for add", this.departmentObj);
    this.waiter.post(`${environment.URL}Department/AddNewDepartment`, this.departmentObj).subscribe((res: any) => {
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

ArchiveDepartment(item: any) {

  swal2.fire({
    title: 'Are you sure?',
    text: "Your data will be stored in archived!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, archived it!'
  })

    .then((result) => {
      if (result.isConfirmed) {
        this.waiter.delete(`${environment.URL}Department/DepartmentArcived/${item.departmentid}`).subscribe((res: any) => {
          console.log(res);
          this.GetDepartmentAndColleges();
          swal2.fire(
            'Good Job!',
            'Department Moved To Archive.',
            'success'
          )
        }, error => {
          console.log(error.status)
          swal2.fire(
            'error!',
            'Cource Has Been Linked With this Department.',
            'error'
          )
        });

      }
    })
}

// DeleteDepartment(item: any) {
//   swal2.fire({
//     title: 'Are you sure?',
//     text: "You won't be able to revert this!",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, delete it!'
//   }).then((result) => {
//     if (result.isConfirmed) {
//       this.waiter.delete(`${environment.URL}Department/DeleteDepartment/` + item.departmentid).subscribe((res: any) => {
//         console.log(res);    
//         this.GetDepartmentAndColleges();
//     });      
//       swal2.fire(
//         'Deleted!',
//         'Your file has been deleted.',
//         'success'
//       )
//     }
//   })      
// }

//function to update department
updateDepartmentRecord(item: any) {
  this.buttonMode = false;
  this.departmentModalTital = "Update Department"
  this.departmentObj = {};
  this.departmentObj.collegeId = item.collegeid;
  this.departmentObj.collegename = item.collegename;
  this.departmentObj.departmentName = item.departmentname;
  this.departmentObj.departmentId = item.departmentid;
  console.log(item)
}
updateDepartment(departmentObj: any) {
  this.waiter.put(`${environment.URL}Department/UpdateDepartment`, this.departmentObj).subscribe((res: any) => {  
  console.log(res.result);
    this.departmentObj = res.result;
    this.GetDepartmentAndColleges();
    if (res.result == true) {
      swal2.fire({
        icon: 'success',
        title: 'Department Record Has Updated'
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

error(){
  swal2.fire({
    icon: 'warning',
        title: 'Error occurred. Fix the following error and try again',
        text: "Fill Proper Details"
  })
}

Department_LogData() {
  this.Departmenttoggle = false;
  this.waiter.get(`${environment.URL}Department/DepartmentGetArcivedDept`).subscribe((res: any) => {
    this.departmentLogArray = res.result;
    console.log(this.departmentLogArray);
  },
    (error: any) => {
      console.log(error)
    });
}

}
