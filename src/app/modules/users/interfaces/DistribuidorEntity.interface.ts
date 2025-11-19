export class DistribuidorEntity {
    id: number;
    nombre: string;
    cantidadConsignada: number;
    precioAsignado: number;
  
    constructor() {
        this.id = 0;
        this.nombre = '';
        this.cantidadConsignada = 0;
        this.precioAsignado = 0;
    }

}