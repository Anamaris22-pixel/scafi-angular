<?php
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

$empresa = $data['empresa'];
$nit = $data['nit'];
$telefono = $data['telefono'];
$tipo = $data['tipo'];

$conn->query("INSERT INTO proveedores (empresa, nit, telefono, tipo)
VALUES ('$empresa', '$nit', '$telefono', '$tipo')");

echo json_encode(["ok" => true]);
?>