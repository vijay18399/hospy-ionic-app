import { Component, OnInit } from '@angular/core';
import { ApiService, User } from '../../services/api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-array-adder',
  templateUrl: './array-adder.page.html',
  styleUrls: ['./array-adder.page.scss'],
})
export class ArrayAdderPage implements OnInit {
  name = 'history';
  id = 'kdkkdkdkkdkdkdkd';
  data = null;
  OldArray = [{ category: 'some', description: 'okok' }, { category: 'some', description: 'okok' }];
  NewArray = [];
  patient=null;
 user = null;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private api: ApiService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.patient = this.router.getCurrentNavigation().extras.state.patient;
        this.name = this.router.getCurrentNavigation().extras.state.name;
        this.OldArray = this.router.getCurrentNavigation().extras.state.array;
        this.id= this.patient._id;
      }
    });
  }

  ngOnInit() {
  }
  add() {
    let newCategory = { category: '', description: '' }
    this.NewArray.push(newCategory);
  }
  minus() {
    this.NewArray.pop();
  }
  ionViewWillEnter(){
    this.api.getUserData().subscribe(res => {
      this.user = res;
      this.patient.UpdatedBy = this.user[0].username;
      let username = this.user[0].username;
      this.patient['LastUpdatedAt']= new Date;
      this.patient.Logs.push({ username : username , description: 'new ' + this.name + '  added' ,  At:new Date });
    });
  }
  async  addCategory() {
    console.log(this.patient);
    let outcome = this.NewArray.concat(this.OldArray);
    if (this.name == 'history') {
      this.patient.history = outcome;
      this.data = {
        'history': outcome
      }
    }
    else if (this.name == 'recommendations') {
      this.patient.recommendations = outcome;
      this.data = {
        'recommendations': outcome
      }
    }
    else {
      this.patient.assessment = outcome;
      this.data = {
        'assessment': outcome
      }
    }
    this.data.Logs =  this.patient.Logs;
    this.data.UpdatedBy =  this.patient.UpdatedBy;
    const loading = await this.loadingCtrl.create();
    loading.present();
    this.api.updatePatient(this.id, this.data).pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(res => {
        if (res) {
          this.OldArray =  outcome;
          this.NewArray = [];
          let message = "added successfully";
          alert(message);
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
