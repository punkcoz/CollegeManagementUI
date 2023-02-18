import { getLocaleDateFormat } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import swal2 from 'sweetalert2';
import { Ng2SearchPipeModule } from 'ng2-search-filter/src/ng2-filter.module';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.css']

})
export class CollegeComponent implements OnInit {

  collegetoggle: boolean = true;
  collegeModelTitle = ""
  collegeDetails: any = [];
  collegeArchive: any = [];
  collegeDetailsObj: any = {
    collegeid: 0,
    collegeName: "",
    collegeLocation: "",
    collegeDetails: ""
  };
  collegeLogObj: any = {

  }
  collegesearch = ""
  addMode: boolean = true;
  paginationPageNumber = 0
  itemsPerPage = 0

  constructor(private waiter: HttpClient) {
    // this.getdata();
    this.AllCollegeDetails();
    // this.getOurOwnData();
  }


  ngOnInit(): void {
    this.paginationPageNumber = 1;
    this.itemsPerPage = 5;

  }

  // Function to add new college

  addButton() {
    this.addMode = true;
    this.collegeDetailsObj = {};
    this.collegeModelTitle = "Add College"
  }

  addNewCollege() {
    // console.log("for add", this.collegeDetailsObj);
    this.waiter.post(`${environment.URL}College/AddNewCollege`, this.collegeDetailsObj).subscribe((res: any) => {
      this.collegeDetailsObj = {};
      console.log(res);
      this.AllCollegeDetails();
      if (res.result == true) {
        swal2.fire({
          icon: 'success',
          title: 'New College Added'
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

  // Function to fetch data

  AllCollegeDetails() {
    // debugger
    this.collegetoggle = true;
    this.waiter.get(`${environment.URL}College/GetAllCollege`).subscribe((res: any) => {
      this.collegeDetails = res.result;
      // this.collegeDetails=this.collegeDetails.filter((p:any)=>p.isarchive == 1)
      // this.collegeDetailsObj = res.result;
      console.log(this.collegeDetails);
      // console.log(this.collegeDetailsObj);
    },
      (error: any) => {
        console.log(error)
      });
  }

  //Function to Archive college

  ArchiveCollege(item: any) {

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
          this.waiter.delete(`${environment.URL}College/ArchiveCollege/${item.collegeid}`).subscribe((res: any) => {
            console.log(res);
            this.AllCollegeDetails();
            swal2.fire(
              'Good Job!',
              'College Moved To Archive.',
              'success'
            )
          }, error => {
            console.log(error.status)
            swal2.fire(
              'error!',
              'Department Has Been Linked With this College.',
              'error'
            )
          });

        }
      })
  }

  // Function to update college 
  updateCollegeRecord(item: any) {
    this.addMode = false;
    this.collegeModelTitle = "Update College"
    this.collegeDetailsObj = {};
    this.collegeDetailsObj.collegeName = item.collegename;
    this.collegeDetailsObj.collegeDetails = item.collegedetails;
    this.collegeDetailsObj.collegeLocation = item.collegelocation;
    this.collegeDetailsObj.collegeid = item.collegeid;
  }
  updateCollege(collegeDetailsObj: any) {
    // console.log(item);
    // var updateCollege = item.collegeid
    console.log(this.collegeDetailsObj);
    // debugger
    this.waiter.put(`${environment.URL}College/UpdateCollege`, this.collegeDetailsObj).subscribe((res: any) => {
      console.log(res);

      this.collegeDetailsObj = res.result;

      this.AllCollegeDetails();
      if (res.result == true) {
        swal2.fire({
          icon: 'success',
          title: 'College Record Has Updated'
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


  // Error function for Empty input field
  error() {
    swal2.fire({
      icon: 'warning',
      title: 'Error occurred. Fix the following error and try again',
      text: "Fill Proper Details"
    })
  }

  // End error function


  // To Get College Archive Data

  CollegeArchive() {
    // debugger
    this.collegetoggle = false;
    this.waiter.get(`${environment.URL}College/College_Archive`).subscribe((res: any) => {
      this.collegeArchive = res.result;
      console.log(this.collegeArchive);
    },
      (error: any) => {
        console.log(error)
      });

  }
  // End College Archive 

  // Function to restore college

  RestoreCollege(item: any) {
    console.log(item);
    console.log(this.collegeDetailsObj);

    swal2.fire({
      title: 'Are you sure?',
      text: "Your Data Will Be Restore From Archived!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Restore It!'
    })

      .then((result) => {
        console.log(item.collegeid);
        if (result.isConfirmed) {
          debugger
          this.waiter.post(`${environment.URL}College/CollegeRestore/${item.collegeid}`, ``).subscribe((res: any) => {
            console.log(res);
            this.CollegeArchive();
          
            swal2.fire({
              icon: 'success',
              title: 'Goodjob',
              text: "College Restore Successfull!",
              showCancelButton: false,
              timer: 1000,
              showConfirmButton: false
            })
          }, error => {
            console.log(error.status)
            swal2.fire(
              'error!',
              'Restored Failed Try Again Later.',
              'error'
            )
          });
        }
      })
  }
// End Restore College

// Function to Permanent Delete College
PermanentCollegeDelete(item: any) {

  swal2.fire({
    title: 'Are you sure?',
    text: "You Wont Be Able To Restore Data!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete it!'
  })

    .then((result) => {
      if (result.isConfirmed) {
        this.waiter.delete(`${environment.URL}College/PermanentDeleteCollege/${item.college_logid}`).subscribe((res: any) => {
          console.log(res);
          this.CollegeArchive();
          swal2.fire(
            'Good Job!',
            'College Has Been Deleted.',
            'success'
          )
        },);

      }
    })
}


// End Permanent Delete College


}

