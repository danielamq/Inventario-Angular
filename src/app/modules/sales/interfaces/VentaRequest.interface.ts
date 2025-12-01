export interface VentaRequest {
  nombreCliente?: string;
  esMayorista?: boolean;
  descuentoAdicional?: number;
  distribuidorId?: number;

  productos?: VentaProductoRequest[];
}

export interface VentaProductoRequest {
  productoId: number;
  cantidad: number;
}

export interface ItemVentaFront {
  productoId: number;
  cantidad: number;
  descuentoAdicional?: number;
  distribuidorId?: number;
  esMayorista?: boolean;
  precioUnitario?: number;
  subtotal?: number; 
}