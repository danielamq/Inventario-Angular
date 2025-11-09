import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UsersFormComponent } from '../users-form/users-form.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

appName: string = 'Gestión de Inventario';
  txtFiltro = new FormControl('');
  accionActual!: number;

  displayedColumns: string[] = [
    'nombre',
    'producto',
    'cantidadConsignada',
    'precioMayorista',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.listarDistribuidores();
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

  listarDistribuidores() {
    this.usersService.listarDistribuidores().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("distribuidores", this.dataSource.data)
      },
      error: (err) => {
        console.error('❌ Error al listar Distribuidores', err);
        Swal.fire('Error', 'No se pudieron cargar los Distribuidores', 'error');
      }
    });
  }

  //#region Abrir Modal
  async fnFormModal(accion: number, nIdDistribuidor: number) {
    this.accionActual = accion;
    const dialogRef = this.dialog.open(UsersFormComponent, {
      width: '50rem',
      disableClose: true,
      data: {
        accion: accion, //0:Nuevo , 1:Editar
        nIdDistribuidor: nIdDistribuidor
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.listarDistribuidores();
      }
    });
  }

  async fnEliminarDistribuidor(id: number) {
    // Confirmar con SweetAlert
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el distribuidor de forma permanente.',
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
    this.usersService.eliminarDistribuidor(id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Distribuidor eliminado',
          text: 'El distribuidor ha sido eliminado correctamente.',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false
        });
        this.listarDistribuidores(); // 🔄 refrescar la lista
      },
      error: (err) => {
        console.error('❌ Error al eliminar Distribuidor:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el distribuodor. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }


}
