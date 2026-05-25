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

  $sql = "
    SELECT *
    FROM recolectores
    ORDER BY idRecolector DESC
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