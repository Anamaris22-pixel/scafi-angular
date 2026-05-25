import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import {
  RouterModule
} from '@angular/router';

@Component({

  selector: 'app-reporte-produccion',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],

  templateUrl:
  './reporte-produccion.component.html'

})

export class ReporteProduccionComponent
implements OnInit {

  // =========================
  // API
  // =========================

  API =
  'http://localhost/scafi-angular/scafi-api/reporte-produccion.php';

  // =========================
  // VARIABLES
  // =========================

  produccion: any[] = [];

  produccionOriginal: any[] = [];

  topRecolectores: any[] = [];

  cargando = false;

  fechaActual = new Date();

  usuario = 'Administrador';

  fechaInicio = '';

  fechaFin = '';

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.cargar();

  }

  // =========================
  // CARGAR
  // =========================

  cargar() {

    this.cargando = true;

    this.http
      .get<any>(this.API)

      .subscribe({

        next: (res) => {

          console.log(res);

          this.produccion =
          res.produccion || [];

          this.produccionOriginal =
          [...this.produccion];

          this.topRecolectores =
          res.topRecolectores || [];

          this.cargando = false;

        },

        error: (err) => {

          console.log(err);

          this.cargando = false;

        }

      });

  }

  // =========================
  // FILTRAR FECHAS
  // =========================

  filtrarFechas() {

    if(
      !this.fechaInicio ||

      !this.fechaFin
    ){

      this.produccion =
      [...this.produccionOriginal];

      return;

    }

    this.produccion =
    this.produccionOriginal.filter(

      item => {

        return (

          item.fecha >= this.fechaInicio &&

          item.fecha <= this.fechaFin

        );

      }

    );

  }

  // =========================
  // LIMPIAR FILTRO
  // =========================

  limpiarFiltro() {

    this.fechaInicio = '';

    this.fechaFin = '';

    this.produccion =
    [...this.produccionOriginal];

  }

  // =========================
  // TOTAL REGISTROS
  // =========================

  totalRegistros() {

    return this.produccion.length;

  }

  // =========================
  // TOTAL PRODUCCIÓN
  // =========================

  totalProduccion() {

    return this.produccion.reduce(

      (acc, item) =>

        acc +

        Number(
          item.cantidad || 0
        ),

      0

    );

  }

  // =========================
  // PROMEDIO
  // =========================

  promedioProduccion() {

    if(this.produccion.length === 0){

      return 0;

    }

    return (

      this.totalProduccion()

      /

      this.produccion.length

    ).toFixed(1);

  }

  // =========================
  // PRODUCCIÓN ALTA
  // =========================

  produccionAlta() {

    return this.produccion.filter(

      item =>

      Number(
        item.cantidad || 0
      ) >= 100

    ).length;

  }

  // =========================
  // MEJOR RECOLECTOR
  // =========================

  mejorRecolector() {

    if(this.topRecolectores.length === 0){

      return 'Sin datos';

    }

    return (

      this.topRecolectores[0]
      .recolector +

      ' (' +

      this.topRecolectores[0]
      .total +

      ' KG)'

    );

  }

  // =========================
  // IMPRIMIR
  // =========================

  imprimir() {

    window.print();

  }

  // =========================
  // EXPORTAR PDF
  // =========================

  exportarPDF(){

    window.print();

  }

}