<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

include 'conexion.php';


// =========================
// LISTAR LOTES
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
    exit;
}


// =========================
// OPERACIONES POST
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $accion = $_POST['accion'] ?? 'guardar';


    // =========================
    // ACTIVAR / INACTIVAR LOTE
    // =========================
    if ($accion === 'actualizar_estado') {

        $idLote = (int)($_POST['idLote'] ?? 0);
        $estado = $_POST['estado'] ?? '';

        if ($idLote <= 0 || !in_array($estado, ['Activo', 'Inactivo'], true)) {

            echo json_encode([
                "ok" => false,
                "error" => "Datos de estado no válidos."
            ]);

            exit;
        }

        $stmt = $conexion->prepare(""
            . "UPDATE lotes SET estado = ? WHERE idLote = ?"
        );

        $stmt->bind_param("si", $estado, $idLote);

        if ($stmt->execute()) {

            echo json_encode([
                "ok" => true,
                "mensaje" => "Estado del lote actualizado correctamente.",
                "estado" => $estado
            ]);

        } else {

            echo json_encode([
                "ok" => false,
                "error" => $stmt->error
            ]);
        }

        $stmt->close();
        exit;
    }


    // =========================
    // GUARDAR LOTE NUEVO
    // =========================
    $nombreLote = trim($_POST['nombreLote'] ?? '');
    $ubicacion = trim($_POST['ubicacion'] ?? '');
    $hectareas = $_POST['hectareas'] ?? '';

    if ($nombreLote === '' || $ubicacion === '' || $hectareas === '') {

        echo json_encode([
            "ok" => false,
            "error" => "Todos los campos son obligatorios."
        ]);

        exit;
    }

    // Todo lote nuevo se registra automáticamente como Activo.
    $estado = 'Activo';

    $stmt = $conexion->prepare(""
        . "INSERT INTO lotes "
        . "(nombreLote, ubicacion, hectareas, estado) "
        . "VALUES (?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "ssds",
        $nombreLote,
        $ubicacion,
        $hectareas,
        $estado
    );

    if ($stmt->execute()) {

        echo json_encode([
            "ok" => true,
            "mensaje" => "Lote registrado correctamente.",
            "estado" => "Activo"
        ]);

    } else {

        echo json_encode([
            "ok" => false,
            "error" => $stmt->error
        ]);
    }

    $stmt->close();
    exit;
}


echo json_encode([
    "ok" => false,
    "error" => "Método no permitido."
]);

?>
