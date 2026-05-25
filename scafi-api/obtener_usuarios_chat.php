<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include 'conexion.php';

$usuario_id = isset($_GET['usuario_id'])
    ? intval($_GET['usuario_id'])
    : 0;

$buscar = isset($_GET['buscar'])
    ? $_GET['buscar']
    : '';

$sql = "
SELECT
    id,
    nombre,
    correo,
    idRol
FROM usuario
WHERE id != $usuario_id
";

if ($buscar != '') {

    $buscar = $conexion->real_escape_string($buscar);

    $sql .= " AND nombre LIKE '%$buscar%'";
}

$sql .= " ORDER BY nombre ASC";

$resultado = $conexion->query($sql);

$usuarios = [];

while ($fila = $resultado->fetch_assoc()) {

    $usuarios[] = $fila;
}

echo json_encode([
    'ok' => true,
    'usuarios' => $usuarios
]);