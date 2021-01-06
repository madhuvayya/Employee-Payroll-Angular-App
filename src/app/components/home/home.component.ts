import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from '../../services/httpservices.service'
import { SiteProperties } from '../../site_properties';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    empCount: number;
    empPayrollList: Array<any>;
    
    constructor(private router: Router,private httpService: HttpService) { }
    
    ngOnInit() {
        if(SiteProperties.use_local_storage) {
            this.getEmployeePayrollDataFromStorage();
        } else 
            this.getEmployeePayrollDataFromServer(); 
    }

    getEmployeePayrollDataFromStorage() {
        this.empPayrollList = localStorage.getItem('EmployeePayrollList') ? 
                                    JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
        this.processEmployeePayrollDataResponse();
    }
    
    processEmployeePayrollDataResponse() {
        // this.empCount = this.empPayrollList.length;  
    }

    getEmployeePayrollDataFromServer() {
        this.httpService.getData()
                        .subscribe((response) =>{
                            this.empPayrollList  = response.data;
                        });
        this.processEmployeePayrollDataResponse();
    }

    remove ($event) {
        let id = $event.target.id;
        let empPayrollData = this.empPayrollList
                                    .find(empData => empData.employeeId == id);
        if (!empPayrollData) return;
        const index = this.empPayrollList
                        .map(empData => empData.employeeId)
                        .indexOf(empPayrollData.employeeId);
        this.empPayrollList.splice(index, 1);
        if(SiteProperties.use_local_storage) {            
            localStorage.setItem("EmployeePayrollList",JSON.stringify(this.empPayrollList));
        } else {
            this.httpService.deleteEmployeeData(id)
                            .subscribe((response) =>{
                                let responseData = response;
                                console.log(response);
                            });
        }
        this.processEmployeePayrollDataResponse();              
    }
}
