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

  nuevoDistribuidor: DistribuidorRequest = new DistribuidorRequest;
  productos: ProductoEntity[] = [];

  sAccionModal: string = "";

  constructor(
    public dialogRef: MatDialogRef<UsersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
    private inventoryService: InventoryService,
  ) {


    this.sAccionModal = this.data.accion == 0 ? "Agregar" : "Editar";
    console.log(this.sAccionModal)
  }

  ngOnInit(): void {
    // 1. Cargar productos primero
    this.cargarProductos();

    // 2. Si es edición, cargar los datos del distribuidor
    if (this.data.accion === 1) {
      this.usersService.obtenerDistribuidorPorId(this.data.nIdDistribuidor).subscribe({
        next: (res) => {
          this.nuevoDistribuidor = res;

          // ⚡ Asegurar que el productoId se asigne correctamente
          if (res.producto && res.producto.id) {
            this.nuevoDistribuidor.productoId = res.producto.id;
          }
        },
        error: (err) => {
          console.error('❌ Error al cargar distribuidor:', err);
          Swal.fire('Error', 'No se pudieron cargar los datos del distribuidor', 'error');
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

  async guardarDistribuidor() {
    // Validaciones básicas
    if (!this.nuevoDistribuidor.nombre || !this.nuevoDistribuidor.productoId) {
      Swal.fire('Error', 'Debes completar nombre y seleccionar un producto', 'warning');
      return;
    }

    // Si es creación
    if (this.data.accion === 0) {
      this.usersService.crearDistribuidor(this.nuevoDistribuidor).subscribe({
        next: () => {
          Swal.fire({
            title: 'Distribuidor creado con éxito',
            text: 'El distribuidor se ha registrado correctamente.',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false
          });
          this.fnCerrarModal(1);
        },
        error: (err) => {
          console.error('❌ Error al crear distribuidor:', err);
          Swal.fire('Error', 'No se pudo crear el distribuidor. Intenta nuevamente.', 'error');
          console.log("datso enviados", this.nuevoDistribuidor)
        }
      });

    } else if (this.data.accion === 1) {
      // Si es edición
      this.usersService.actualizarDistribuidor(this.data.nIdDistribuidor, this.nuevoDistribuidor).subscribe({
        next: () => {
          Swal.fire({
            title: 'Distribuidor actualizado con éxito',
            text: 'El distribuidor se ha modificado correctamente.',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false
          });
          this.fnCerrarModal(1);
        },
        error: (err) => {
          console.error('❌ Error al actualizar distribuidor:', err);
          Swal.fire('Error', 'No se pudo actualizar el distribuidor. Intenta nuevamente.', 'error');
        }
      });
    }
  }

    fnCerrarModal(result: any) {
      if (result === 1) {
        this.dialogRef.close(result); // devuelve resultado al padre
      } else {
        this.dialogRef.close(); // cierra sin recargar
      }
    }

  }