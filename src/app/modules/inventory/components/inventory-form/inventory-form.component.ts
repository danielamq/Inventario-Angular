import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { InventoryService } from '../../services/inventory.service';
import { ProductoRequest } from '../../interfaces/ProductoRequest.interface';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {

  nuevoProducto: ProductoRequest = new ProductoRequest;

  sAccionModal: string = "";

  constructor(
    public dialogRef: MatDialogRef<InventoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inventoryService: InventoryService,

  ) {


    this.sAccionModal = this.data.accion == 0 ? "Agregar" : "Editar";
    console.log(this.sAccionModal)
  }

  ngOnInit(): void {
      if (this.data.accion === 1) {
        // 📝 Si es editar, cargamos los datos del producto por id
        this.inventoryService.obtenerProductoPorId(this.data.nIdProducto).subscribe({
          next: (res) => {
            this.nuevoProducto = res;
          },
          error: (err) => {
            console.error('❌ Error al cargar producto:', err);
            Swal.fire('Error', 'No se pudieron cargar los datos del producto', 'error');
          }
        });
      }
    }

    async crearProducto() {
      if (this.data.accion === 0) {
        this.inventoryService.crearProducto(this.nuevoProducto).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Producto creado con éxito',
              text: 'El producto se ha registrado correctamente.',
              icon: 'success',
              timer: 2500,
              showConfirmButton: false
            });
            this.fnCerrarModal(1); // Cierra modal con éxito
          },
          error: (err) => {
            console.error('❌ Error al crear producto:', err);
            Swal.fire('Error', 'No se pudo crear el producto. Intenta nuevamente.', 'error');
          }
        });

      } else if (this.data.accion === 1) {
        // 🔄 Actualizar producto 
        console.log("ID EN DATA", this.data.nIdProducto)
        this.inventoryService.actualizarProducto(this.data.nIdProducto, this.nuevoProducto).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Producto actualizado con éxito',
              text: 'El producto se ha modificado correctamente.',
              icon: 'success',
              timer: 2500,
              showConfirmButton: false
            });
            this.fnCerrarModal(1);
          },
          error: (err) => {
            console.error('❌ Error al actualizar producto:', err);
            Swal.fire('Error', 'No se pudo actualizar el producto. Intenta nuevamente.', 'error');
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