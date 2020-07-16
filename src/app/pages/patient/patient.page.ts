import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, User } from '../../services/api.service';
import { finalize, tap } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-patient',
  templateUrl: './patient.page.html',
  styleUrls: ['./patient.page.scss'],
})
export class PatientPage implements OnInit {
 user = '';
  constructor( private loadingCtrl: LoadingController, public alertController: AlertController, private router: Router, private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patient = this.router.getCurrentNavigation().extras.state.patient;
      }
    });
  }
  myId = '';
  patient = null;
  ngOnInit() {
    this.myId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.patient);
  }
  ionViewWillEnter() {
    this.get();
    this.api.getUserData().subscribe(res => {
      this.user = res[0];
    });

  }
  Edit(){
    let patient = this.patient;
    const navigationExtras = {
      state: {
        patient
      }
    };
    let r = 'edit-patient';
    this.router.navigate([r], navigationExtras); 
  }
  Open(name) {
    let array;
    if (name == 'history') {
      array = this.patient.history;
    }
    else if (name == 'recommendations') {
      array = this.patient.recommendations;
    }
    else {
      array = this.patient.assessment;
    }

    let patient = this.patient
    const navigationExtras = {
      state: {
        patient,
        name,
        array
      }
    };
    let r = 'array-adder';
    this.router.navigate([r], navigationExtras);
  }
  get() {
    this.myId = this.activatedRoute.snapshot.paramMap.get('id');
    this.api.getPatient(this.myId).pipe(
    )
      .subscribe(res => {
        if (res) {
          this.patient = res[0];
        }
      }, async err => {
        alert(err);
      });
  }
  Logs() {


    let patient = this.patient
    const navigationExtras = {
      state: {
        patient,
      }
    };
    let r = 'logs';
    this.router.navigate([r], navigationExtras);
  }
  async Shifts(){
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
          let  username =  this.user['username'];
          let  profession =  this.user['profession'];
          let notes = data.notes;
          let patient_id = this.patient._id;
          this.add({username,notes,profession, patient_id});
          }
        }
      ]
    });

    await alert.present();
  }

 async  OpenShifts(){
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.shiftforpatient(this.patient._id).pipe(
      tap(data => {
        const navigationExtras = {
          state: {
            data
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
       alert('Shift Recorded succesfully');
      }
    },  err => {
      alert('Error  Recorded ');
    });
  }
  
}
