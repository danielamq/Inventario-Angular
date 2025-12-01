import { ProductoEntity } from "../../inventory/interfaces/ProductoEntity.interface";
export interface DistribuidorEntity {
  id: number;
  nombre: string;
  productos: DistribuidorProductoEntity[];
  preciosEspeciales: DistribuidorPrecioEntity [];
}

export interface DistribuidorProductoEntity  {
  id: number;
  producto: ProductoEntity;
  cantidadConsignada: number;
  precioAsignado: number;
}

export interface DistribuidorPrecioEntity  {
  id: number;
  producto: ProductoEntity;
  precioEspecial: number;
}
