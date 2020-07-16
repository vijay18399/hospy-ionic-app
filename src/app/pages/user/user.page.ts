import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoadingController } from '@ionic/angular';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

user = null;
shifts = null;
  constructor(private loadingCtrl: LoadingController, private router: Router, private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }

  ngOnInit() {
    this.LoadData();
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

}
