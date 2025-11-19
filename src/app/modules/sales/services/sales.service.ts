import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';
import { VentaRequest } from '../interfaces/VentaRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  url: string = environment.ApiURL

  constructor(private http: HttpClient) { }
  
    //#region Servicio Insertar
    crearVenta(venta: VentaRequest[]): Observable<any> {
      const urlEndPoint = this.url + 'venta';
      return this.http.post(urlEndPoint, venta);
    }

    listarVentas(): Observable<any> {
      const urlEndPoint = this.url + 'venta';
      return this.http.get(urlEndPoint);
    }
   
    obtenerVentaPorId(id: number): Observable<any> {
      const urlEndPoint = `${this.url}venta/${id}`;
      return this.http.get(urlEndPoint);
    }

    eliminarVenta(id: number): Observable<any> {
      const urlEndPoint = `${this.url}venta/${id}`;
      return this.http.delete(urlEndPoint);
    }
}
