import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { InventoryService } from '../../services/inventory.service';
import { InventoryFormComponent } from '../inventory-form/inventory-form.component';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {


  appName: string = 'Gestión de Inventario';
  txtFiltro = new FormControl('');
  accionActual!: number;

  displayedColumns: string[] = [
    'nombre',
    'costo',
    'cantidadReal',
    'cantidadConsignacion',
    'precioMayorista',
    'precioDetal',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inventoryService: InventoryService,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.listarProductos();
  }

  async fnClearFilter() {
    if (this.dataSource) {
      this.dataSource.filter = '';
    }
  }

  applyFilter(event: Event) {
    //Leer el filtro
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    //Si hay paginacion
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  listarProductos() {
    this.inventoryService.listarProductos().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('❌ Error al listar productos', err);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      }
    });
  }

  async fnFormModal(accion: number, nIdProducto: number) {
    this.accionActual = accion;
    const dialogRef = this.dialog.open(InventoryFormComponent, {
      width: '50rem',
      disableClose: true,
      data: {
        accion: accion, //0:Nuevo , 1:Editar
        nIdProducto: nIdProducto
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.listarProductos();
      }
    });
  }

  async fnCambiarStock(nIdProducto: number, nStock: number) {
    const { value: valor } = await Swal.fire({
      title: "Agregar stock",
      icon: 'question',
      input: 'number',
      inputPlaceholder: `En este momento hay ${nStock}`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    });

    if (!valor) return;

    const cantidad = parseInt(valor, 10);
    this.inventoryService.actualizarStock(nIdProducto, cantidad).subscribe({
      next: () => {
        Swal.fire({
          title: "Stock actualizado con éxito",
          icon: 'success',
          timer: 2500,
          showConfirmButton: false,
        });
        this.listarProductos();
      },
      error: (e) => {
        console.error('❌ Error al actualizar stock:', e);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el stock. Intenta nuevamente.',
          icon: 'error',
        });
      },
    });
  }

  async fnEliminarProducto(id: number) {
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el producto de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    this.inventoryService.eliminarProducto(id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Producto eliminado',
          text: 'El producto ha sido eliminado correctamente.',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false
        });
        this.listarProductos();
      },
      error: (err) => {
        console.error('❌ Error al eliminar producto:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el producto. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }


}
