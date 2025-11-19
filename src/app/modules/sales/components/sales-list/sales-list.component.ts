import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { SalesFormComponent } from '../sales-form/sales-form.component';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {

appName: string = 'Gestión de Ventas';
  txtFiltro = new FormControl('');
  accionActual!: number;

  displayedColumns: string[] = [
    'nombreCliente',
    'producto',
    'cantidad',
    'precioUsado',
    'fecha',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private salesService: SalesService,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.listarVentas();
  }

  //#region Limpiar Caja de Texto
  async fnClearFilter() {
    if (this.dataSource) {
      this.dataSource.filter = '';
    }
  }
  //#endregion


  //#region Filtrado de Tabla
  applyFilter(event: Event) {
    //Leer el filtro
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    //Si hay paginacion
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //#endregion

  listarVentas() {
    this.salesService.listarVentas().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("ventas", this.dataSource.data)
      },
      error: (err) => {
        console.error('❌ Error al listar Ventas', err);
        Swal.fire('Error', 'No se pudieron cargar los Ventas', 'error');
      }
    });
  }

  //#region Abrir Modal
  async fnFormModal(accion: number, nIdVenta: number) {
    this.accionActual = accion;
    const dialogRef = this.dialog.open(SalesFormComponent, {
      width: '50rem',
      disableClose: true,
      data: {
        accion: accion, //0:Nuevo , 1:Editar
        nIdVenta: nIdVenta
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.listarVentas();
      }
    });
  }

  async fnEliminarVenta(id: number) {
    // Confirmar con SweetAlert
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará la venta de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    // Si cancela, salir
    if (!result.isConfirmed) return;

    // Llamar al servicio
    this.salesService.eliminarVenta(id).subscribe({
      next: () => {
        Swal.fire({
          title: 'venta eliminada',
          text: 'La venta ha sido eliminado correctamente.',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false
        });
        this.listarVentas(); // 🔄 refrescar la lista
      },
      error: (err) => {
        console.error('❌ Error al eliminar la venta:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la venta. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }


}
