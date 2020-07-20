import { environment } from './../../environments/environment';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { take, map, switchMap, delay, tap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
 
const helper = new JwtHelperService();
export const TOKEN_KEY = 'jwt-token';

export interface User {
  first_name: string;
  last_name: string;
  username: string;
  avatar: string;
  bio: string;
  createdAt: string;
  _id: string;
  expanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
 
  constructor(private storage: Storage, private http: HttpClient, private plt: Platform, private router: Router) { 
    this.loadStoredToken();  
  }
 
  loadStoredToken() {
    let platformObs = from(this.plt.ready());
 
    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        if (token) {
          let decoded = helper.decodeToken(token); 
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }
 
  login(credentials: {username: string, password: string }) {
    return this.http.post(`${environment.apiUrl}/auth`, credentials).pipe(
      take(1),
      map(res => {
        console.log(res);
        // Extract the JWT
        return res['token'];
      }),
      switchMap(token => {
        let decoded = helper.decodeToken(token);
        this.userData.next(decoded);
 
        let storageObs = from(this.storage.set(TOKEN_KEY, token));
        return storageObs;
      })
    );
  }
 
  register(credentials: {username: string,profession: string, password: string }) {
    return this.http.post(`${environment.apiUrl}/users`, credentials).pipe(
      take(1),
      switchMap(res => {
        
        console.log('result: ', res);
        return this.login(credentials);
      })
    );
  }

  getUserToken() {
    return this.userData.getValue();
  }

  getUserData() {
    const id = this.getUserToken()['id'];
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`).pipe(
      take(1)
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`).pipe(
      take(1)
    );
  }

  getPatients(): Observable<any> {
      return this.http.get(`${environment.apiUrl}/patients`).pipe(
        take(1)
        );
  }
  addPatient(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}/patients`, data).pipe(
      take(1)
      );
}
  updatePatient(id, data) {
    return this.http.put(`${environment.apiUrl}/patient/`+ id , data ).pipe(
      take(1)
    );
  }
  getPatient(id){
    return this.http.get(`${environment.apiUrl}/patient/`+ id  ).pipe(
      take(1)
    );
  }
  dischargedPatient(id, data) {
    return this.http.delete(`${environment.apiUrl}/patient/`+ id ).pipe(
      take(1)
    );
  }
  addShift(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}/shifts`, data).pipe(
      take(1)
      );
}
shiftbyuser(id){
  return this.http.get(`${environment.apiUrl}/shiftbyuser/`+ id  ).pipe(
    take(1)
  );
}
shiftforpatient(id){
  return this.http.get(`${environment.apiUrl}/shiftforpatient/`+ id  ).pipe(
    take(1)
  );
}
logforpatient(id){
  return this.http.get(`${environment.apiUrl}/logforpatient/`+ id  ).pipe(
    take(1)
  );
}
addLog(data): Observable<any> {
  return this.http.post(`${environment.apiUrl}/logs`, data).pipe(
    take(1)
    );
}
 
  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }
 
}