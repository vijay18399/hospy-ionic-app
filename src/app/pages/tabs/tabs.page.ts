import { Component } from '@angular/core';
import { ScreensizeService } from '../../services/screensize.service';
import { ApiService } from 'src/app/services/api.service';
import { tap, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
 
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  isDesktop = true;
 patients = null;
 
  constructor(    public platform: Platform,private activatedRoute: ActivatedRoute,  private router: Router, private api: ApiService, private screensizeService: ScreensizeService) {
 this.Detect();
  }
  Detect(){
    if (this.platform.is("ios")) {
this.isDesktop =  false;
    } else if (this.platform.is("android")) {
      this.isDesktop =  false;
    }
 }
  signOut() {
    this.api.logout();
  }

}