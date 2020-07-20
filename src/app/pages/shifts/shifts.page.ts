import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.page.html',
  styleUrls: ['./shifts.page.scss'],
})
export class ShiftsPage implements OnInit {

  shifts = null;
   patient = null;
  constructor(public platform: Platform, private router: Router, private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.shifts = this.router.getCurrentNavigation().extras.state.data;
        this.patient = this.router.getCurrentNavigation().extras.state.patient;
        console.log(this.shifts);
      }
    });
  }

  isDesktop = true;
  ngOnInit() {
    console.log(this.shifts);
    this.Detect();
  }
  Detect() {
    if (this.platform.is("ios")) {
      this.isDesktop = false;
    } else if (this.platform.is("android")) {
      this.isDesktop = false;
    }
  }

  back() {
    let route = 'patient/' + this.patient['_id'];
    this.router.navigate([route]);
  }

}
