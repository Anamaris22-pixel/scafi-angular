<?php

header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: *");

header("Access-Control-Allow-Methods: GET, OPTIONS");

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    http_response_code(200);
    exit();

}

include 'conexion.php';


// =========================
// USUARIO DEMO
// =========================

$idUsuario = 1;


// =========================
// CONSULTAR
// =========================

$sql = "

SELECT *

FROM notificaciones

WHERE usuario_id = ?

ORDER BY fecha DESC

";

$stmt = $conexion->prepare($sql);

$stmt->bind_param(
    "i",
    $idUsuario
);

$stmt->execute();

$resultado =
$stmt->get_result();

$notificaciones = [];

while(
    $fila =
    $resultado->fetch_assoc()
){

    $notificaciones[] = $fila;

}


// =========================
// RESPUESTA
// =========================

echo json_encode([

    "ok" => true,

    "total" =>
    count($notificaciones),

    "notificaciones" =>
    $notificaciones

]);

$stmt->close();

$conexion->close();

?>