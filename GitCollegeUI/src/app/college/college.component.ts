import { getLocaleDateFormat } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import swal2 from 'sweetalert2';
import { Ng2SearchPipeModule } from 'ng2-search-filter/src/ng2-filter.module';


@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.css']
})
export class CollegeComponent implements OnInit {

  // posts: any = []
  // data: any = [];
  collegeDetails: any = [];
  collegeDetailsObj: any = {
    collegeid: 0,
    collegeName: "",
    collegeLocation: "",
    collegeDetails: ""
  };
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
    this.itemsPerPage = 10;

  }


  // getOurOwnData() {
  //   this.waiter.get("https://localhost:44377/api/College/GetCollegeById").subscribe((res: any) => {
  //     this.collegeDetailsObj = res.result;
  //     console.log(this.data);
  //   },
  //     (error: any) => {
  //       console.log(error)
  //     });
  // }

  // Function to add new college

  addButton() {
    this.addMode = true;
    this.collegeDetailsObj = {};
  }

  addNewCollege() {
    // console.log("for add", this.collegeDetailsObj);
    this.waiter.post("https://localhost:44377/api/College/AddNewCollege", this.collegeDetailsObj).subscribe((res: any) => {
      this.collegeDetailsObj = res.result;
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
    this.waiter.get("https://localhost:44377/api/College/GetAllCollege").subscribe((res: any) => {
      this.collegeDetails = res.result;
      // this.collegeDetailsObj = res.result;
      // console.log(this.collegeDetails);
      // console.log(this.collegeDetailsObj);
    },
      (error: any) => {
        console.log(error)
      });
  }

  //Function to delete 

  DeleteCollege(item: any) {

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
        this.waiter.delete("https://localhost:44377/api/College/DeleteCollege/" + item.collegeid).subscribe((res: any) => {
          console.log(res);    
          this.AllCollegeDetails();
      });      
        swal2.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })      
  }

  // Function to update college 
  updateCollegeRecord(item: any) {
    this.addMode = false;
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
    this.waiter.put("https://localhost:44377/api/College/UpdateCollege", this.collegeDetailsObj).subscribe((res: any) => {
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

  error(){
    swal2.fire({
      icon: 'warning',
          title: 'Error occurred. Fix the following error and try again',
          text: "Fill Proper Details"
    })
  }


}

