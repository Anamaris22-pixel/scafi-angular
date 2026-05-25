<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include 'conexion.php';

$usuario_id = $_GET['usuario_id'] ?? 0;

$sql = "

SELECT

u.id,
u.nombre,
u.foto,

(
    SELECT mensaje
    FROM mensajes
    WHERE
    (
        emisor_id = u.id
        AND receptor_id = '$usuario_id'
    )
    OR
    (
        emisor_id = '$usuario_id'
        AND receptor_id = u.id
    )
    ORDER BY id DESC
    LIMIT 1
) AS ultimo_mensaje,

(
    SELECT fecha
    FROM mensajes
    WHERE
    (
       remitente_id = u.id
        AND receptor_id = '$usuario_id'
    )
    OR
    (
        remitente_id = '$usuario_id'
        AND receptor_id = u.id
    )
    ORDER BY id DESC
    LIMIT 1
) AS ultima_fecha

FROM usuario u

WHERE u.id != '$usuario_id'

HAVING ultimo_mensaje IS NOT NULL

ORDER BY ultima_fecha DESC

";

$query = mysqli_query($conexion, $sql);

$conversaciones = [];

while($row = mysqli_fetch_assoc($query)){

    $conversaciones[] = $row;

}

echo json_encode([
    "ok" => true,
    "total" => count($conversaciones),
    "conversaciones" => $conversaciones
]);

?>