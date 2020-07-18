import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials = {
    username: '',
    password: '',
    profession:''
  };
 
  constructor(
    public platform: Platform,
    private api: ApiService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}
 
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
 
  async register() {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.register(this.credentials).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(res => {
      console.log(res);
        this.router.navigateByUrl('/app');
    }, async err => {
      const alert = await this.alertCtrl.create({
        header: 'Registration failed',
        message: err.error['msg'],
        buttons: ['OK']
      });
      await alert.present();
    });
  }
}
