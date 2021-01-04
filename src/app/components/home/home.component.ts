import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    empCount: number;
    empPayrollList: Array<any>;
    
    constructor(private router: Router) { }
    
    ngOnInit() {
        this.empPayrollList = localStorage.getItem('EmployeePayrollList') ? 
                                    JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
        this.processEmployeePayrollDataResponse();
    }
    
    processEmployeePayrollDataResponse() {
        this.empCount = this.empPayrollList.length;  
    }

    remove ($event) {
        let id = $event.target.id;            
        let empPayrollData = this.empPayrollList.find(empData => empData.id == id);
        if (!empPayrollData) return;
        const index = this.empPayrollList
                        .map(empData => empData.id)
                        .indexOf(empPayrollData.id);
        this.empPayrollList.splice(index, 1);
        localStorage.setItem("EmployeePayrollList",JSON.stringify(this.empPayrollList));
        this.processEmployeePayrollDataResponse();              
    }
}
