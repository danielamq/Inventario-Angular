export interface DistribuidorRequest {
  nombre: string;
  productos: DistribuidorProductoRequest[];
  preciosEspeciales?: DistribuidorPrecioRequest[];
  productosAEliminar?: number[];
}

export interface DistribuidorProductoRequest {
  id?: number;
  productoId: number;
  cantidadConsignada: number;
}

export interface DistribuidorPrecioRequest {
  productoId: number;
  precioEspecial: number;
}