<?php
// 1. Encabezados necesarios para que Angular no bloquee la petición
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Content-Type: application/json");

// 2. Llamas a tu conexión centralizada
include 'conexion.php';

// Asegurarnos de que el ID exista
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $conexion->query("DELETE FROM proveedores WHERE id=$id");

    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "error" => "ID no proporcionado"]);
}

// Opcional pero recomendado: cerrar la conexión
$conexion->close();
?>