import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SiteProperties } from '../site_properties';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http:HttpClient) { }

  saveEmployeePayrollData(empData:any): Observable<any> {
    let postUrl = SiteProperties.server_url+"/create"; 
    return this.http.post<any>(postUrl, empData);
  }

  getData(): Observable<any> {
    let getURL = SiteProperties.server_url; 
    return this.http.get<any>(getURL); 
  }

  getEmployeePayrollDataById(empId: number) {
    let getURL = SiteProperties.server_url+ "/get/" + empId; 
    return this.http.get<any>(getURL); 
  }

  updateEmployeePayrollData(empData: any,empId: number) {
    let putURL = SiteProperties.server_url+ "/update/" + empId; 
    return this.http.put<any>(putURL, empData); 
  }

  deleteEmployeeData(empId: number){
    const deleteURL = SiteProperties.server_url+ "/delete/" + empId;
    return this.http.delete(deleteURL);
  }
}
