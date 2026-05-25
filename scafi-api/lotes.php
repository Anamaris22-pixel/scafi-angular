<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

include 'conexion.php';


// =========================
// LISTAR
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "
        SELECT *
        FROM lotes
        ORDER BY idLote DESC
    ";

    $resultado = $conexion->query($sql);

    $data = [];

    while ($fila = $resultado->fetch_assoc()) {

        $data[] = $fila;
    }

    echo json_encode($data);
}


// =========================
// GUARDAR
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $nombreLote =
    $_POST['nombreLote'] ?? '';

    $ubicacion =
    $_POST['ubicacion'] ?? '';

    $hectareas =
    $_POST['hectareas'] ?? '';

    $estado =
    $_POST['estado'] ?? '';

    $stmt = $conexion->prepare("
        INSERT INTO lotes
        (
            nombreLote,
            ubicacion,
            hectareas,
            estado
        )
        VALUES (?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "ssds",
        $nombreLote,
        $ubicacion,
        $hectareas,
        $estado
    );

    if ($stmt->execute()) {

        echo json_encode([
            "ok" => true
        ]);

    } else {

        echo json_encode([
            "ok" => false,
            "error" => $stmt->error
        ]);
    }
}

?>