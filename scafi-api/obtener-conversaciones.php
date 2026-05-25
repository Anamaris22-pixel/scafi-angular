<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'conexion.php';

$idUsuario = $_GET['idUsuario'] ?? 0;

$sql = "

SELECT DISTINCT

u.id,
u.nombre,
u.correo,
u.idRol

FROM usuario u

INNER JOIN mensajes m

ON (

(m.remitente_id = '$idUsuario' AND m.receptor_id = u.id)

OR

(m.receptor_id = '$idUsuario' AND m.remitente_id = u.id)

)

WHERE u.id != '$idUsuario'

ORDER BY u.nombre ASC

";

$query = mysqli_query($conexion, $sql);

$conversaciones = [];

while ($fila = mysqli_fetch_assoc($query)) {
    $conversaciones[] = $fila;
}

echo json_encode([
    'ok' => true,
    'total' => count($conversaciones),
    'conversaciones' => $conversaciones
]);