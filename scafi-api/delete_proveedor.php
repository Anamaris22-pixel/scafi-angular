<?php
include 'conexion.php';

$id = $_GET['id'];

$conn->query("DELETE FROM proveedores WHERE id=$id");

echo json_encode(["ok" => true]);
?>