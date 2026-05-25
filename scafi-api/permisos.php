<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include 'conexion.php';

$idRol = $_GET['idRol'];

$sql = "

SELECT *

FROM permisos

WHERE idRol = '$idRol'

";

$query = mysqli_query($conexion, $sql);

$permisos = [];

while($row = mysqli_fetch_assoc($query)){

    $permisos[] = $row;

}

echo json_encode([
    "ok" => true,
    "permisos" => $permisos
]);