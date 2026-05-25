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
            r.idRecoleccion,
            r.idRecolector,
            rec.nombre AS recolector,
            r.variedad,
            r.estado,
            r.fecha,
            r.kg
        FROM recoleccion r
        LEFT JOIN recolectores rec
        ON r.idRecolector = rec.idRecolector
        ORDER BY r.idRecoleccion DESC
    ";

    $resultado = $conexion->query($sql);

    $datos = [];

    while ($fila = $resultado->fetch_assoc()) {

        $datos[] = $fila;
    }

    echo json_encode($datos);
}


// ============================
// INSERTAR
// ============================
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $idRecolector =
    $_POST['idRecolector'];

    $idCultivo = 1;

    $variedad =
    $_POST['variedad'];

    $estado =
    $_POST['estado'];

    $fecha =
    $_POST['fecha'];

    $kg =
    $_POST['kg'];

    $sql = "
        INSERT INTO recoleccion
        (
            idRecolector,
            idCultivo,
            variedad,
            estado,
            fecha,
            kg
        )
        VALUES
        (
            '$idRecolector',
            '$idCultivo',
            '$variedad',
            '$estado',
            '$fecha',
            '$kg'
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
        DELETE FROM recoleccion
        WHERE idRecoleccion = '$id'
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

    $idRecolector =
    $input['idRecolector'];

    $variedad =
    $input['variedad'];

    $estado =
    $input['estado'];

    $fecha =
    $input['fecha'];

    $kg =
    $input['kg'];

    $sql = "
        UPDATE recoleccion
        SET
            idRecolector = '$idRecolector',
            variedad = '$variedad',
            estado = '$estado',
            fecha = '$fecha',
            kg = '$kg'
        WHERE idRecoleccion = '$id'
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