import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.page.html',
  styleUrls: ['./edit-patient.page.scss'],
})
export class EditPatientPage implements OnInit {
  data = null;
  patient = null;
  id = null;
  user = null;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private api: ApiService,
     private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patient = this.router.getCurrentNavigation().extras.state.patient;
        this.id= this.patient._id;
      }
    });
  }
  ionViewWillEnter(){
    this.api.getUserData().subscribe(res => {
      this.user = res;
      this.patient.UpdatedBy = this.user[0].username;
      let username = this.user[0].username;
      this.patient['LastUpdatedAt']= new Date;
      this.patient.Logs.push({ username : username , description: 'Status Updated'  ,  At:new Date });
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
        Swal.fire(
          'You made Updates to Patient '+ this.patient.uhid,
          'Updated Successfully',
          'success'
        )
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
  ngOnInit() {
  }
  back() {
    const patient = this.patient;
    const navigationExtras = {
      state: {
        patient
      }
    };
    let route = 'patient/'+patient['_id']
    this.router.navigate([route], navigationExtras);
  }

}
