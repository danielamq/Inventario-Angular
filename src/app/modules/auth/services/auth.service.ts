import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Credentials } from '../components/login/interfaces/credentials.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    localStorageName = "username"
    url: string = environment.ApiURL

    constructor(
        private http: HttpClient,
        private router: Router
    ) {

    }

    login(credentials: Credentials): Observable<any> {
        const urlEndPoint = this.url + 'api/auth/login';
        return this.http.post(urlEndPoint, credentials);
    }

    registro(credentials: Credentials): Observable<any> {
        const urlEndPoint = this.url + 'api/auth/registrar';
        return this.http.post(urlEndPoint, credentials);
    }
    //#region Servicio Cerrar Sesion
    Logout() {

        localStorage.removeItem(this.localStorageName);

        this.router.navigate(['/auth/login'], {
            queryParams: {},
        });
    }

}
