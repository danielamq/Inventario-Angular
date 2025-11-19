export class VentaRequest {
    productoId?: string;
    cantidad?: number;
    nombreCliente?: string;
    esMayorista?: boolean;
    descuentoAdicional?: number;
    distribuidorId?: number;
    productos?: VentaRequest[];
}