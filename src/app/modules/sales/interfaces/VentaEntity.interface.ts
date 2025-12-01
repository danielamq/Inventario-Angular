import { ProductoEntity } from "../../inventory/interfaces/ProductoEntity.interface";
import { DistribuidorEntity } from "../../users/interfaces/DistribuidorEntity.interface";

export interface VentaEntity {
  id: number;
  nombreCliente: string;
  esMayorista: boolean;
  descuentoAdicional?: number;
  total?: number;
  fecha?: Date;
  distribuidor?: DistribuidorEntity;
  items: VentaItemEntity[];
}

export interface VentaItemEntity {
  id: number;
  producto: ProductoEntity;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}