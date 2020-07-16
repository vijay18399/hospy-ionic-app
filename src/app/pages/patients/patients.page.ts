import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})
export class PatientsPage implements OnInit {
  patients = [];
  constructor(private api: ApiService,  private activatedRoute: ActivatedRoute,  private router: Router, private loadingCtrl: LoadingController) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patients = this.router.getCurrentNavigation().extras.state.patients;
      }
    });
   }

  ngOnInit() {
    this.loadPatients();
  }
  Open(patient){
    const navigationExtras = {
      state: {
        patient
      }
    };
    let r = '/patient/' + patient._id;
    this.router.navigate([r], navigationExtras);
 
  }
  async loadPatients(event?) {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.getPatients().pipe(
      tap(data => {
        this.patients = data;
        console.log(data);
      }),
      finalize(() => {
        loading.dismiss();
        if (event) {
          event.target.complete();
        }
      })
    ).subscribe();
  }
  Add(){
    let patients = this.patients;
    const navigationExtras = {
      state: {
        patients
      }
    };
    let r = 'add-patient';
    this.router.navigate([r], navigationExtras);
  }
  signOut() {
    this.api.logout();
  }

}
