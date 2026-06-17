<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

include 'conexion.php';

try {

    $id = $_POST['id'] ?? 0;
    $nombre = $_POST['nombre'] ?? '';
    $correo = $_POST['correo'] ?? '';
    $rol = $_POST['rol'] ?? '';
    $estado = $_POST['estado'] ?? '';
    $documento = $_POST['documento'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $direccion = $_POST['direccion'] ?? '';
    $password = $_POST['contrasena'] ?? '';

    // Si viene una nueva foto
    if (isset($_FILES['foto'])) {

        $nombreFoto = time() . '_' . $_FILES['foto']['name'];

        $ruta = 'uploads/' . $nombreFoto;

        move_uploaded_file(
            $_FILES['foto']['tmp_name'],
            $ruta
        );

        $sql = "
        UPDATE usuario
        SET
            nombre = ?,
            correo = ?,
            idRol = ?,
            estado = ?,
            documento = ?,
            telefono = ?,
            direccion = ?,
            foto = ?
        WHERE id = ?
        ";

        $stmt = $conexion->prepare($sql);

        $stmt->bind_param(
            "ssisssssi",
            $nombre,
            $correo,
            $rol,
            $estado,
            $documento,
            $telefono,
            $direccion,
            $ruta,
            $id
        );
    } else {

        $sql = "
        UPDATE usuario
        SET
            nombre = ?,
            correo = ?,
            idRol = ?,
            estado = ?,
            documento = ?,
            telefono = ?,
            direccion = ?
        WHERE id = ?
        ";

        $stmt = $conexion->prepare($sql);

        $stmt->bind_param(
            "ssissssi",
            $nombre,
            $correo,
            $rol,
            $estado,
            $documento,
            $telefono,
            $direccion,
            $id
        );
    }

    $stmt->execute();

    // Actualizar contraseña solo si escribieron una nueva
    if ($password != '') {

        $sqlPassword = "
        UPDATE usuario
        SET contrasena = ?
        WHERE id = ?
        ";

        $stmtPassword = $conexion->prepare($sqlPassword);

        $stmtPassword->bind_param(
            "si",
            $password,
            $id
        );

        $stmtPassword->execute();
    }

    echo json_encode([
        "ok" => true,
        "mensaje" => "Usuario actualizado"
    ]);

} catch (Exception $e) {

    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}