import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.page.html',
  styleUrls: ['./edit-patient.page.scss'],
})
export class EditPatientPage implements OnInit {
  data = null;
  public patient: Observable<any>; 
  public patients: Observable<any>; 
  index = null;
  id = null;
  user = null;
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
  constructor( public platform: Platform,private activatedRoute: ActivatedRoute, private router: Router, private api: ApiService,
     private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patient = this.router.getCurrentNavigation().extras.state.patient;
        this.id= this.patient['_id'];
      }
    });
  }
  ionViewWillEnter(){
    this.api.getUserData().subscribe(res => {
      this.user = res[0];
      this.patient['updatedBy'] = this.user.username;
      this.patient['lastUpdatedAt']= new Date;
    });
  }

async update(){
  const loading = await this.loadingCtrl.create();
  loading.present();
  this.api.updatePatient(this.id, this.patient).pipe(
    finalize(() => loading.dismiss())
  )
    .subscribe(res => {
      if (res) {
        let data = { patient_id: this.patient['_id'], uhid: this.patient['uhid'], username: this.user['username'], profession: this.user['profession'], description: 'new Status  added', at: new Date };
        this.api.addLog(data).pipe(
          finalize(() => loading.dismiss())
        )
          .subscribe(response => {
            if (response) {
              console.log(data, response);
            }
          });
        Swal.fire(
          'You made Updates to Patient '+ this.patient['uhid'],
          'Updated Successfully',
          'success'
        );
      }
    }, async err => {
      const alert = await this.alertCtrl.create({
        header: 'error failed',
        message: err.error['msg'],
        buttons: ['OK']
      });
      await alert.present();
    });
}
  
  back() {
    const patient = this.patient;
    const patients = this.patients;
    const index = this.index;
    const navigationExtras = {
      state: {
        patient,patients,index
      }
    };
    let route = 'patient/'+patient['_id']
    this.router.navigate([route], navigationExtras);
  }

}
