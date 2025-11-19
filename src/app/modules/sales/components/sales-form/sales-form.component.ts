import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, OnInit, Inject } from "@angular/core";
import { VentaRequest } from "../../interfaces/VentaRequest.interface";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/shared/services/AppDateAdapter";
import { InventoryService } from "src/app/modules/inventory/services/inventory.service";
import { UsersService } from "src/app/modules/users/services/users.service";

import Swal from "sweetalert2";
import { SalesService } from "../../services/sales.service";
import { ProductoEntity } from "src/app/modules/inventory/interfaces/ProductoEntity.interface";
import { DistribuidorEntity } from "src/app/modules/users/interfaces/DistribuidorEntity.interface";

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

  nuevaVenta: VentaRequest = new VentaRequest();
  productos: ProductoEntity[] = [];
  distribuidores: DistribuidorEntity[] = [];
  listaProductosVenta: VentaRequest[] = [];
  distribuidorFijo: number | null = null;

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
      next: (res) => {
        this.nuevaVenta = res;
        if (res.producto && res.producto.id) {
          this.nuevaVenta.productoId = res.producto.id;
        }
      },
      error: () => Swal.fire("Error", "No se pudo cargar la venta", "error")
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
    if (!this.nuevaVenta.productoId || !this.nuevaVenta.cantidad) {
      Swal.fire("Error", "Debe seleccionar producto y cantidad", "warning");
      return;
    }

    // Si aún NO existe distribuidor fijo y este producto trae uno → fijarlo
    if (this.distribuidorFijo == null && this.nuevaVenta.distribuidorId) {
      this.distribuidorFijo = this.nuevaVenta.distribuidorId;
    }

    // Si YA existe distribuidor fijo → asignarlo automáticamente al nuevo producto
    if (this.distribuidorFijo != null) {
      this.nuevaVenta.distribuidorId = this.distribuidorFijo;
    }

    this.nuevaVenta.esMayorista = !!this.nuevaVenta.distribuidorId;
    // Agregar el producto a la lista
    this.listaProductosVenta.push({
      productoId: this.nuevaVenta.productoId,
      cantidad: this.nuevaVenta.cantidad,
      descuentoAdicional: this.nuevaVenta.descuentoAdicional,
      distribuidorId: this.nuevaVenta.distribuidorId,
      esMayorista: this.nuevaVenta.esMayorista
    });

    // 4️⃣ Limpiar los campos del producto
    this.nuevaVenta.productoId = undefined;
    this.nuevaVenta.cantidad = undefined;
    this.nuevaVenta.descuentoAdicional = undefined;

    // 👉 Si hay distribuidor fijo, mantenerlo visible internamente
    this.nuevaVenta.distribuidorId = this.distribuidorFijo ?? undefined;
  }

  eliminarProducto(index: number) {
    this.listaProductosVenta.splice(index, 1);
  }

  async guardarVenta() {
    if (!this.nuevaVenta.nombreCliente) {
      Swal.fire("Error", "Debe ingresar el nombre del cliente", "warning");
      return;
    }

    // Si solo llenó un producto sin presionar "Agregar"
    if (this.listaProductosVenta.length === 0 && this.nuevaVenta.productoId) {
      this.listaProductosVenta.push({
        productoId: this.nuevaVenta.productoId,
        cantidad: this.nuevaVenta.cantidad,
        descuentoAdicional: this.nuevaVenta.descuentoAdicional,
        distribuidorId: this.nuevaVenta.distribuidorId,
        esMayorista: this.nuevaVenta.esMayorista
      });
    }

    if (this.listaProductosVenta.length === 0) {
      Swal.fire("Error", "Debe agregar al menos un producto", "warning");
      return;
    }

    const payload = this.listaProductosVenta.map(item => ({
      nombreCliente: this.nuevaVenta.nombreCliente,
      productoId: item.productoId,
      cantidad: item.cantidad,
      descuentoAdicional: item.descuentoAdicional,
      distribuidorId: item.distribuidorId,
      esMayorista: item.esMayorista
    }));

    console.log("📤 Enviando:", payload);

    this.salesService.crearVenta(payload).subscribe({
      next: () => {
        Swal.fire("Éxito", "Venta registrada correctamente", "success");
        this.fnCerrarModal(1);
      },
      error: () => Swal.fire("Error", "No se pudo guardar la venta", "error")
    });
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
