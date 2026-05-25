import {
  Component,
  OnInit,
  AfterViewInit
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

import {
  Chart,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({

  selector: 'app-reporte-inventario',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],

  templateUrl:
  './reporte-inventario.component.html'

})

export class ReporteInventarioComponent
implements OnInit, AfterViewInit {

  // API

  API =
  'http://localhost/scafi-angular/scafi-api/reporte-inventario.php';

  // VARIABLES

  inventario: any[] = [];

  inventarioOriginal: any[] = [];

  buscar = '';

  fechaInicio = '';

  fechaFin = '';

  fechaActual = new Date();

  usuario = 'Administrador';

  grafica: any;

  constructor(
    private http: HttpClient
  ) {}

  // INIT

  ngOnInit(): void {

    this.cargar();

  }

  // AFTER VIEW

  ngAfterViewInit(): void {

    setTimeout(() => {

      this.crearGrafica();

    }, 1000);

  }

  // CARGAR

  cargar() {

    this.http
      .get<any[]>(this.API)

      .subscribe({

        next: (res) => {

          this.inventario = res || [];

          this.inventarioOriginal =
          [...this.inventario];

          setTimeout(() => {

            this.crearGrafica();

          }, 500);

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // FILTRO FECHAS

  filtrarFechas() {

    if(
      !this.fechaInicio ||

      !this.fechaFin
    ){

      this.inventario =
      [...this.inventarioOriginal];

      return;

    }

    this.inventario =
    this.inventarioOriginal.filter(i => {

      return (

        i.fechaIngreso >= this.fechaInicio &&

        i.fechaIngreso <= this.fechaFin

      );

    });

    this.crearGrafica();

  }

  // LIMPIAR FILTRO

  limpiarFiltro() {

    this.fechaInicio = '';

    this.fechaFin = '';

    this.inventario =
    [...this.inventarioOriginal];

    this.crearGrafica();

  }

  // FILTRAR TEXTO

  inventarioFiltrado() {

    return this.inventario.filter(i =>

      (i.nombre || '')
      .toLowerCase()
      .includes(
        this.buscar.toLowerCase()
      )

      ||

      (i.tipo || '')
      .toLowerCase()
      .includes(
        this.buscar.toLowerCase()
      )

    );

  }

  // TOTAL PRODUCTOS

  totalProductos() {

    return this.inventario.length;

  }

  // PRODUCTOS CRITICOS

  productosCriticos() {

    return this.inventario.filter(i =>

      Number(i.stock)
      <=
      Number(i.stockMinimo)

    ).length;

  }

  // PRODUCTOS NORMALES

  productosNormales() {

    return this.inventario.filter(i =>

      Number(i.stock)
      >
      Number(i.stockMinimo)

    ).length;

  }

  // VALOR INVENTARIO

  valorInventario() {

    return this.inventario.reduce(

      (acc, i) =>

        acc +

        (
          Number(i.stock)
          *
          Number(i.precio)
        ),

      0

    );

  }

  // LISTA CRITICOS

  listaCriticos() {

    return this.inventario.filter(i =>

      Number(i.stock)
      <=
      Number(i.stockMinimo)

    );

  }

  // GRAFICA

  crearGrafica() {

    if (this.grafica) {

      this.grafica.destroy();

    }

    this.grafica = new Chart(

      'graficaInventario',

      {

        type: 'bar',

        data: {

          labels:
          this.inventario.map(
            i => i.nombre
          ),

          datasets: [

            {

              label: 'Stock Actual',

              data:
              this.inventario.map(
                i => Number(i.stock)
              ),

              backgroundColor:
              '#16a34a',

              borderRadius: 10

            }

          ]

        },

        options: {

          responsive: true,

          plugins: {

            legend: {

              labels: {

                color: '#111827'

              }

            }

          },

          scales: {

            y: {

              beginAtZero: true

            }

          }

        }

      }

    );

  }

  // IMPRIMIR

  imprimir() {

    window.print();

  }

  // EXPORTAR PDF

  exportarPDF() {

    window.print();

  }

}