import { ProductoEntity } from "../../inventory/interfaces/ProductoEntity.interface";
import { DistribuidorEntity } from "../../users/interfaces/DistribuidorEntity.interface";

export class VentaEntity {
    producto?: ProductoEntity;
    cantidad?: number;
    nombreCliente?: string;
    esMayorista?: boolean
    precioUsado?: number
    fecha?: Date
    distribuidor?: DistribuidorEntity
}