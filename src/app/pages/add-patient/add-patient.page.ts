import { Component, OnInit } from '@angular/core';
import { ApiService, User } from '../../services/api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.page.html',
  styleUrls: ['./add-patient.page.scss'],
})
export class AddPatientPage implements OnInit {

  constructor( private activatedRoute: ActivatedRoute, private router: Router,   private api: ApiService,private alertCtrl: AlertController, private loadingCtrl: LoadingController) 
  {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patients = this.router.getCurrentNavigation().extras.state.patients;
      }
    });
   }
   patients = null;
  patient = {
    name: '',
    uhid: '',
    bed_no:'',
    history:[],
    assessment:[],
    recommendations:[],
    past_status:[],
    current_status:'',
    system_status :'',
    UpdatedBy:'',
    Logs:[],
    isDischarged:false

  };
  user = null;
  ngOnInit() {
   console.log(this.user);
  }
  ionViewWillEnter(){
    this.api.getUserData().subscribe(res => {
      this.user = res;
      this.patient.UpdatedBy = this.user[0].username;
      let username = this.user[0].username;
      this.patient['LastUpdatedAt']= new Date;
      this.patient.Logs = [ { username : username , description: 'patient Created '  ,  At:new Date }];
    });
  }

  async add() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    let current_status =  this.patient.current_status;
    this.patient.past_status = [current_status];
    this.api.addPatient(this.patient).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(res => {
      if (res) {
        this.patients.push(res);
        let patients = this.patients;
        const navigationExtras = {
          state: {
            patients
          }
        };
        let r = 'patients';
        this.router.navigate([r], navigationExtras);
      }
    }, async err => {
      const alert = await this.alertCtrl.create({
        header: 'Login failed',
        message: err.error['msg'],
        buttons: ['OK']
      });
      await alert.present();
    });
  }
  
}
