import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class SizerService {

  constructor(public platform: Platform) { }
    isDesktop(){
    let  isDesktop = true;
          if (this.platform.is("ios")) {
           isDesktop =  false;
    } else if (this.platform.is("android")) {
           isDesktop =  false;
    }
    return isDesktop;
    }
}
