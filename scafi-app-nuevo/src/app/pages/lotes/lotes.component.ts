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
  estado = '';

  buscar = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    this.cargar();
  }

  // =========================
  // CARGAR
  // =========================
  cargar(): void {

    this.http.get<any[]>(this.api)
      .subscribe({

        next: (res) => {

          this.lotes = res;
        },

        error: (err) => {

          console.log(err);
        }

      });
  }

  // =========================
  // GUARDAR
  // =========================
  guardar(): void {

    const formData = new FormData();

    formData.append('nombreLote', this.nombreLote);
    formData.append('ubicacion', this.ubicacion);
    formData.append('hectareas', this.hectareas);
    formData.append('estado', this.estado);

    this.http.post<any>(this.api, formData)
      .subscribe({

        next: (res) => {

          if (res.ok) {

            alert('Lote guardado');

            this.limpiar();

            this.cargar();
          }
        },

        error: (err) => {

          console.log(err);
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
    this.estado = '';
  }

}