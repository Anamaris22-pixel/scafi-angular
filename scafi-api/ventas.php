<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json");

include 'conexion.php';


// ==========================
// PREVENIR ERROR CORS
// ==========================

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(200);
    exit();

}


// ==========================
// OBTENER VENTAS
// ==========================

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "

        SELECT
            idVenta,
            fecha,
            cliente,
            producto,
            cantidad,
            precio,
            total,
            estado

        FROM ventas

        ORDER BY idVenta DESC

    ";

    $resultado = mysqli_query($conexion, $sql);

    $ventas = [];

    while ($fila = mysqli_fetch_assoc($resultado)) {

        $ventas[] = $fila;

    }

    echo json_encode([
        "ventas" => $ventas
    ]);

    exit();

}


// ==========================
// GUARDAR
// ==========================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $fecha = $data['fecha'];
    $cliente = $data['cliente'];
    $producto = $data['producto'];
    $cantidad = $data['cantidad'];
    $precio = $data['precio'];
    $total = $data['total'];
    $estado = $data['estado'];

    $sql = "

        INSERT INTO ventas(

            fecha,
            cliente,
            producto,
            cantidad,
            precio,
            total,
            estado

        )

        VALUES (

            '$fecha',
            '$cliente',
            '$producto',
            '$cantidad',
            '$precio',
            '$total',
            '$estado'

        )

    ";

    mysqli_query($conexion, $sql);

    echo json_encode([
        "ok" => true
    ]);

    exit();

}


// ==========================
// ELIMINAR
// ==========================

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id = $_GET['id'];

    $sql = "

        DELETE FROM ventas
        WHERE idVenta = '$id'

    ";

    mysqli_query($conexion, $sql);

    echo json_encode([
        "ok" => true
    ]);

    exit();

}

?>