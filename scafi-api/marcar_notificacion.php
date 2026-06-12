<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'conexion.php';

$id = $_POST['id'] ?? 0;

$sql = "

UPDATE notificaciones

SET visto_por = 1

WHERE id = '$id'

";

if($conexion->query($sql)){

    echo json_encode([
        "ok" => true
    ]);

}else{

    echo json_encode([
        "ok" => false,
        "error" => $conexion->error
    ]);

}