<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

include 'conexion.php';

try {

    $nombre = $_POST['nombre'] ?? '';

    $correo = $_POST['correo'] ?? '';

    $password = $_POST['contrasena'] ?? '';

    $rol = $_POST['rol'] ?? '';

    $estado = $_POST['estado'] ?? '';

    $foto = '';

    if(isset($_FILES['foto'])){

        $nombreFoto = time() . '_' . $_FILES['foto']['name'];

        $ruta = 'uploads/' . $nombreFoto;

        move_uploaded_file(
            $_FILES['foto']['tmp_name'],
            $ruta
        );

        $foto = $ruta;
    }

    $sql = "INSERT INTO usuario
    (nombre, correo, contrasena, idRol, estado, foto)
    VALUES
    (?, ?, ?, ?, ?, ?)";

    $stmt = $conexion->prepare($sql);

    $stmt->bind_param(
        "sssiss",
        $nombre,
        $correo,
        $password,
        $rol,
        $estado,
        $foto
    );

    $stmt->execute();

    echo json_encode([
        "ok" => true,
        "mensaje" => "Usuario creado"
    ]);

} catch(Exception $e){

    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}