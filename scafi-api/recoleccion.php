<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'conexion.php';

//====================================
// GET
//====================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

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
            ON rec.idRecolector = r.idRecolector
        ORDER BY r.idRecoleccion DESC
    ";

    $resultado = $conexion->query($sql);

    if (!$resultado) {

        die(json_encode([
            "ok" => false,
            "error" => $conexion->error
        ]));

    }

    $datos = [];

    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    echo json_encode($datos);
    exit();
}

//====================================
// POST
//====================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $idRecolector = $_POST['idRecolector'] ?? '';
    $variedad     = trim($_POST['variedad'] ?? '');
    $estado       = trim($_POST['estado'] ?? '');
    $fecha        = $_POST['fecha'] ?? '';
    $kg           = $_POST['kg'] ?? '';

    if (
        empty($idRecolector) ||
        empty($variedad) ||
        empty($estado) ||
        empty($fecha) ||
        empty($kg)
    ) {

        echo json_encode([
            "ok" => false,
            "mensaje" => "Todos los campos son obligatorios."
        ]);

        exit();
    }

    $idLote = 1;

$stmt = $conexion->prepare("
INSERT INTO recoleccion
(
    idRecolector,
    idLote,
    variedad,
    estado,
    fecha,
    kg
)
VALUES
(?,?,?,?,?,?)
");

$stmt->bind_param(
    "iisssd",
    $idRecolector,
    $idLote,
    $variedad,
    $estado,
    $fecha,
    $kg
);

    if ($stmt->execute()) {

        echo json_encode([
            "ok" => true,
            "mensaje" => "Pesaje guardado correctamente."
        ]);

    } else {

        http_response_code(500);

        echo json_encode([
            "ok" => false,
            "mensaje" => $stmt->error
        ]);
    }

    $stmt->close();
    exit();
}

//====================================
// PUT
//====================================
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $input = json_decode(file_get_contents("php://input"), true);

    $id            = $input['id'] ?? 0;
    $idRecolector  = $input['idRecolector'] ?? '';
    $variedad      = $input['variedad'] ?? '';
    $estado        = $input['estado'] ?? '';
    $fecha         = $input['fecha'] ?? '';
    $kg            = $input['kg'] ?? '';

    $stmt = $conexion->prepare("
        UPDATE recoleccion
        SET
            idRecolector=?,
            variedad=?,
            estado=?,
            fecha=?,
            kg=?
        WHERE idRecoleccion=?
    ");

    $stmt->bind_param(
        "isssdi",
        $idRecolector,
        $variedad,
        $estado,
        $fecha,
        $kg,
        $id
    );

    if ($stmt->execute()) {

        echo json_encode([
            "ok" => true,
            "mensaje" => "Registro actualizado."
        ]);

    } else {

        http_response_code(500);

        echo json_encode([
            "ok" => false,
            "mensaje" => $stmt->error
        ]);
    }

    $stmt->close();
    exit();
}

//====================================
// DELETE
//====================================
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id = $_GET['id'] ?? 0;

    $stmt = $conexion->prepare("
        DELETE FROM recoleccion
        WHERE idRecoleccion=?
    ");

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {

        echo json_encode([
            "ok" => true,
            "mensaje" => "Registro eliminado."
        ]);

    } else {

        http_response_code(500);

        echo json_encode([
            "ok" => false,
            "mensaje" => $stmt->error
        ]);
    }

    $stmt->close();
    exit();
}

http_response_code(405);

echo json_encode([
    "ok" => false,
    "mensaje" => "Método no permitido."
]);

$conexion->close();