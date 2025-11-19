import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';
import { DistribuidorEntity } from '../interfaces/DistribuidorEntity.interface';
import { DistribuidorRequest } from '../interfaces/DistribuidorRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url: string = environment.ApiURL

  constructor(private http: HttpClient) { }
  
    //#region Servicio Insertar
    crearDistribuidor(distribuidor: DistribuidorRequest): Observable<any> {
      const urlEndPoint = this.url + 'distribuidores';
      const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(urlEndPoint, distribuidor);
    }

    actualizarDistribuidor(id: number, distribuidor: DistribuidorRequest): Observable<DistribuidorEntity> {
      const urlEndPoint = `${this.url}distribuidores/${id}`;
      const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

      return this.http.put<DistribuidorEntity>(urlEndPoint, distribuidor);
    }

    listarDistribuidores(): Observable<any> {
      const urlEndPoint = this.url + 'distribuidores';
      return this.http.get(urlEndPoint);
    }
        
    obtenerDistribuidorPorId(id: number): Observable<any> {
      const urlEndPoint = `${this.url}distribuidores/${id}`;
      return this.http.get(urlEndPoint);
    }

    eliminarDistribuidor(id: number): Observable<any> {
      const urlEndPoint = `${this.url}distribuidores/${id}`;
      return this.http.delete(urlEndPoint);
    }
}
