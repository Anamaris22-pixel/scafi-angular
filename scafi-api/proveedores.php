<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

include 'conexion.php';


// =========================
// LISTAR
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "
        SELECT *
        FROM proveedores
        ORDER BY idProveedor DESC
    ";

    $resultado = $conexion->query($sql);

    $datos = [];

    while ($fila = $resultado->fetch_assoc()) {

        $datos[] = $fila;
    }

    echo json_encode($datos);
}


// =========================
// INSERTAR
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    $nombre =
    $input['nombre'];

    $empresa =
    $input['empresa'];

    $telefono =
    $input['telefono'];

    $correo =
    $input['correo'];

    $direccion =
    $input['direccion'];

    $estado =
    $input['estado'];

    $sql = "
        INSERT INTO proveedores
        (
            nombre,
            empresa,
            telefono,
            correo,
            direccion,
            estado
        )
        VALUES
        (
            '$nombre',
            '$empresa',
            '$telefono',
            '$correo',
            '$direccion',
            '$estado'
        )
    ";

    if ($conexion->query($sql)) {

        echo json_encode([
            "ok" => true
        ]);

    } else {

        echo json_encode([
            "ok" => false,
            "error" => $conexion->error
        ]);
    }
}


// =========================
// ACTUALIZAR
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    $id =
    $input['idProveedor'];

    $nombre =
    $input['nombre'];

    $empresa =
    $input['empresa'];

    $telefono =
    $input['telefono'];

    $correo =
    $input['correo'];

    $direccion =
    $input['direccion'];

    $estado =
    $input['estado'];

    $sql = "
        UPDATE proveedores
        SET
            nombre = '$nombre',
            empresa = '$empresa',
            telefono = '$telefono',
            correo = '$correo',
            direccion = '$direccion',
            estado = '$estado'
        WHERE idProveedor = '$id'
    ";

    if ($conexion->query($sql)) {

        echo json_encode([
            "ok" => true
        ]);

    } else {

        echo json_encode([
            "ok" => false,
            "error" => $conexion->error
        ]);
    }
}


// =========================
// ELIMINAR
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id =
    $_GET['id'];

    $sql = "
        DELETE FROM proveedores
        WHERE idProveedor = '$id'
    ";

    if ($conexion->query($sql)) {

        echo json_encode([
            "ok" => true
        ]);

    } else {

        echo json_encode([
            "ok" => false
        ]);
    }
}
?>