import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, OnInit, Inject } from "@angular/core";
import { VentaRequest } from "../../interfaces/VentaRequest.interface";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/shared/services/AppDateAdapter";
import { InventoryService } from "src/app/modules/inventory/services/inventory.service";
import { UsersService } from "src/app/modules/users/services/users.service";

import Swal from "sweetalert2";
import { SalesService } from "../../services/sales.service";
import { ItemVentaFront } from "../../interfaces/VentaRequest.interface";
import { ProductoEntity } from "src/app/modules/inventory/interfaces/ProductoEntity.interface";
import { DistribuidorEntity } from "src/app/modules/users/interfaces/DistribuidorEntity.interface";
import { VentaEntity, VentaItemEntity } from "../../interfaces/VentaEntity.interface";

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class SalesFormComponent implements OnInit {

  nuevaVenta: VentaRequest = {};
  productos: ProductoEntity[] = [];
  distribuidores: DistribuidorEntity[] = [];
  listaProductosVenta: ItemVentaFront[] = [];
  distribuidorFijo: number | null = null;

  selectedProductoId?: number;
  selectedCantidad?: number;
  selectedDescuento?: number;
  selectedDistribuidorId?: number;

  sAccionModal: string = "";

  constructor(
    public dialogRef: MatDialogRef<SalesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private salesService: SalesService,
    private inventoryService: InventoryService,
    private usersService: UsersService,
  ) {
    this.sAccionModal = this.data.accion == 0 ? "Agregar" : "Editar";
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarDistribuidores();

    if (this.data.accion === 1) {
      this.cargarVentaExistente();
    }
  }

  cargarVentaExistente() {
    this.salesService.obtenerVentaPorId(this.data.nIdVenta).subscribe({
      next: (res: VentaEntity) => {
        // Datos principales de la venta
        this.nuevaVenta.nombreCliente = res.nombreCliente;
        this.nuevaVenta.esMayorista = res.esMayorista;
        this.nuevaVenta.distribuidorId = res.distribuidor?.id;
        this.nuevaVenta.descuentoAdicional = res.descuentoAdicional ?? 0;

        // Fijar distribuidor si es mayorista
        this.distribuidorFijo = res.distribuidor?.id ?? null;

        // Mapear productos de la venta
        this.listaProductosVenta = (res.items ?? []).map((item: VentaItemEntity) => ({
          productoId: Number(item.producto.id),
          cantidad: Number(item.cantidad),
          esMayorista: res.esMayorista,
          distribuidorId: res.distribuidor?.id,
          descuentoAdicional: this.nuevaVenta.descuentoAdicional,
          precioUnitario: item.precioUnitario,
          subtotal: item.subtotal,
        }));

        // Forzar a Angular a detectar cambios
        this.listaProductosVenta = [...this.listaProductosVenta];
      },
      error: () =>
        Swal.fire("Error", "No se pudo cargar la venta", "error")
    });
  }

  cargarProductos() {
    this.inventoryService.listarProductos().subscribe({
      next: (res: ProductoEntity[]) => this.productos = res,
      error: () => console.error("Error cargando productos")
    });
  }

  cargarDistribuidores() {
    this.usersService.listarDistribuidores().subscribe({
      next: (res: DistribuidorEntity[]) => this.distribuidores = res,
      error: () => console.error("Error cargando distribuidores")
    });
  }

  agregarProducto() {
    if (!this.selectedProductoId || !this.selectedCantidad) {
      Swal.fire("Error", "Debe seleccionar producto y cantidad", "warning");
      return;
    }

     if (this.distribuidorFijo == null && this.nuevaVenta.distribuidorId) {
      this.distribuidorFijo = this.nuevaVenta.distribuidorId;
    }

    // Fijar distribuidor en el primer producto
     // Si YA existe distribuidor fijo → asignarlo automáticamente al nuevo producto
    if (this.distribuidorFijo != null) {
      this.nuevaVenta.distribuidorId = this.distribuidorFijo;
    }
    this.nuevaVenta.esMayorista = !!this.nuevaVenta.distribuidorId;

        const producto = this.productos.find(p => p.id === this.selectedProductoId);
    if (!producto) return;

  // 1️⃣ Precio base
  let precioUnitario = producto.precioDetal;

  // 2️⃣ Precio mayorista
  if (this.nuevaVenta.esMayorista) {
    precioUnitario = producto.precioMayorista;
  }

  // 3️⃣ Precio especial del distribuidor si aplica
  if (this.nuevaVenta.distribuidorId) {
    const distribuidor = this.distribuidores.find(d => d.id === this.nuevaVenta.distribuidorId);
    const precioEspecial = distribuidor?.preciosEspeciales?.find(pp => pp.producto.id === producto.id)?.precioEspecial;
    if (precioEspecial != null) {
      precioUnitario = precioEspecial;
    }
  }

    const descuento = this.nuevaVenta.descuentoAdicional ?? 0;
    const subtotal = (precioUnitario - descuento) * this.selectedCantidad;
    this.listaProductosVenta.push({
      productoId: this.selectedProductoId,
      cantidad: this.selectedCantidad,
      precioUnitario,
      subtotal,
      descuentoAdicional: this.nuevaVenta.descuentoAdicional,
      distribuidorId: this.nuevaVenta.distribuidorId,
      esMayorista: this.nuevaVenta.esMayorista
    });

    this.selectedProductoId = undefined;
    this.selectedCantidad = undefined;
    this.selectedDescuento = undefined;

    this.nuevaVenta.distribuidorId = this.distribuidorFijo ?? undefined;
  }

  getTotalVenta(): number {
    return this.listaProductosVenta.reduce((total, item) => {
      const subtotal = item.subtotal ?? ((item.precioUnitario ?? 0) * item.cantidad);
      const descuento = item.descuentoAdicional ?? 0;
      return total + (subtotal - descuento);
    }, 0);
  }

  guardarVenta() {
    if (!this.nuevaVenta.nombreCliente) {
      Swal.fire("Error", "Debe ingresar el nombre del cliente", "warning");
      return;
    }

    if (this.listaProductosVenta.length === 0) {
      Swal.fire("Error", "Debe agregar al menos un producto", "warning");
      return;
    }

    const payload: VentaRequest = {
      nombreCliente: this.nuevaVenta.nombreCliente!,
      esMayorista: this.listaProductosVenta[0].esMayorista ?? false,
      descuentoAdicional: this.listaProductosVenta[0].descuentoAdicional,
      distribuidorId: this.listaProductosVenta[0].distribuidorId,
      productos: this.listaProductosVenta.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad
      }))
    };

    this.salesService.crearVenta(payload).subscribe({
      next: () => {
        Swal.fire("Éxito", "Venta registrada correctamente", "success");
        this.fnCerrarModal(1);
      },
      error: () =>
        Swal.fire("Error", "No se pudo guardar la venta", "error")
    });
  }

  eliminarProducto(index: number) {
    this.listaProductosVenta.splice(index, 1);
  }

  fnCerrarModal(result: any) {
    this.dialogRef.close(result === 1 ? result : undefined);
  }

  getNombreProducto(id: number | string | undefined): string {
    if (!id) return '---';
    return this.productos.find(p => p.id == id)?.nombre ?? '---';
  }

  getNombreDistribuidor(id: number | null | undefined): string {
    if (!id) return '---';
    return this.distribuidores.find(d => d.id === id)?.nombre ?? '---';
  }

}
