import { MAT_DIALOG_DATA, MatDialogRef, } from "@angular/material/dialog";
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

  nuevaVenta: VentaRequest = new VentaRequest;
  productos: ProductoEntity[] = [];
  distribuidores: DistribuidorEntity[] = []

  sAccionModal: string = "";

  constructor(
    public dialogRef: MatDialogRef<SalesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private salesService: SalesService,
    private inventoryService: InventoryService,
    private usersService: UsersService,
  ) {


    this.sAccionModal = this.data.accion == 0 ? "Agregar" : "Editar";
    console.log(this.sAccionModal)
  }

  ngOnInit(): void {
    // 1. Cargar productos primero
    this.cargarProductos();
    this.cargarDistribuidores()

    // 2. Si es edición, cargar los datos del distribuidor
    if (this.data.accion === 1) {
      this.salesService.obtenerVentaPorId(this.data.nIdVenta).subscribe({
        next: (res) => {
          this.nuevaVenta = res;

          // ⚡ Asegurar que el productoId se asigne correctamente
          if (res.producto && res.producto.id) {
            this.nuevaVenta.productoId = res.producto.id;
          }
        },
        error: (err) => {
          console.error('❌ Error al cargar la venta:', err);
          Swal.fire('Error', 'No se pudieron cargar los datos de la venta', 'error');
        }
      });
    }
  }

  cargarProductos() {
    this.inventoryService.listarProductos().subscribe({
      next: (res: ProductoEntity[]) => {
        this.productos = res;
        console.log('✅ Productos cargados:', this.productos);
      },
      error: (err) => console.error('❌ Error cargando productos:', err)
    });
  }

  cargarDistribuidores() {
    this.usersService.listarDistribuidores().subscribe({
      next: (res: DistribuidorEntity[]) => {
        this.distribuidores = res;
        console.log('✅ Distribuidores cargados:', this.productos);
      },
      error: (err) => console.error('❌ Error cargando Distribuidores:', err)
    });
  }

  async guardarVenta() {
    // Validaciones básicas
    if (!this.nuevaVenta.nombreCliente || !this.nuevaVenta.productoId) {
      Swal.fire('Error', 'Debes completar nombre y seleccionar un producto', 'warning');
      return;
    }

    // Si es creación
    if (this.data.accion === 0) {
      this.salesService.crearVenta(this.nuevaVenta).subscribe({
        next: () => {
          Swal.fire({
            title: 'Venta creada con éxito',
            text: 'La venta se ha registrado correctamente.',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false
          });
          this.fnCerrarModal(1);
        },
        error: (err) => {
          console.error('❌ Error al crear venta:', err);
          Swal.fire('Error', 'No se pudo crear la venta. Intenta nuevamente.', 'error');
          console.log("datso enviados", this.nuevaVenta)
        }
      });

    }
  }

  onDistribuidorChange(valor: any) {
    this.nuevaVenta.esMayorista = valor != null;
  }

    fnCerrarModal(result: any) {
      if (result === 1) {
        this.dialogRef.close(result); // devuelve resultado al padre
      } else {
        this.dialogRef.close(); // cierra sin recargar
      }
    }

  }