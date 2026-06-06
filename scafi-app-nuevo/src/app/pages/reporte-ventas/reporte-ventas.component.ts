import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporte-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './reporte-ventas.component.html'
})
export class ReporteVentasComponent implements OnInit {

  private readonly API = 'http://localhost/scafi-angular/scafi-api/reporte-ventas.php';

  ventas: any[] = [];
  ventasFiltradas: any[] = [];
  fechaInicio = '';
  fechaFin = '';
  fechaActual = new Date();
  usuario = 'Administrador';
  totalGeneral = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.http.get<any[]>(this.API).subscribe({
      next: (res) => {
        this.ventas = res.map(v => ({
          ...v,
          idVenta: v.idVenta,
          total: Number(v.total),
          cantidad: Number(v.cantidad)
        }));
        this.ventasFiltradas = [...this.ventas];
        this.actualizarCalculos();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  actualizarCalculos(): void {
    this.totalGeneral = this.ventasFiltradas.reduce((sum, v) => sum + v.total, 0);
  }

  promedioVentas(): number {
    if (this.ventasFiltradas.length === 0) return 0;
    return this.totalGeneral / this.ventasFiltradas.length;
  }

  obtenerVentaAlta(): number {
    if (this.ventasFiltradas.length === 0) return 0;
    return Math.max(...this.ventasFiltradas.map(v => v.total));
  }

  filtrarVentas(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      this.ventasFiltradas = [...this.ventas];
      this.actualizarCalculos();
      return;
    }
    this.ventasFiltradas = this.ventas.filter(v => {
      return v.fecha >= this.fechaInicio && v.fecha <= this.fechaFin;
    });
    this.actualizarCalculos();
  }

  limpiarFiltro(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.ventasFiltradas = [...this.ventas];
    this.actualizarCalculos();
  }

  exportarPDF() {
    const pdf = new jsPDF('p', 'mm', 'letter');
    const pdfWidth = pdf.internal.pageSize.getWidth();   
    const pdfHeight = pdf.internal.pageSize.getHeight(); 
    const margenX = 15;
    let currentY = 20;
  
    const agregarPieDePagina = () => {
      const totalPags = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPags; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(148, 163, 184); 
        pdf.text(
          'SCAFI © 2026 · DOCUMENTO OFICIAL DE VENTAS',
          pdfWidth - margenX, pdfHeight - 10, { align: 'right' }
        );
      }
    };

    // Encabezado alineado exactamente como Inventario
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(15, 23, 42); 
    pdf.text('REPORTE DE VENTAS', margenX, currentY);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139); 
    pdf.text('SCAFI · Software de Control Integral Cafetero', margenX, currentY + 5);
  
    const fechaStr = this.fechaActual.toLocaleDateString('es-CO');
    const horaStr = this.fechaActual.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    pdf.text(`Fecha: ${fechaStr} | Hora: ${horaStr}`, pdfWidth - margenX, currentY, { align: 'right' });
    pdf.text(`Responsable: ${this.usuario}`, pdfWidth - margenX, currentY + 5, { align: 'right' });

    pdf.setDrawColor(241, 245, 249); 
    pdf.setLineWidth(0.5);
    pdf.line(margenX, currentY + 10, pdfWidth - margenX, currentY + 10);
    currentY += 20;
    pdf.setFont('helvetica', 'bold');
pdf.setFontSize(11);
pdf.setTextColor(30, 41, 59);

pdf.text(
  'RESUMEN DE OPERACIONES',
  margenX,
  currentY
);

currentY += 5;

const kpiW = (pdfWidth - (margenX * 2) - 9) / 4;
const kpiH = 18;

const kpis = [

  {
    t: 'Ventas Realizadas',
    v: this.ventasFiltradas.length.toString(),
    bg: [248,250,252],
    border: [226,232,240],
    text: [15,23,42]
  },

  {
    t: 'Total Ingresos',
    v: '$ ' + this.totalGeneral.toLocaleString(),
    bg: [240,253,244],
    border: [220,252,231],
    text: [22,163,74]
  },

  {
    t: 'Venta Promedio',
    v: '$ ' + this.promedioVentas().toLocaleString(),
    bg: [239,246,255],
    border: [191,219,254],
    text: [37,99,235]
  },

  {
    t: 'Venta Más Alta',
    v: '$ ' + this.obtenerVentaAlta().toLocaleString(),
    bg: [255,251,235],
    border: [253,230,138],
    text: [180,83,9]
  }

];

kpis.forEach((kpi, idx) => {

  const x = margenX + (idx * (kpiW + 3));

  pdf.setFillColor(kpi.bg[0], kpi.bg[1], kpi.bg[2]);
  pdf.setDrawColor(kpi.border[0], kpi.border[1], kpi.border[2]);

  pdf.roundedRect(
    x,
    currentY,
    kpiW,
    kpiH,
    3,
    3,
    'FD'
  );

  pdf.setFontSize(7);
  pdf.setTextColor(100,116,139);
  pdf.text(
    kpi.t.toUpperCase(),
    x + 3,
    currentY + 5
  );

  pdf.setFontSize(11);
  pdf.setTextColor(
    kpi.text[0],
    kpi.text[1],
    kpi.text[2]
  );

  pdf.text(
    kpi.v,
    x + 3,
    currentY + 13
  );

});

currentY += kpiH + 12;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(30, 41, 59);
    pdf.text(
  'DETALLE DE VENTAS',
  margenX,
  currentY
);

    const columnas = ['ID', 'Cliente', 'Producto', 'Cant.', 'Total'];
    const filas = this.ventasFiltradas.map(v => [
      `#${v.idVenta}`,
      v.cliente.toUpperCase(),
      v.producto,
      v.cantidad,
      '$ ' + Number(v.total).toLocaleString()
    ]);

    autoTable(pdf, {
      startY: currentY + 4,
      head: [columnas],
      body: filas,
      margin: { left: margenX, right: margenX, bottom: 20 },
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [51, 65, 85]
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [37, 99, 235] },
        1: { fontStyle: 'bold' },
        3: { halign: 'center' },
        4: { halign: 'right', fontStyle: 'bold' }
      }
    });
   const finalY = (pdf as any).lastAutoTable.finalY + 15;

// FIRMAS

pdf.line(
  margenX + 10,
  finalY,
  margenX + 60,
  finalY
);

pdf.line(
  pdfWidth - 75,
  finalY,
  pdfWidth - 20,
  finalY
);

pdf.setFontSize(10);
pdf.setFont('helvetica', 'bold');

pdf.text(
  'ADMINISTRADOR',
  margenX + 22,
  finalY + 7
);

pdf.text(
  'REVISADO POR',
  pdfWidth - 60,
  finalY + 7
);

pdf.setFont(
  'helvetica',
  'normal'
);

pdf.text(
  'Auditoría Interna',
  pdfWidth - 55,
  finalY + 13
);
agregarPieDePagina();
pdf.save('Reporte_Ventas_SCAFI.pdf');
  }
}