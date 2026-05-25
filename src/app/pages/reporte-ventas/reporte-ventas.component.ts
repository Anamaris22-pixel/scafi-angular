// ======================================================
// REPORTE VENTAS TS COMPLETO
// ======================================================

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

import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

@Component({

  selector: 'app-reporte-ventas',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],

  templateUrl:
  './reporte-ventas.component.html'

})

export class ReporteVentasComponent
implements OnInit {

  // ======================================================
  // API
  // ======================================================

  private readonly API =
  'http://localhost/scafi-angular/scafi-api/reporte-ventas.php';

  // ======================================================
  // VARIABLES
  // ======================================================

  ventas: any[] = [];

  ventasFiltradas: any[] = [];

  fechaInicio = '';

  fechaFin = '';

  fechaActual =
  new Date();

  usuario =
  'Administrador';

  totalGeneral = 0;

  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(
    private http: HttpClient
  ) {}

  // ======================================================
  // INIT
  // ======================================================

  ngOnInit(): void {

    this.cargarVentas();

  }

  // ======================================================
  // CARGAR DATOS
  // ======================================================

  cargarVentas(): void {

    this.http
      .get<any[]>(this.API)

      .subscribe({

        next: (res) => {

          this.ventas = res.map(v => ({

            ...v,

            idVenta:
            v.idVenta,

            total:
            Number(v.total),

            cantidad:
            Number(v.cantidad)

          }));

          this.ventasFiltradas =
          [...this.ventas];

          this.actualizarCalculos();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  // ======================================================
  // CALCULOS
  // ======================================================

  actualizarCalculos(): void {

    this.totalGeneral =
    this.ventasFiltradas.reduce(

      (sum, v) =>

      sum + v.total,

      0

    );

  }

  promedioVentas(): number {

    if(this.ventasFiltradas.length === 0){

      return 0;

    }

    return (

      this.totalGeneral

      /

      this.ventasFiltradas.length

    );

  }

  obtenerVentaAlta(): number {

    if(this.ventasFiltradas.length === 0){

      return 0;

    }

    return Math.max(

      ...this.ventasFiltradas.map(

        v => v.total

      )

    );

  }

  // ======================================================
  // FILTRAR
  // ======================================================

  filtrarVentas(): void {

    if(
      !this.fechaInicio ||

      !this.fechaFin
    ){

      this.ventasFiltradas =
      [...this.ventas];

      this.actualizarCalculos();

      return;

    }

    this.ventasFiltradas =
    this.ventas.filter(v => {

      return (

        v.fecha >= this.fechaInicio &&

        v.fecha <= this.fechaFin

      );

    });

    this.actualizarCalculos();

  }

  // ======================================================
  // LIMPIAR FILTRO
  // ======================================================

  limpiarFiltro(): void {

    this.fechaInicio = '';

    this.fechaFin = '';

    this.ventasFiltradas =
    [...this.ventas];

    this.actualizarCalculos();

  }

  // ======================================================
  // IMPRIMIR
  // ======================================================

  imprimir(): void {

    window.print();

  }

  // ======================================================
  // EXPORTAR PDF
  // ======================================================

  async exportarPDF() {

    const DATA: any =
    document.getElementById(
      'reportePDF'
    );

    if(!DATA){

      return;

    }

    document.body.classList.add(
      'pdf-export'
    );

    await new Promise(
      resolve => setTimeout(resolve, 500)
    );

    const canvas =
    await html2canvas(DATA, {

      scale: 2,

      useCORS: true,

      allowTaint: true,

      backgroundColor: '#ffffff'

    });

    const imgData =
    canvas.toDataURL(
      'image/png'
    );

    const pdf =
    new jsPDF(

      'p',
      'mm',
      'a4'

    );

    const pageWidth = 210;

    const pageHeight = 297;

    const imgWidth = pageWidth;

    const imgHeight =

    (canvas.height * imgWidth)

    /

    canvas.width;

    let heightLeft =
    imgHeight;

    let position = 0;

    // PRIMERA PAGINA

    pdf.addImage(

      imgData,

      'PNG',

      0,

      position,

      imgWidth,

      imgHeight

    );

    heightLeft -= pageHeight;

    // MULTIPAGINA

    while(heightLeft > 0){

      position =
      heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(

        imgData,

        'PNG',

        0,

        position,

        imgWidth,

        imgHeight

      );

      heightLeft -= pageHeight;

    }

    document.body.classList.remove(
      'pdf-export'
    );

    pdf.save(
      'Reporte-Ventas-SCAFI.pdf'
    );

  }

}