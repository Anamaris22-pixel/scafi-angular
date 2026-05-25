<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

$idCultivo = $data->idCultivo;
$idLote = $data->idLote;
$tipoCafe = $data->tipoCafe;
$fechaSiembra = $data->fechaSiembra;
$estado = $data->estado;

$sql = "UPDATE cultivos SET

idLote='$idLote',
tipoCafe='$tipoCafe',
fechaSiembra='$fechaSiembra',
estado='$estado'

WHERE idCultivo='$idCultivo'";

if ($conn->query($sql)) {

    echo json_encode([
        "ok" => true
    ]);

} else {

    echo json_encode([
        "ok" => false
    ]);

}
?>