import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    empPayrollListLocal: Array<any> = [
        {
            _name: 'Narayan Mahadevan',
            _gender: 'male',
            _department: [
                'Engineering',
                'Finance'
            ],
            _salary: '50000',
            _startDate: '29 oct 2019',
            _note: '',
            _id: new Date().getDate,
            _profilePic: '../assets/profile-images/Ellipse -2.png'  
        },
        {
            _name: 'Anarpa Shashank Keerthi Kumar',
            _gender: 'female',
            _department: [
                'Sales'
            ],
            _salary: '40000',
            _startDate: '29 oct 2019',
            _note: '',
            _id: new Date().getTime()+1,
            _profilePic: '../assets/profile-images/Ellipse -1.png'  
        }
      ];        
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
}
