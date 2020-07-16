import { Component, OnInit } from '@angular/core';
import { ApiService, User } from '../../services/api.service';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: User[] = [];

  constructor(private api: ApiService,  private activatedRoute: ActivatedRoute,  private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.loadUsers();
  }
  Open(user){
    const navigationExtras = {
      state: {
        user
      }
    };
    let r = '/user/' + user._id;
    this.router.navigate([r], navigationExtras);
 
  }

  async loadUsers(event?) {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.getAllUsers().pipe(
      tap(data => {
        this.users = data;
      }),
      finalize(() => {
        loading.dismiss();
        if (event) {
          event.target.complete();
        }
      })
    ).subscribe();
  }

  signOut() {
    this.api.logout();
  }
}
