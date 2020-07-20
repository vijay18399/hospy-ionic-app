import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {
  logs = null;
  patient = null;
  
  constructor(public platform: Platform, private router: Router, private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.logs = this.router.getCurrentNavigation().extras.state.logs;
        this.patient = this.router.getCurrentNavigation().extras.state.patient;
      }
    });
  }

  isDesktop = true;
  ngOnInit() {

this.Detect();
   }
 Detect(){
    if (this.platform.is("ios")) {
this.isDesktop =  false;
    } else if (this.platform.is("android")) {
      this.isDesktop =  false;
    }
 }
 back(){
  let route = 'patient/'+this.patient['_id'];
  this.router.navigate([route]);
}

}
