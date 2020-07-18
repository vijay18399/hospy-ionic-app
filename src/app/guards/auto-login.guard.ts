import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { take, map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanActivate {
  
   constructor(   public platform: Platform, private api: ApiService, private router: Router) {
this.Detect();
   }
   isDesktop = true;

  Detect(){
     if (this.platform.is("ios")) {
 this.isDesktop =  false;
     } else if (this.platform.is("android")) {
       this.isDesktop =  false;
     }
  }

  canActivate(): Observable<boolean> {
    return this.api.user.pipe(
      take(1),
      map(user => {
        if (!user) {
          return true;
        } else {
          if (this.isDesktop){
            this.router.navigateByUrl('/web');
          }
          else {
            this.router.navigateByUrl('/app');
          }
          return false;
        }
      })
    )
  }
}
