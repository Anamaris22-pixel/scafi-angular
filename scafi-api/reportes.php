<?php
include 'conexion.php';

$tipo = $_GET['tipo'] ?? 'todos';

if ($tipo == 'entrada') {
    $sql = "SELECT * FROM movimientos WHERE tipo='Entrada' ORDER BY id DESC";
} elseif ($tipo == 'salida') {
    $sql = "SELECT * FROM movimientos WHERE tipo='Salida' ORDER BY id DESC";
} else {
    $sql = "SELECT * FROM movimientos ORDER BY id DESC";
}

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>