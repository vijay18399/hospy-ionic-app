import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {
  patient = null;
  logs = null;
  constructor(private router: Router, private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patient = this.router.getCurrentNavigation().extras.state.patient;
      }
    });
  }

  ngOnInit() {
    this.logs = this.patient.Logs;
  }

}
