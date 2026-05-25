<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

include 'conexion.php';


// ============================
// LISTAR
// ============================
if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    $sql = "
        SELECT
            c.idCultivo,
            c.idLote,
            l.nombreLote,
            c.tipoCafe,
            c.fechaSiembra,
            c.estado
        FROM cultivos c
        LEFT JOIN lotes l
        ON c.idLote = l.idLote
        ORDER BY c.idCultivo DESC
    ";

    $resultado = $conexion->query($sql);

    $datos = [];

    while ($fila = $resultado->fetch_assoc()) {

        $datos[] = $fila;
    }

    echo json_encode([
        "ok" => true,
        "total" => count($datos),
        "datos" => $datos
    ]);
}


// ============================
// INSERTAR
// ============================
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $idLote =
    $_POST['idLote'];

    $tipoCafe =
    $_POST['tipoCafe'];

    $fechaSiembra =
    $_POST['fechaSiembra'];

    $estado =
    $_POST['estado'];

    $sql = "
        INSERT INTO cultivos
        (
            idLote,
            tipoCafe,
            fechaSiembra,
            estado
        )
        VALUES
        (
            '$idLote',
            '$tipoCafe',
            '$fechaSiembra',
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


// ============================
// ELIMINAR
// ============================
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {

    $id =
    $_GET['id'];

    $sql = "
        DELETE FROM cultivos
        WHERE idCultivo = '$id'
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


// ============================
// ACTUALIZAR
// ============================
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    $id =
    $input['id'];

    $idLote =
    $input['idLote'];

    $tipoCafe =
    $input['tipoCafe'];

    $fechaSiembra =
    $input['fechaSiembra'];

    $estado =
    $input['estado'];

    $sql = "
        UPDATE cultivos
        SET
            idLote = '$idLote',
            tipoCafe = '$tipoCafe',
            fechaSiembra = '$fechaSiembra',
            estado = '$estado'
        WHERE idCultivo = '$id'
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

?>