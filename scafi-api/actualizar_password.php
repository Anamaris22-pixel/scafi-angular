<?php

include 'conexion.php';

$id = $_POST['id'];
$password = $_POST['password'];

$sql = "
UPDATE usuario
SET
contrasena=?,
cambiar_password=0
WHERE id=?
";

$stmt = $conexion->prepare($sql);

$stmt->bind_param(
    "si",
    $password,
    $id
);

$stmt->execute();

echo json_encode([
    "ok" => true
]);