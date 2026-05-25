<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'conexion.php';

$nombre = $_POST['nombre'];
$cedula = $_POST['cedula'];
$telefono = $_POST['telefono'];
$zona = $_POST['zona'];

$foto = $_FILES['foto']['name'];
$ruta = "uploads/" . $foto;

move_uploaded_file($_FILES['foto']['tmp_name'], $ruta);

$sql = "INSERT INTO recolectores(nombre, cedula, telefono, zona, foto)
        VALUES('$nombre','$cedula','$telefono','$zona','$foto')";

if ($conexion->query($sql)) {
    echo json_encode(["mensaje" => "ok"]);
} else {
    echo json_encode(["error" => "error"]);
}
?>