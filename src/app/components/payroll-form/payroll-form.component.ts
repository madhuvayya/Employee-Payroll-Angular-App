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

  get allDepartmentsArray() {
    return <FormArray>this.employeeForm.get('department');
  }

  onSalaryChange() {
    this.selectedSalary = this.employeeForm.value.salary;
  }

  save(){
    console.log(this.employeeForm.value);
    alert(this.employeeForm.value.name);
  }
}
