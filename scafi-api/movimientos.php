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

        SELECT

            m.id,
            m.idInsumo,
            i.nombre AS insumo,
            m.tipo,
            m.cantidad,
            m.observacion,
            m.fecha

        FROM movimientos m

        INNER JOIN insumos i
        ON m.idInsumo = i.idInsumo

        ORDER BY m.id DESC

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

    $idInsumo =
    $input['idInsumo'];

    $tipo =
    $input['tipo'];

    $cantidad =
    $input['cantidad'];

    $observacion =
    $input['observacion'];

    $sql = "

        INSERT INTO movimientos
        (
            idInsumo,
            tipo,
            cantidad,
            observacion
        )

        VALUES
        (
            '$idInsumo',
            '$tipo',
            '$cantidad',
            '$observacion'
        )

    ";

    if ($conexion->query($sql)) {

        // =====================
        // ACTUALIZAR STOCK
        // =====================

        if ($tipo == 'Entrada') {

            $conexion->query("

                UPDATE insumos

                SET stock = stock + $cantidad

                WHERE idInsumo = $idInsumo

            ");

        } else {

            $conexion->query("

                UPDATE insumos

                SET stock = stock - $cantidad

                WHERE idInsumo = $idInsumo

            ");

        }

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
    $input['id'];

    $idInsumo =
    $input['idInsumo'];

    $tipo =
    $input['tipo'];

    $cantidad =
    $input['cantidad'];

    $observacion =
    $input['observacion'];

    $sql = "

        UPDATE movimientos

        SET

            idInsumo = '$idInsumo',
            tipo = '$tipo',
            cantidad = '$cantidad',
            observacion = '$observacion'

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

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id = $_GET['id'];

    $sql = "

        DELETE FROM movimientos

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