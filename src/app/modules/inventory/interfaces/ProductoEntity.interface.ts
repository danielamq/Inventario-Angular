export class ProductoEntity {
    id: number;
    nombre: string;
    costo: number;
    precioMayorista: number;
    precioDetal: number;
    cantidadReal: number;
    cantidadConsignacion: number;
    descuentoAdicional: number;
    
    constructor() {
        this.id = 0;
        this.nombre = '';
        this.costo = 0;
        this.precioMayorista = 0;
        this.precioDetal = 0;
        this.cantidadReal = 0;
        this.cantidadConsignacion = 0;
        this.descuentoAdicional = 0;
    }

}