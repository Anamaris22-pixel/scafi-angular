<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

include 'conexion.php';


// =========================
// LISTAR
// =========================

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "
        SELECT *
        FROM clientes
        ORDER BY id DESC
    ";

    $resultado = $conexion->query($sql);

    if (!$resultado) {

        echo json_encode([
            "ok" => false,
            "error" => $conexion->error
        ]);

        exit;
    }

    $datos = [];

    while ($fila = $resultado->fetch_assoc()) {

        $datos[] = $fila;

    }

    echo json_encode($datos);

    exit;
}


// =========================
// INSERTAR
// =========================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$input) {

        echo json_encode([
            "ok" => false,
            "error" => "No se recibieron datos"
        ]);

        exit;
    }

    $nit = $input['nit'] ?? '';
    $nombre = $input['nombre'] ?? '';
    $telefono = $input['telefono'] ?? '';
    $correo = $input['correo'] ?? '';
    $ciudad = $input['ciudad'] ?? '';
    $direccion = $input['direccion'] ?? '';
    $tipo = $input['tipo'] ?? '';

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
            "ok" => true,
            "id" => $conexion->insert_id
        ]);

    } else {

        echo json_encode([
            "ok" => false,
            "error" => $conexion->error
        ]);

    }

    exit;
}


// =========================
// ACTUALIZAR
// =========================

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$input) {

        echo json_encode([
            "ok" => false,
            "error" => "No se recibieron datos"
        ]);

        exit;
    }

    $id = $input['id'] ?? 0;
    $nit = $input['nit'] ?? '';
    $nombre = $input['nombre'] ?? '';
    $telefono = $input['telefono'] ?? '';
    $correo = $input['correo'] ?? '';
    $ciudad = $input['ciudad'] ?? '';
    $direccion = $input['direccion'] ?? '';
    $tipo = $input['tipo'] ?? '';

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

    exit;
}


// =========================
// ELIMINAR
// =========================

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id = $_GET['id'] ?? 0;

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
            "ok" => false,
            "error" => $conexion->error
        ]);

    }

    exit;
}


// =========================
// MÉTODO NO PERMITIDO
// =========================

echo json_encode([
    "ok" => false,
    "error" => "Método no permitido"
]);

?>