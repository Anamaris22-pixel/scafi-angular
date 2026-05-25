<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");


// =====================================
// CORS
// =====================================
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    http_response_code(200);
    exit();
}

include 'conexion.php';


// =====================================
// GET
// =====================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "
        SELECT *
        FROM insumos
        ORDER BY idInsumo DESC
    ";

    $resultado =
    $conexion->query($sql);

    $datos = [];

    while (
        $fila =
        $resultado->fetch_assoc()
    ) {

        $datos[] = $fila;
    }

    echo json_encode($datos);
}


// =====================================
// POST
// =====================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $nombre =
    $data['nombre'];

    $idProveedor =
    $data['idProveedor'];

    $tipo =
    $data['tipo'];

    $descripcion =
    $data['descripcion'];

    $unidad =
    $data['unidad'];

    $precio =
    $data['precio'];

    $stock =
    $data['stock'];

    $minimo =
    $data['minimo'];

    $sql = "
        INSERT INTO insumos
        (
            nombre,
            idProveedor,
            tipo,
            descripcion,
            unidad,
            precio,
            stock,
            stockMinimo
        )
        VALUES
        (
            '$nombre',
            '$idProveedor',
            '$tipo',
            '$descripcion',
            '$unidad',
            '$precio',
            '$stock',
            '$minimo'
        )
    ";

    if (
        $conexion->query($sql)
    ) {

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


// =====================================
// PUT
// =====================================
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $id =
    $data['idInsumo'];

    $nombre =
    $data['nombre'];

    $idProveedor =
    $data['idProveedor'];

    $tipo =
    $data['tipo'];

    $descripcion =
    $data['descripcion'];

    $unidad =
    $data['unidad'];

    $precio =
    $data['precio'];

    $stock =
    $data['stock'];

    $minimo =
    $data['minimo'];

    $sql = "
        UPDATE insumos
        SET

            nombre = '$nombre',
            idProveedor = '$idProveedor',
            tipo = '$tipo',
            descripcion = '$descripcion',
            unidad = '$unidad',
            precio = '$precio',
            stock = '$stock',
            stockMinimo = '$minimo'

        WHERE idInsumo = '$id'
    ";

    if (
        $conexion->query($sql)
    ) {

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


// =====================================
// DELETE
// =====================================
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id = $_GET['id'];

    $sql = "
        DELETE FROM insumos
        WHERE idInsumo = '$id'
    ";

    if (
        $conexion->query($sql)
    ) {

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

?>