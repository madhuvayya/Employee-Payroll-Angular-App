import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'payroll-form',
  templateUrl: './payroll-form.component.html',
  styleUrls: ['./payroll-form.component.scss']
})
export class PayrollFormComponent implements OnInit {
  profileArray: any[];
  employeeForm: any;
  allDepartments: Array<string> = ["Hr","Sales","Finance", "Engineer", "Others"];
  selectedSalary: number = 400000;
  errorText: string;
  dateError: string;
  employeePayrollObj = {
            id: '',    
            name: '',
            gender: '',
            department: [],
            salary: '',
            startDate: '',
            notes: '',
            profilePic: ''
  };               

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      name: ['',[Validators.required, Validators.pattern('^[A-Z]{1}[a-zA-Z\\s]{2,}$')]],
      gender: ['',Validators.required],
      department: this.addDepartmentControls(),
      salary: ['',Validators.required],
      day: ['1',Validators.required],
      month: ['Jan',Validators.required],
      year: ['2020',Validators.required],
      startDate: [],
      notes: [],
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
    this.createAndUpdateStorage();
  }

  setEmployeePayrollData() {
    this.employeePayrollObj.id = this.createNewEmployeeId(); 
    this.employeePayrollObj.name = this.employeeForm.value.name;
    this.employeePayrollObj.gender = this.employeeForm.value.gender;
    this.employeePayrollObj.department = this.getSelectedDepartmentValues();
    this.employeePayrollObj.startDate = this.getStartDate();
    this.employeePayrollObj.salary = this.employeeForm.value.salary;
    this.employeePayrollObj.profilePic = this.employeeForm.value.profilePic;
    this.employeePayrollObj.notes = this.employeeForm.value.notes;                        
  }

createAndUpdateStorage() {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(employeePayrollList){
        let empPayrollData = employeePayrollList.
                                  find(empData => empData.id == this.employeePayrollObj.id);
        if(!empPayrollData){
            employeePayrollList.push(this.employeePayrollObj);
        } else {
            const index = employeePayrollList
                          .map(empData => empData.id)
                          .indexOf(empPayrollData.id);
            employeePayrollList.
                          splice(index, 1, this.employeePayrollObj);
        }
    } else {
        employeePayrollList = [this.employeePayrollObj]
    }
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
  }

  createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    let num = 1;
    empID = !empID ? num.toString() : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
  }
}
