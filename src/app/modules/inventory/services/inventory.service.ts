import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';
import { ProductoRequest } from '../interfaces/ProductoRequest.interface';
import {ProductoEntity } from '../interfaces/ProductoEntity.interface'

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  url: string = environment.ApiURL

  constructor(private http: HttpClient) { }
  
    //#region Servicio Insertar
    crearProducto(producto: ProductoRequest): Observable<any> {
      const urlEndPoint = this.url + 'productos';
      const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(urlEndPoint, producto);
    }

    actualizarProducto(id: number, producto: ProductoRequest): Observable<ProductoEntity> {
      const urlEndPoint = `${this.url}productos/${id}`;
      const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

      return this.http.put<ProductoEntity>(urlEndPoint, producto);
    }


    actualizarStock(id: number, cantidadActualizar: number): Observable<number> {
        const urlEndPoint = `${this.url}productos/${id}/stock`;
        const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<number>(urlEndPoint, cantidadActualizar);
    }

    listarProductos(): Observable<any> {
      const urlEndPoint = this.url + 'productos';
      return this.http.get(urlEndPoint);
    }
        
    obtenerProductoPorId(id: number): Observable<any> {
      const urlEndPoint = `${this.url}productos/${id}`;
      return this.http.get(urlEndPoint);
    }

    eliminarProducto(id: number): Observable<any> {
      const urlEndPoint = `${this.url}productos/${id}`;
      return this.http.delete(urlEndPoint);
    }
}
