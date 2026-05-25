<?php
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

$nit = $data['nit'];
$nombre = $data['nombre'];
$telefono = $data['telefono'];
$correo = $data['correo'];

$conn->query("INSERT INTO clientes (nit, nombre, telefono, correo)
VALUES ('$nit','$nombre','$telefono','$correo')");

echo json_encode(["ok" => true]);
?>