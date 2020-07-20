import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoadingController, Platform } from '@ionic/angular';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

user = null;
shifts = null;
isDesktop =true;
  constructor(public platform: Platform, private loadingCtrl: LoadingController, private router: Router, private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }


  ngOnInit() {
    this.LoadData();
this.Detect();
   }
 Detect(){
    if (this.platform.is("ios")) {
this.isDesktop =  false;
    } else if (this.platform.is("android")) {
      this.isDesktop =  false;
    }
 }
  
  async LoadData(){
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.shiftbyuser(this.user.username).pipe(
      tap(data => {
       this.shifts = data;
       console.log(data);
        loading.dismiss();
      }),
    ).subscribe();
  }
  back(){
    let route = 'app/users';
    this.router.navigate([route]);
  }

}
