<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'conexion.php';

$idUsuario =
$_GET['idUsuario'] ?? 0;

$sql = "

SELECT
    id,
    nombre,
    correo,
    idRol
FROM usuarios
WHERE id != '$idUsuario'
ORDER BY nombre ASC

";

$resultado =
mysqli_query($conexion, $sql);

$usuarios = [];

while ($fila = mysqli_fetch_assoc($resultado)) {

    $usuarios[] = $fila;

}

echo json_encode([
    "ok" => true,
    "usuarios" => $usuarios
]);