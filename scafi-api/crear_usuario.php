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

    // NUEVOS CAMPOS
    $documento = $_POST['documento'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $direccion = $_POST['direccion'] ?? '';

    $foto = '';

    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {

        $nombreFoto = time() . '_' . $_FILES['foto']['name'];

        $ruta = 'uploads/' . $nombreFoto;

        move_uploaded_file(
            $_FILES['foto']['tmp_name'],
            $ruta
        );

        $foto = $ruta;
    }

    $sql = "
        INSERT INTO usuario
        (
            nombre,
            correo,
            contrasena,
            idRol,
            foto,
            telefono,
            documento,
            direccion,
            estado
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $stmt = $conexion->prepare($sql);

    $stmt->bind_param(
        "sssisssss",
        $nombre,
        $correo,
        $password,
        $rol,
        $foto,
        $telefono,
        $documento,
        $direccion,
        $estado
    );

    $stmt->execute();

    echo json_encode([
        "ok" => true,
        "mensaje" => "Usuario creado correctamente"
    ]);

} catch (Exception $e) {

    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}