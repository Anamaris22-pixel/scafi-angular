<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

include 'conexion.php';


// =========================
// LISTAR
// =========================

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    $sql = "
        SELECT *
        FROM clientes
        ORDER BY id DESC
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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $nit =
    $_POST['nit'];

    $nombre =
    $_POST['nombre'];

    $telefono =
    $_POST['telefono'];

    $correo =
    $_POST['correo'];

    $ciudad =
    $_POST['ciudad'];

    $direccion =
    $_POST['direccion'];

    $tipo =
    $_POST['tipo'];

    $sql = "
        INSERT INTO clientes
        (
            nit,
            nombre,
            telefono,
            correo,
            ciudad,
            direccion,
            tipo
        )
        VALUES
        (
            '$nit',
            '$nombre',
            '$telefono',
            '$correo',
            '$ciudad',
            '$direccion',
            '$tipo'
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

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {

    parse_str(
        file_get_contents("php://input"),
        $putData
    );

    $id =
    $putData['id'];

    $nit =
    $putData['nit'];

    $nombre =
    $putData['nombre'];

    $telefono =
    $putData['telefono'];

    $correo =
    $putData['correo'];

    $ciudad =
    $putData['ciudad'];

    $direccion =
    $putData['direccion'];

    $tipo =
    $putData['tipo'];

    $sql = "
        UPDATE clientes
        SET

            nit = '$nit',

            nombre = '$nombre',

            telefono = '$telefono',

            correo = '$correo',

            ciudad = '$ciudad',

            direccion = '$direccion',

            tipo = '$tipo'

        WHERE id = '$id'
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

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {

    $id =
    $_GET['id'];

    $sql = "
        DELETE FROM clientes
        WHERE id = '$id'
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