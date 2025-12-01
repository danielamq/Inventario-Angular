import { MAT_DIALOG_DATA, MatDialogRef, } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import { DistribuidorRequest } from "../../interfaces/DistribuidorRequest.interface";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/shared/services/AppDateAdapter";
import { InventoryService } from "src/app/modules/inventory/services/inventory.service";

import Swal from "sweetalert2";
import { UsersService } from "../../services/users.service";
import { ProductoEntity } from "src/app/modules/inventory/interfaces/ProductoEntity.interface";
@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class UsersFormComponent implements OnInit {

  productoSeleccionadoId: number | null = null;
  cantidadConsignada: number | null = null;
  productoPrecioId: number | null = null;
  precioEspecial: number | null = null;

  productos: ProductoEntity[] = [];

  // Formulario principal
  nuevoDistribuidor: DistribuidorRequest = {
    nombre: '',
    productos: [],
    preciosEspeciales: [],
    productosAEliminar: [] as number[]
  };
  
  

  sAccionModal: string = "";

  constructor(
    public dialogRef: MatDialogRef<UsersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
    private inventoryService: InventoryService,
  ) {
    this.sAccionModal = this.data.accion === 0 ? "Agregar" : "Editar";
  }

  ngOnInit(): void {
    this.cargarProductos();

    if (this.data.accion === 1) {
      this.cargarDistribuidor(this.data.nIdDistribuidor);
    }
  }

  cargarProductos() {
    this.inventoryService.listarProductos().subscribe({
      next: (res) => (this.productos = res),
      error: () =>
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error'),
    });
  }

  // CARGAR DISTRIBUIDOR PARA EDICIÓN
  cargarDistribuidor(id: number) {
    this.usersService.obtenerDistribuidorPorId(id).subscribe({
      next: (res) => {
        this.nuevoDistribuidor = {
          nombre: res.nombre,
          productos: res.productos.map((p: any) => ({
            id: p.id,
            productoId: p.producto.id,
            cantidadConsignada: p.cantidadConsignada,
            cantidadTotal: p.cantidadConsignada,
            cantidadIngresada: 0
          })),
          preciosEspeciales: res.preciosEspeciales?.map((pe: any) => ({
            productoId: pe.producto.id,
            precioEspecial: pe.precioEspecial,
          })) || []
        };
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el distribuidor', 'error');
      },
    });
  }

  // AGREGAR PRODUCTO CONSIGNADO
  agregarProducto() {
    if (!this.productoSeleccionadoId || !this.cantidadConsignada) {
      Swal.fire('Advertencia', 'Debe seleccionar producto y cantidad', 'warning');
      return;
    }

    this.nuevoDistribuidor.productos.push({
      productoId: this.productoSeleccionadoId,
      cantidadConsignada: this.cantidadConsignada
    });

    this.productoSeleccionadoId = null;
    this.cantidadConsignada = null;
  }

  eliminarProducto(i: number) {
    const producto = this.nuevoDistribuidor.productos[i];

    if (producto.productoId) { 
      if (!this.nuevoDistribuidor.productosAEliminar) {
        this.nuevoDistribuidor.productosAEliminar = [];
      }
      this.nuevoDistribuidor.productosAEliminar.push(producto.productoId);
      console.log(producto)
      
  console.log('productosAEliminar', this.nuevoDistribuidor.productosAEliminar);
    }
    this.nuevoDistribuidor.productos.splice(i, 1);
  }

  actualizarCantidadProducto(index: number) {
    const item = this.nuevoDistribuidor.productos[index];
    const cantidad = 0;


    // Llamada al backend para actualizar stock
    this.inventoryService.actualizarStock(item.productoId, cantidad)
      .subscribe({
        next: () => {
          Swal.fire({
            title: "Stock actualizado con éxito",
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          console.error('Error al actualizar stock', err);
          alert('No se pudo actualizar la cantidad. Intente nuevamente.');
        }
      });
  }


  // AGREGAR PRECIO ESPECIAL
  agregarPrecioEspecial() {
    if (!this.productoPrecioId || !this.precioEspecial) {
      Swal.fire('Advertencia', 'Debe seleccionar producto y precio', 'warning');
      return;
    }

    this.nuevoDistribuidor.preciosEspeciales!.push({
      productoId: this.productoPrecioId,
      precioEspecial: this.precioEspecial
    });

    this.productoPrecioId = null;
    this.precioEspecial = null;
  }

  eliminarPrecio(i: number) {
    this.nuevoDistribuidor.preciosEspeciales!.splice(i, 1);
  }

  // GUARDAR / EDITAR DISTRIBUIDOR
  guardarDistribuidor() {
    if (!this.nuevoDistribuidor.nombre.trim()) {
      Swal.fire('Error', 'Debes ingresar el nombre del distribuidor', 'warning');
      return;
    }

    if (this.nuevoDistribuidor.productos.length === 0) {
      Swal.fire('Error', 'Debes agregar al menos un producto consignado', 'warning');
      return;
    }

    if (this.data.accion === 0) {
      // Crear
      this.usersService.crearDistribuidor(this.nuevoDistribuidor).subscribe({
        next: () => {
          Swal.fire('Distribuidor creado con éxito', '', 'success');
          this.fnCerrarModal(1);
        },
        error: () => Swal.fire('Error', 'No se pudo crear el distribuidor', 'error')
      });

    } else {
      this.usersService.actualizarDistribuidor(
        this.data.nIdDistribuidor,
        this.nuevoDistribuidor
      ).subscribe({
        next: () => {
          const actualizaciones: any[] = [];
          Swal.fire('Distribuidor actualizado con éxito', '', 'success');
          this.fnCerrarModal(1);
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el distribuidor', 'error')
      });
    }
  }
  

  getNombreProducto(id: number): string {
    const prod = this.productos.find(p => p.id === id);
    return prod ? prod.nombre : '—';
  }

  fnCerrarModal(result?: any) {
    this.dialogRef.close(result ?? 0);
  }

}