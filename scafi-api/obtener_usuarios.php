<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'conexion.php';

$query = "
SELECT
    u.id,
    u.nombre,
    u.correo,
    u.idRol,
    u.estado,
    u.documento,
    u.telefono,
    u.direccion,
    u.foto,
    r.nombreRol AS rol
FROM usuario u
INNER JOIN rol r
    ON u.idRol = r.idRol
ORDER BY u.nombre
";

$resultado = mysqli_query($conexion, $query);

$usuarios = [];

while ($fila = mysqli_fetch_assoc($resultado)) {
    $usuarios[] = $fila;
}

echo json_encode($usuarios);