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
FROM usuario
WHERE id != '$idUsuario'
ORDER BY nombre ASC

";

$resultado =
    mysqli_query($conexion, $sql);

$usuario = [];

while ($fila = mysqli_fetch_assoc($resultado)) {

    $usuario[] = $fila;
}

echo json_encode([
    "ok" => true,
    "usuario" => $usuario
]);
