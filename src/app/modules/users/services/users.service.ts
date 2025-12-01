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
  crearDistribuidor(distribuidor: DistribuidorRequest): Observable<DistribuidorEntity> {
    return this.http.post<DistribuidorEntity>(`${this.url}distribuidores`, distribuidor);
  }

  actualizarDistribuidor(id: number, distribuidor: DistribuidorRequest): Observable<DistribuidorEntity> {
    return this.http.put<DistribuidorEntity>(`${this.url}distribuidores/${id}`, distribuidor);
  }

  listarDistribuidores(): Observable<DistribuidorEntity[]> {
    return this.http.get<DistribuidorEntity[]>(`${this.url}distribuidores`);
  }

  obtenerDistribuidorPorId(id: number): Observable<DistribuidorEntity> {
    return this.http.get<DistribuidorEntity>(`${this.url}distribuidores/${id}`);
  }

  eliminarDistribuidor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}distribuidores/${id}`);
  }
}
