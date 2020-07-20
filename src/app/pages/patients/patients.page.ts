import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoadingController, Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { SizerService } from '../../services/sizer.service';
@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})
export class PatientsPage implements OnInit {
  patients = [];
  user = null;
  patientid = null;
  isDesktop= true;
  constructor(public sizerService: SizerService, public alertController: AlertController, private loadingCtrl: LoadingController, private http: HttpClient, public platform: Platform, private api: ApiService, private activatedRoute: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.loadPatients();
    this.Detect();
    // this.isDesktop = this.sizerService.isDesktop();
  }
 Detect(){
    if (this.platform.is("ios")) {
this.isDesktop =  false;
    } else if (this.platform.is("android")) {
      this.isDesktop =  false;
    }
 }
  openDetails(id) {
    this.patientid = id;
    this.loadPatient();
  }
  async loadPatients(event?) {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.getPatients().pipe(
      tap(data => {
        this.patients = data;
        this.api.getUserData().subscribe(response => {
          this.user = response[0];
          console.log(this.user);
        });
      }),
      finalize(() => {
        loading.dismiss();
        if (event) {
          event.target.complete();
        }
      })
    ).subscribe();
  }
  async add() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Add Patient details',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Enter Name'
        },
        {
          name: 'uhid',
          type: 'text',
          placeholder: 'Enter UHID'
        },
        {
          name: 'bedno',
          type: 'text',
          placeholder: 'Enter Bed Number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.addPatient(data);
          }
        }
      ]
    });

    await alert.present();
  }
  async addPatient(data) {
    data.currentstatus = 'TBD';
    data.systemstatus = 'TBD';
    console.log(this.user);
    data.updatedBy = this.user['username'];
    data.lastUpdatedAt = new Date;
    console.log(data);
    const loading = await this.loadingCtrl.create();
    loading.present();
    this.api.addPatient(data).pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.patients.push(res);
        }
      }, async err => {
        Swal.fire('Oops...', 'Something went wrong!', 'error');
      });
  }

  async loadPatient(event?) {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.getPatient(this.patientid).pipe(
      tap(data => {
        let patient = data[0];
        let id = this.patientid;
        let user = this.user;
        const navigationExtras = {
          state: {
            patient,user
          }
        };
        let r = 'patient/'+id;
        this.router.navigate([r], navigationExtras);

      }),
      finalize(() => {
        loading.dismiss();
        if (event) {
          event.target.complete();
        }
      })
    ).subscribe();
  }


}
