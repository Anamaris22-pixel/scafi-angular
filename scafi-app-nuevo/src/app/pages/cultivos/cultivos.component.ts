import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cultivos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './cultivos.component.html'
})
export class CultivosComponent implements OnInit {
  api = 'http://localhost/scafi-angular/scafi-api/cultivos.php';
  apiLotes = 'http://localhost/scafi-angular/scafi-api/lotes.php';

  cultivos: any[] = [];
  lotes: any[] = [];

  buscar = '';
  mostrarFormulario = false;
  editando = false;
  idEditar = 0;

  idLote = '';
  tipoCafe = '';
  fechaSiembra = '';
  estado = '';

  constructor(private http: HttpClient) {}

  // ======================
  // INIT
  // ======================
  ngOnInit(): void {
    this.cargar();
    this.cargarLotes();
  }

  // ======================
  // CARGAR CULTIVOS
  // ======================
  cargar(): void {
    this.http.get<any>(this.api).subscribe({
      next: (res) => {
        console.log(res);
        this.cultivos = res.datos || [];
      },
      error: (err) => {
        console.error('Error al cargar cultivos:', err);
      },
      complete: () => {
        console.log('Carga de cultivos finalizada');
      }
    });
  }

  // ======================
  // CARGAR LOTES
  // ======================
  cargarLotes(): void {
    this.http.get<any[]>(this.apiLotes).subscribe({
      next: (res) => {
        console.log(res);
        this.lotes = res || [];
      },
      error: (err) => {
        console.error('Error al cargar lotes:', err);
      },
      complete: () => {
        console.log('Carga de lotes finalizada');
      }
    });
  }

  // ======================
  // GUARDAR
  // ======================
  guardar(): void {

  // VALIDAR CAMPOS OBLIGATORIOS
  if (
    !this.idLote ||
    !this.tipoCafe ||
    !this.fechaSiembra ||
    !this.estado
  ) {
    alert('Por favor, complete todos los campos obligatorios.');
    return;
  }

  const formData = new FormData();

  formData.append('idLote', this.idLote);
  formData.append('tipoCafe', this.tipoCafe);
  formData.append('fechaSiembra', this.fechaSiembra);
  formData.append('estado', this.estado);

  this.http.post<any>(this.api, formData).subscribe({
    next: (res) => {

      console.log(res);

      if (res.ok) {
        alert('Cultivo guardado');
        this.cargar();
        this.limpiar();
        this.mostrarFormulario = false;
      }

    },

    error: (err) => {
      console.error('Error al guardar cultivo:', err);
    },

    complete: () => {
      console.log('Guardado de cultivo finalizado');
    }

  });
}

  // ======================
  // EDITAR
  // ======================
  editar(c: any): void {
    this.editando = true;
    this.mostrarFormulario = true;
    this.idEditar = c.idCultivo;

    this.idLote = c.idLote;
    this.tipoCafe = c.tipoCafe;
    this.fechaSiembra = c.fechaSiembra;
    this.estado = c.estado;
  }

  // ======================
  // ACTUALIZAR
  // ======================
  actualizar(): void {
    const datos = {
      id: this.idEditar,
      idLote: this.idLote,
      tipoCafe: this.tipoCafe,
      fechaSiembra: this.fechaSiembra,
      estado: this.estado
    };

    this.http.put<any>(this.api, datos).subscribe({
      next: (res) => {
        console.log(res);
        if (res.ok) {
          alert('Cultivo actualizado');
          this.cargar();
          this.cancelar();
        }
      },
      error: (err) => {
        console.error('Error al actualizar cultivo:', err);
      },
      complete: () => {
        console.log('Actualización de cultivo finalizada');
      }
    });
  }

  // ======================
  // ELIMINAR
  // ======================
  eliminar(id: number): void {
    if (!confirm('¿Eliminar cultivo?')) return;

    this.http.delete<any>(`${this.api}?id=${id}`).subscribe({
      next: (res) => {
        console.log(res);
        if (res.ok) {
          this.cargar();
        }
      },
      error: (err) => {
        console.error('Error al eliminar cultivo:', err);
      },
      complete: () => {
        console.log('Eliminación de cultivo finalizada');
      }
    });
  }

  // ======================
  // CANCELAR
  // ======================
  cancelar(): void {
    this.editando = false;
    this.idEditar = 0;
    this.limpiar();
    this.mostrarFormulario = false;
  }

  // ======================
  // LIMPIAR
  // ======================
  limpiar(): void {
    this.idLote = '';
    this.tipoCafe = '';
    this.fechaSiembra = '';
    this.estado = '';
  }

  // ======================
  // FILTRAR
  // ======================
  cultivosFiltrados() {
    return this.cultivos.filter((c: any) => {
      const lote = (c.nombreLote || '').toLowerCase();
      const cafe = (c.tipoCafe || '').toLowerCase();
      const buscar = this.buscar.toLowerCase();

      return lote.includes(buscar) || cafe.includes(buscar);
    });
  }
  // PAGINACIÓN
  paginaActual = 1;
  readonly registrosPorPagina = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.cultivosFiltrados().length / this.registrosPorPagina));
  }

  get cultivosPagina(): any[] {
    const datos = this.cultivosFiltrados();
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return datos.slice(inicio, inicio + this.registrosPorPagina);
  }

  irPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  paginaAnterior(): void { this.irPagina(this.paginaActual - 1); }
  paginaSiguiente(): void { this.irPagina(this.paginaActual + 1); }
  reiniciarPaginacion(): void { this.paginaActual = 1; }

}