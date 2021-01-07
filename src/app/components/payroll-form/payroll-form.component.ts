import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SiteProperties } from '../../site_properties'
import { HttpService } from '../../services/httpservices.service'

@Component({
  selector: 'payroll-form',
  templateUrl: './payroll-form.component.html',
  styleUrls: ['./payroll-form.component.scss']
})
export class PayrollFormComponent implements OnInit {
  id: number;
  profileArray: any[];
  employeeForm: any;
  allDepartments: Array<string> = ["Hr","Sales","Finance", "Engineer", "Others"];
  selectedSalary: number;
  errorText: string;
  dateError: string;
  empData: any;
  employeePayrollObj = {
            employeeId: null,    
            name: '',
            gender: '',
            department: [],
            salary: '',
            startDate: '',
            note: '',
            profilePic: ''
  };
  monthMap = new Map([
    [ "01", "Jan" ],
    [ "02", "Feb" ],
    [ "03", "Mar" ],
    [ "04", "Apr" ],
    [ "05", "May" ],
    [ "06", "Jun" ],
    [ "07", "Jul" ],
    [ "08", "Aug" ],
    [ "09", "Sep" ],
    [ "10", "Oct" ],
    [ "11", "Nov" ],
    [ "12", "Dec" ]
  ]);               

  constructor(private router:ActivatedRoute , private formBuilder: FormBuilder, private httpService:HttpService) {
   }

  ngOnInit(): void {
    this.resetFrom();
    this.checkForUpdate(); 
    this.onSalaryChange();                                  
  }

  resetFrom() {
    this.employeeForm = this.formBuilder.group({
      name: ['',[Validators.required, Validators.pattern('^[A-Z]{1}[a-zA-Z\\s]{2,}$')]],
      gender: ['',Validators.required],
      department: this.addDepartmentControls(),
      salary: [400000, Validators.required],
      day: ['01',Validators.required],
      month: ['Jan',Validators.required],
      year: ['2020',Validators.required],
      startDate: [],
      note: [],
      profilePic:['',Validators.required]
    });
    this.profileArray=[   {path:"../assets/profile-images/Ellipse -3.png"},
                          {path:'../assets/profile-images/Ellipse -1.png'},
                          {path:'../assets/profile-images/Ellipse -8.png'},
                          {path:'../assets/profile-images/Ellipse -7.png' }
                      ];
  }

  addDepartmentControls() {
    const arr = this.allDepartments.map(department =>{
      return this.formBuilder.control(false);
    })
    return this.formBuilder.array(arr);
  }

  get name() {
    return this.employeeForm.get('name');
  }

  get profilePic() {
    return this.employeeForm.get('profilePic');
  }

  get allDepartmentsArray() {
    return <FormArray>this.employeeForm.get('department');
  }

  onSalaryChange() {
    this.selectedSalary = this.employeeForm.value.salary;
  }

  getStartDate() {
    return this.employeeForm.value.day+" "+this.employeeForm.value.month+" "+this.employeeForm.value.year;
  }

  checkStartDate() {
    let startDate = new Date(Date.parse(this.getStartDate()));
    let now = new Date();
    if(startDate > now) 
        this.dateError = 'Start Date is a Future Date!';
    var diff = Math.abs(now.getTime() - startDate.getTime());
    if ( diff / (1000 * 60 * 60 * 24) > 30)
        this.dateError = 'Start Date is Beyond 30 Days';
    else
        this.dateError = '';         
  }

  getSelectedDepartmentValues() {
    let selectedFruitValues = [];
    this.allDepartmentsArray.controls.forEach((control, i) => {
      if (control.value) {
        selectedFruitValues.push(this.allDepartments[i]);
      }
    });
    return selectedFruitValues;
  }  

  save(){
    this.setEmployeePayrollData();
    alert(JSON.stringify(this.employeePayrollObj));
    if (SiteProperties.use_local_storage){
      console.log("Using local storage");
      this.createAndUpdateStorage();
      this.employeeForm.reset();
    } else {
      console.log("Using backend");
      this.createOrUpdateEmployeePayroll();
    }
  }

  setEmployeePayrollData() {
    if(this.id === null || this.id === undefined){
      this.employeePayrollObj.employeeId = this.createNewEmployeeId();
    } 
    this.employeePayrollObj.name = this.employeeForm.value.name;
    this.employeePayrollObj.gender = this.employeeForm.value.gender;
    this.employeePayrollObj.department = this.getSelectedDepartmentValues();
    this.employeePayrollObj.startDate = this.getStartDate();
    this.employeePayrollObj.salary = this.employeeForm.value.salary;
    this.employeePayrollObj.profilePic = this.employeeForm.value.profilePic;
    this.employeePayrollObj.note = this.employeeForm.value.note;                        
  }

createAndUpdateStorage() {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(employeePayrollList){
        let empPayrollData = employeePayrollList.
                                  find(empData => empData.employeeId == this.employeePayrollObj.employeeId);
        if(!empPayrollData){
            employeePayrollList.push(this.employeePayrollObj);
        } else {
            const index = employeePayrollList
                          .map(empData => empData.employeeId)
                          .indexOf(empPayrollData.employeeId);
            employeePayrollList.splice(index, 1, this.employeePayrollObj);
        }
    } else {
        employeePayrollList = [this.employeePayrollObj]
    }
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
  }

  createOrUpdateEmployeePayroll() {
    if(this.id === null || this.id === undefined){
      this.httpService.saveEmployeePayrollData(this.employeePayrollObj)
                      .subscribe((response) =>{
                          console.log(response.message);
                      });
    } else {
      this.httpService.updateEmployeePayrollData(this.employeePayrollObj, this.id)
                      .subscribe((response) => {
                          console.log(response.message);    
                      });
    }
  }

  createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    let num = 1;
    empID = !empID ? num.toString() : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
  }

  checkForUpdate() {
    this.id  = this.router.snapshot.params.id;
    if(this.id === null || this.id === undefined){
        return;
    }
    let employeePayrollList: any[];
    let empPayrollData;
    if(SiteProperties.use_local_storage) { 
      employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
      if(employeePayrollList){
        empPayrollData = employeePayrollList
                              .find(empData => empData.employeeId == this.id);
        this.setForm(empPayrollData);
      } else {
          return;
      }
    } else {
      this.httpService.getEmployeePayrollDataById(this.id)
                      .subscribe((response) =>{
                          this.empData = response.data;
                          this.setForm(this.empData);
                        });
    }
  }

  setForm(empPayrollData:any) {
    let date: any;
    let month: any;
    let day: any;
    let year: any;
    if(SiteProperties.use_local_storage){
      date = empPayrollData.startDate.split(" ");
      month = date[1];
      year = date[2];
      day = date[0];
    } else {
      date = empPayrollData.startDate.split("-");
      month = this.monthMap.get(date[1]);
      year = date[0];
      day = date[2];
    }
    this.employeeForm = this.formBuilder.group({
      name: empPayrollData.name,
      gender: empPayrollData.gender,
      department: this.addDepartmentControls(),
      salary: empPayrollData.salary,
      day: day,
      month: month,
      year: year,
      note: empPayrollData.note,
      profilePic: empPayrollData.profilePic
    });
    this.setSelectedDepartmentValues(empPayrollData.department);
  }

  setSelectedDepartmentValues(departments:any[]) {
    departments.forEach( item => {
    this.allDepartmentsArray.controls.forEach((control, i) => {
      if (this.allDepartments[i] == item) {
        control.setValue(true);
      }
      })
    })
  }
}
