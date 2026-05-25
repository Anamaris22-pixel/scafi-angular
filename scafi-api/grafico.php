<?php
$conn = new mysqli("localhost", "root", "", "scafi", 3306);

$sql = "SELECT p.tipoProducto, SUM(dv.cantidad) as total 
        FROM DetalleVenta dv
        JOIN Producto p ON dv.idProducto = p.idProducto
        GROUP BY p.tipoProducto";

$result = $conn->query($sql);

$productos = [];
$totales = [];

while($row = $result->fetch_assoc()){
    $productos[] = $row['tipoProducto'];
    $totales[] = $row['total'];
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Ventas</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

<h2>Ventas por Tipo de Café ☕</h2>

<canvas id="grafico"></canvas>

<script>
const ctx = document.getElementById('grafico');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: <?php echo json_encode($productos); ?>,
        datasets: [{
            label: 'Cantidad Vendida',
            data: <?php echo json_encode($totales); ?>,
        }]
    }
});
</script>

</body>
</html>