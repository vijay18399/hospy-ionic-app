import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SizerService } from '../../services/sizer.service';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoadingController, Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.page.html',
  styleUrls: ['./patient.page.scss'],
})
export class PatientPage implements OnInit {
  patientid = null;
  patient = null;
  user = null;
  data = null;
  recommendations = [];
  assessment = [];
  history = [];
  isDesktop = true;
  constructor(public sizerService: SizerService, public alertController: AlertController, private loadingCtrl: LoadingController, private http: HttpClient, public platform: Platform, private api: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patient = this.router.getCurrentNavigation().extras.state.patient;
        this.user = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }


  ngOnInit() {
    // this.isDesktop = this.sizerService.isDesktop();
    this.Detect();
    this.patientid = this.activatedRoute.snapshot.paramMap.get('id');
  }
  Detect() {
    if (this.platform.is("ios")) {
      this.isDesktop = false;
    } else if (this.platform.is("android")) {
      this.isDesktop = false;
    }
  }


  async loadPatient(event?) {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.getPatient(this.patientid).pipe(
      tap(data => {
        this.patient = data[0];
        console.log(this.patient);
        this.data = JSON.stringify(this.patient);
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
  Edit() {
    let patient = this.patient;
    const navigationExtras = {
      state: {
        patient
      }
    };
    let r = 'edit-patient';
    this.router.navigate([r], navigationExtras);
  }

  async Logs(event?) {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.logforpatient(this.patientid).pipe(
      tap(data => {
        let logs = data
        let patient = this.patient
        const navigationExtras = {
          state: {
            logs, patient
          }
        };
        let r = 'logs';
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
  async Shifts() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Shift Ended ',
      inputs: [
        {
          name: 'notes',
          placeholder: 'any notes about shift'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            let username = this.user['username'];
            let profession = this.user['profession'];
            let notes = data.notes;
            let patient_id = this.patient['_id'];
            let uhid = this.patient['uhid'];
            this.add({ username, notes, profession, patient_id, uhid });
          }
        }
      ]
    });

    await alert.present();
  }

  async OpenShifts() {
    let patient = this.patient;
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.shiftforpatient(this.patient['_id']).pipe(
      tap(data => {
        const navigationExtras = {
          state: {
            data, patient
          }
        };
        let r = '/shifts';
        this.router.navigate([r], navigationExtras);
        loading.dismiss();
      }),
    ).subscribe();
  }

  add(shift) {
    this.api.addShift(shift).pipe()
      .subscribe(res => {
        if (res) {
          Swal.fire(
            'Good job!',
            'Shift Recorded succesfully',
            'success'
          );
        }
      }, err => {
        Swal.fire('Oops...', 'Something went wrong!', 'error');
      });
  }
  addTo(name) {
    let newCategory = { category: '', description: '' };
    if (name == 'history') {
      this.history.push(newCategory);
    }
    else if (name == 'recommendations') {
      this.recommendations.push(newCategory);
    }
    else {
      this.assessment.push(newCategory);
    }
  }
  async Update(data, name) {
    console.log(this.patient);
    console.log(data);
    if (name == 'history') {
      let outcome = this.history.concat(this.patient['history']);
      this.patient['history'] = outcome;
      this.data = {
        'history': outcome
      };
    }
    else if (name == 'recommendations') {
      let outcome = this.recommendations.concat(this.patient['recommendations']);
      this.patient['recommendations'] = outcome;
      this.data = {
        'recommendations': outcome
      };
    }
    else {
      let outcome = this.assessment.concat(this.patient['assessment']);
      this.patient['assessment'] = outcome;
      this.data = {
        'assessment': outcome
      };
    }

    this.data.updatedBy = this.patient['updatedBy'];
    const loading = await this.loadingCtrl.create();
    loading.present();
    this.api.updatePatient(this.patient['_id'], this.data).pipe(
      finalize(() => { })
    )
      .subscribe(res => {
        if (res) {

          let data = { patient_id: this.patient['_id'], uhid: this.patient['uhid'], username: this.user['username'], profession: this.user['profession'], description: 'new ' + name + '  added', at: new Date };
          console.log(data);
          this.api.addLog(data).pipe(
            finalize(() => loading.dismiss())
          )
            .subscribe(response => {
              if (response) {
                console.log(data, response);
              }
            });
          this.history = [];
          this.assessment = [];
          this.recommendations = [];

          Swal.fire(
            'Good job!',
            'You added a ' + name + ' Successfully',
            'success'
          );
        }
      }, async err => {
        Swal.fire(
          'Sorry!',
          'adding' + name + ' Failed',
          'warning'
        );
      });
  }
  back() {
    const patient = this.patient;

    const navigationExtras = {
      state: {
        patient
      }
    };
    let route = 'app/patients';
    this.router.navigate([route], navigationExtras);
  }

}
