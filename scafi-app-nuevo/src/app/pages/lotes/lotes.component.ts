import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lotes.component.html'
})
export class LotesComponent implements OnInit {

  api = 'http://localhost/scafi-angular/scafi-api/lotes.php';

  lotes: any[] = [];

  nombreLote = '';
  ubicacion = '';
  hectareas = '';

  buscar = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargar();
  }

  // =========================
  // CARGAR LOTES
  // =========================
  cargar(): void {

    this.http.get<any[]>(this.api)
      .subscribe({

        next: (res) => {
          this.lotes = res;
        },

        error: (err) => {
          console.log('Error al cargar lotes:', err);
        }

      });
  }

  // =========================
  // GUARDAR LOTE
  // =========================
  guardar(): void {

    // VALIDAR DATOS OBLIGATORIOS
    if (
      !this.nombreLote.trim() ||
      !this.ubicacion.trim() ||
      !this.hectareas
    ) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const formData = new FormData();

    formData.append('nombreLote', this.nombreLote);
    formData.append('ubicacion', this.ubicacion);
    formData.append('hectareas', this.hectareas);

    // El lote nuevo siempre se registra como ACTIVO
    formData.append('estado', 'Activo');

    this.http.post<any>(this.api, formData)
      .subscribe({

        next: (res) => {

          if (res.ok) {

            alert('Lote registrado correctamente como Activo.');

            this.limpiar();

            // Recargar tabla inmediatamente
            this.cargar();

          } else {

            alert('No fue posible registrar el lote.');

            console.error(res);
          }
        },

        error: (err) => {

          console.error('Error al guardar lote:', err);

          alert('Error de conexión con el servidor.');
        }

      });
  }
  // =========================
  // ACTIVAR / INACTIVAR LOTE
  // =========================
  cambiarEstado(lote: any): void {

    const nuevoEstado =
      lote.estado === 'Activo'
        ? 'Inactivo'
        : 'Activo';

    const confirmar = confirm(
      `¿Desea cambiar el lote "${lote.nombreLote}" a ${nuevoEstado}?`
    );

    if (!confirmar) {
      return;
    }

    const formData = new FormData();

    formData.append('accion', 'actualizar_estado');
    formData.append('idLote', lote.idLote);
    formData.append('estado', nuevoEstado);

    this.http.post<any>(this.api, formData)
      .subscribe({

        next: (res) => {

          if (res.ok) {

            alert(`Lote actualizado a ${nuevoEstado}.`);

            this.cargar();

          } else {

            alert('No fue posible actualizar el estado.');

            console.error(res);
          }
        },

        error: (err) => {

          console.error('Error al actualizar estado:', err);

          alert('Error de conexión con el servidor.');
        }

      });
  }
  // =========================
  // FILTRAR
  // =========================
  lotesFiltrados() {

    return this.lotes.filter(l =>

      l.nombreLote
        .toLowerCase()
        .includes(this.buscar.toLowerCase())

    );
  }

  // =========================
  // LIMPIAR
  // =========================
  limpiar(): void {

    this.nombreLote = '';
    this.ubicacion = '';
    this.hectareas = '';
  }

  // PAGINACIÓN
  paginaActual = 1;
  readonly registrosPorPagina = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.lotesFiltrados().length / this.registrosPorPagina));
  }

  get lotesPagina(): any[] {
    const datos = this.lotesFiltrados()();
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