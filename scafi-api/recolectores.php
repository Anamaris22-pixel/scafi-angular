<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

// =========================
// CONEXIÓN
// =========================
include 'conexion.php';


// =========================
// GET
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

  // -------------------------------------------------
  // SINCRONIZAR USUARIOS CON ROL RECOLECTOR
  // -------------------------------------------------
  // Si un usuario fue creado con rol Recolector pero
  // todavía no tiene registro en la tabla recolectores,
  // se crea automáticamente su ficha de recolector.
  $sqlSync = "
    INSERT INTO recolectores
      (nombre, cedula, telefono, zonaTrabajo, foto, idCultivo, idUsuario, estado)
    SELECT
      COALESCE(u.nombre, ''),
      COALESCE(u.documento, ''),
      u.telefono,
      u.direccion,
      u.foto,
      NULL,
      u.id,
      COALESCE(u.estado, 'Activo')
    FROM usuario u
    WHERE u.idRol = 3
      AND u.estado = 'Activo'
      AND NOT EXISTS (
        SELECT 1
        FROM recolectores r
        WHERE r.idUsuario = u.id
      )
  ";

  if (!$conexion->query($sqlSync)) {
    http_response_code(500);
    echo json_encode([
      "ok" => false,
      "mensaje" => "No fue posible sincronizar los recolectores: " . $conexion->error
    ]);
    exit();
  }

  $sql = "
    SELECT *
    FROM recolectores
    WHERE estado = 'Activo'
    ORDER BY nombre ASC
  ";

  $res = $conexion->query($sql);

  $data = [];

  while ($row = $res->fetch_assoc()) {

    $data[] = $row;
  }

  echo json_encode($data);
}


// =========================
// POST
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $input = json_decode(
    file_get_contents("php://input"),
    true
  );

  $idUsuario =
  $input['idUsuario'];

  $zonaTrabajo =
  $input['zonaTrabajo'];

  $nombre =
  $input['nombre'];

  $cedula =
  $input['cedula'];

  $telefono =
  $input['telefono'];

  $foto =
  $input['foto'];

  $idCultivo =
  $input['idCultivo'];

  $stmt = $conexion->prepare("
    INSERT INTO recolectores
    (
      idUsuario,
      zonaTrabajo,
      nombre,
      cedula,
      telefono,
      foto,
      idCultivo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  ");

  $stmt->bind_param(
    "isssssi",
    $idUsuario,
    $zonaTrabajo,
    $nombre,
    $cedula,
    $telefono,
    $foto,
    $idCultivo
  );

  if ($stmt->execute()) {

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
// PUT
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

  $id = $_GET['id'];

  $input = json_decode(
    file_get_contents("php://input"),
    true
  );

  $zonaTrabajo =
  $input['zonaTrabajo'];

  $nombre =
  $input['nombre'];

  $cedula =
  $input['cedula'];

  $telefono =
  $input['telefono'];

  $foto =
  $input['foto'];

  $stmt = $conexion->prepare("
    UPDATE recolectores
    SET
      zonaTrabajo = ?,
      nombre = ?,
      cedula = ?,
      telefono = ?,
      foto = ?
    WHERE idRecolector = ?
  ");

  $stmt->bind_param(
    "sssssi",
    $zonaTrabajo,
    $nombre,
    $cedula,
    $telefono,
    $foto,
    $id
  );

  if ($stmt->execute()) {

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
// DELETE
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

  $id = $_GET['id'];

  $stmt = $conexion->prepare("
    DELETE FROM recolectores
    WHERE idRecolector = ?
  ");

  $stmt->bind_param("i", $id);

  if ($stmt->execute()) {

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