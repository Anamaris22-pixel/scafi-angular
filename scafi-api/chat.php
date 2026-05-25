<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if (!isset($_FILES['archivo'])) {

    echo json_encode([
        "ok" => false
    ]);

    exit;

}

$archivo = $_FILES['archivo'];

$nombre =
    time() . '_' .
    $archivo['name'];

$ruta =
    'uploads/chat/' .
    $nombre;

move_uploaded_file(
    $archivo['tmp_name'],
    $ruta
);

echo json_encode([

    "ok" => true,

    "ruta" => $ruta

]);