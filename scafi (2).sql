-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 16-05-2026 a las 05:15:26
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `scafi`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nit` varchar(50) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `correo` varchar(120) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `fechaRegistro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nit`, `nombre`, `telefono`, `correo`, `ciudad`, `direccion`, `tipo`, `fechaRegistro`) VALUES
(1, '900100001', 'Cooperativa Cafetera del Tolima', '3201110001', 'compras@cooptolima.com', 'Ibagué', 'Zona Industrial Tolima', 'Cooperativa', '2026-05-12 02:47:38'),
(2, '900100002', 'Café del Quindío SAS', '3201110002', 'compras@cafedelquindio.com', 'Armenia', 'Parque Cafetero Km 5', 'Empresa', '2026-05-12 02:47:38'),
(3, '900100003', 'Federación Cafetera Huila', '3201110003', 'ventas@federacionhuila.com', 'Neiva', 'Zona Cafetera Sur', 'Cooperativa', '2026-05-12 02:47:38'),
(4, '900100004', 'Exportadora Premium Coffee', '3201110004', 'compras@premiumcoffee.com', 'Bogotá', 'Cra 15 #100-22', 'Exportadora', '2026-05-12 02:47:38'),
(5, '900100005', 'Cooperativa Caficultores Risaralda', '3201110005', 'compras@cooperisaralda.com', 'Pereira', 'Zona Industrial Pereira', 'Cooperativa', '2026-05-12 02:47:38'),
(6, '900100006', 'Café Orgánico Colombiano', '3201110006', 'compras@organico.com', 'Medellín', 'Av Industrial #50-10', 'Empresa', '2026-05-12 02:47:38'),
(7, '900100007', 'Asociación Cafetera del Cauca', '3201110007', 'pedidos@cafecauca.com', 'Popayán', 'Zona Rural Norte', 'Cooperativa', '2026-05-12 02:47:38'),
(8, '900100008', 'Distribuidora Café Dorado', '3201110008', 'ventas@cafedorado.com', 'Cali', 'Cra 22 #15-40', 'Distribuidor', '2026-05-12 02:47:38'),
(9, '900100009', 'Comercializadora Café Andino', '3201110009', 'compras@andino.com', 'Tunja', 'Centro Empresarial', 'Empresa', '2026-05-12 02:47:38'),
(10, '900100010', 'Café Supremo Export', '3201110010', 'export@supremo.com', 'Bogotá', 'Zona Franca Bogotá', 'Exportadora', '2026-05-12 02:47:38'),
(11, '900100011', 'Cooperativa Cafetera de Caldas', '3201110011', 'compras@cafecaldas.com', 'Manizales', 'Zona Industrial Caldas', 'Cooperativa', '2026-05-12 02:47:38'),
(12, '900100012', 'Industria Cafetera del Norte', '3201110012', 'ventas@cafenorte.com', 'Bucaramanga', 'Parque Industrial', 'Empresa', '2026-05-12 02:47:38'),
(13, '900100013', 'Asociación Café Premium', '3201110013', 'pedidos@cafepremium.com', 'Pasto', 'Zona Cafetera Sur', 'Cooperativa', '2026-05-12 02:47:38'),
(14, '900100014', 'Coffee Export Colombia', '3201110014', 'export@coffeeexport.com', 'Medellín', 'Zona Franca Medellín', 'Exportadora', '2026-05-12 02:47:38'),
(15, '900100015', 'Café Especial del Huila', '3201110015', 'compras@especialhuila.com', 'Neiva', 'Cra 10 #20-33', 'Empresa', '2026-05-12 02:47:38'),
(16, '900100016', 'Cooperativa Caficultores Antioquia', '3201110016', 'ventas@cafesantioquia.com', 'Medellín', 'Zona Rural Antioquia', 'Cooperativa', '2026-05-12 02:47:38'),
(17, '900100017', 'Distribuidora Aroma Café', '3201110017', 'compras@aromacafe.com', 'Cali', 'Av Roosevelt #20-18', 'Distribuidor', '2026-05-12 02:47:38'),
(18, '900100018', 'Café Export del Valle', '3201110018', 'ventas@cafexportvalle.com', 'Cali', 'Zona Industrial Valle', 'Exportadora', '2026-05-12 02:47:38'),
(19, '900100019', 'Cooperativa Café de Nariño', '3201110019', 'pedidos@cafenarino.com', 'Pasto', 'Centro Cafetero Nariño', 'Cooperativa', '2026-05-12 02:47:38'),
(20, '900100020', 'Comercializadora Aroma Premium', '3201110020', 'compras@aromapremium.com', 'Bogotá', 'Cra 80 #30-40', 'Empresa', '2026-05-12 02:47:38'),
(21, '900100021', 'Café Tradición Colombiana', '3201110021', 'ventas@tradicioncafe.com', 'Armenia', 'Zona Cafetera Armenia', 'Empresa', '2026-05-12 02:47:38'),
(22, '900100022', 'Federación Cafetera del Cauca', '3201110022', 'compras@fedecauca.com', 'Popayán', 'Zona Industrial Cauca', 'Cooperativa', '2026-05-12 02:47:38'),
(23, '900100023', 'Coffee Gold Export', '3201110023', 'export@goldcoffee.com', 'Bogotá', 'Zona Franca Occidente', 'Exportadora', '2026-05-12 02:47:38'),
(24, '900100024', 'Cooperativa Cafetera Santander', '3201110024', 'ventas@cafesantander.com', 'Bucaramanga', 'Zona Rural Santander', 'Cooperativa', '2026-05-12 02:47:38'),
(25, '900100025', 'Café Sierra Nevada', '3201110025', 'compras@sierranevada.com', 'Santa Marta', 'Zona Cafetera Norte', 'Empresa', '2026-05-12 02:47:38'),
(26, '900100026', 'Distribuidora Café Selecto', '3201110026', 'pedidos@cafeselecto.com', 'Pereira', 'Cra 12 #15-90', 'Distribuidor', '2026-05-12 02:47:38'),
(27, '900100027', 'Exportadora Aroma Andina', '3201110027', 'ventas@aromaandina.com', 'Medellín', 'Zona Franca Antioquia', 'Exportadora', '2026-05-12 02:47:38'),
(28, '900100028', 'Cooperativa Cafetera Quindío', '3201110028', 'compras@coopquindio.com', 'Armenia', 'Zona Industrial Quindío', 'Cooperativa', '2026-05-12 02:47:38'),
(29, '900100029', 'Café Premium de Colombia', '3201110029', 'pedidos@premiumcol.com', 'Bogotá', 'Centro Empresarial Norte', 'Empresa', '2026-05-12 02:47:38'),
(30, '900100030', 'Asociación Productores de Café', '3201110030', 'ventas@asocafe.com', 'Ibagué', 'Zona Cafetera Tolima', 'Cooperativa', '2026-05-12 02:47:38'),
(31, '900100031', 'Coffee Beans Export SAS', '3201110031', 'export@beans.com', 'Bogotá', 'Zona Franca Bogotá', 'Exportadora', '2026-05-12 02:47:38'),
(32, '900100032', 'Café de Altura Premium', '3201110032', 'compras@altura.com', 'Pereira', 'Zona Cafetera Risaralda', 'Empresa', '2026-05-12 02:47:38'),
(33, '900100033', 'Cooperativa Cafetera del Meta', '3201110033', 'ventas@cafemeta.com', 'Villavicencio', 'Zona Rural Meta', 'Cooperativa', '2026-05-12 02:47:38'),
(34, '900100034', 'Distribuidora Café Real', '3201110034', 'pedidos@cafereal.com', 'Cali', 'Av Central #40-22', 'Distribuidor', '2026-05-12 02:47:38'),
(35, '900100035', 'Café Orgánico Export', '3201110035', 'export@organicexport.com', 'Medellín', 'Zona Franca Sur', 'Exportadora', '2026-05-12 02:47:38'),
(36, '900100036', 'Federación Cafetera del Tolima', '3201110036', 'compras@fedetolima.com', 'Ibagué', 'Zona Industrial Tolima', 'Cooperativa', '2026-05-12 02:47:38'),
(37, '900100037', 'Café Aroma de Montaña', '3201110037', 'ventas@aromamontana.com', 'Manizales', 'Cra 5 #10-22', 'Empresa', '2026-05-12 02:47:38'),
(38, '900100038', 'Cooperativa Cafetera del Valle', '3201110038', 'pedidos@cafevalle.com', 'Cali', 'Zona Cafetera Valle', 'Cooperativa', '2026-05-12 02:47:38'),
(39, '900100039', 'Exportadora Café Supremo', '3201110039', 'export@cafesupremo.com', 'Bogotá', 'Zona Franca Norte', 'Exportadora', '2026-05-12 02:47:38'),
(40, '900100040', 'Café Tradición Andina', '3201110040', 'ventas@tradicionandina.com', 'Tunja', 'Zona Empresarial', 'Empresa', '2026-05-12 02:47:38'),
(41, '900100041', 'Cooperativa Cafetera Boyacá', '3201110041', 'compras@cafeboyaca.com', 'Tunja', 'Zona Rural Boyacá', 'Cooperativa', '2026-05-12 02:47:38'),
(42, '900100042', 'Distribuidora Aroma Premium', '3201110042', 'ventas@aromapremium.com', 'Pasto', 'Centro Comercial Café', 'Distribuidor', '2026-05-12 02:47:38'),
(43, '900100043', 'Coffee Export Andino', '3201110043', 'export@andinoexport.com', 'Bogotá', 'Zona Franca Occidente', 'Exportadora', '2026-05-12 02:47:38'),
(44, '900100044', 'Café Especial del Cauca', '3201110044', 'compras@especialcauca.com', 'Popayán', 'Zona Cafetera Cauca', 'Empresa', '2026-05-12 02:47:38'),
(45, '900100045', 'Cooperativa Cafetera Santander', '3201110045', 'ventas@coopcafesan.com', 'Bucaramanga', 'Zona Rural Santander', 'Cooperativa', '2026-05-12 02:47:38'),
(46, '900100046', 'Café Premium Export SAS', '3201110046', 'export@premiumexport.com', 'Medellín', 'Zona Franca Medellín', 'Exportadora', '2026-05-12 02:47:38'),
(47, '900100047', 'Asociación Cafetera Colombiana', '3201110047', 'pedidos@cafecolombia.com', 'Bogotá', 'Cra 30 #20-50', 'Cooperativa', '2026-05-12 02:47:38'),
(48, '900100048', 'Distribuidora Café Andino', '3201110048', 'ventas@cafeandino.com', 'Armenia', 'Zona Cafetera Armenia', 'Distribuidor', '2026-05-12 02:47:38'),
(49, '900100049', 'Café Supremo de Colombia', '3201110049', 'compras@supremocol.com', 'Pereira', 'Zona Industrial Risaralda', 'Empresa', '2026-05-12 02:47:38'),
(50, '900100050', 'Cooperativa Nacional Cafetera', '3201110050', 'ventas@cooncafe.com', 'Bogotá', 'Centro Nacional Cafetero', 'Cooperativa', '2026-05-12 02:47:38'),
(51, '', '', '', '', '', '', '', '2026-05-12 02:54:22'),
(52, '', '', '', '', '', '', '', '2026-05-12 02:54:23'),
(53, '', '', '', '', '', '', '', '2026-05-12 02:54:26'),
(54, '', '', '', '', '', '', '', '2026-05-12 02:54:26'),
(55, '', '', '', '', '', '', '', '2026-05-12 02:54:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cultivos`
--

CREATE TABLE `cultivos` (
  `idCultivo` int(11) NOT NULL,
  `idLote` int(11) DEFAULT NULL,
  `tipoCafe` varchar(100) DEFAULT NULL,
  `fechaSiembra` date DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cultivos`
--

INSERT INTO `cultivos` (`idCultivo`, `idLote`, `tipoCafe`, `fechaSiembra`, `estado`) VALUES
(1, 1, 'Arábico', '2025-01-15', 'Activo'),
(2, 1, 'Robusta', '2025-02-10', 'Activo'),
(3, 2, 'Arábico', '2025-03-05', 'Activo'),
(4, 2, 'Robusta', '2025-03-20', 'Activo'),
(5, 3, 'Arábico', '2025-04-01', 'Activo'),
(6, 3, 'Robusta', '2025-04-15', 'Activo'),
(7, 4, 'Arábico', '2025-01-08', 'Inactivo'),
(8, 4, 'Robusta', '2025-02-18', 'Inactivo'),
(9, 4, 'Robusta', '2026-05-06', 'Activo'),
(10, 1, 'Arábico', '2026-05-06', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `insumos`
--

CREATE TABLE `insumos` (
  `idInsumo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `idProveedor` int(11) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `unidad` varchar(50) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `stockMinimo` int(11) DEFAULT NULL,
  `fechaRegistro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `insumos`
--

INSERT INTO `insumos` (`idInsumo`, `nombre`, `idProveedor`, `tipo`, `descripcion`, `unidad`, `precio`, `stock`, `stockMinimo`, `fechaRegistro`) VALUES
(1, 'Fertilizante Premium', 1, 'Fertilizante', 'Fertilizante para café arábico', 'Kg', 85000.00, 50, 10, '2026-05-07 04:55:36'),
(2, 'Abono Orgánico', 1, 'Abono', 'Abono natural para cultivos', 'Kg', 45000.00, 30, 5, '2026-05-07 04:55:36'),
(3, 'Herbicida Total', 2, 'Químico', 'Control de maleza', 'Litros', 120000.00, 15, 3, '2026-05-07 04:55:36'),
(4, 'Insecticida Forte', 2, 'Químico', 'Elimina plagas del café', 'Litros', 98000.00, 20, 1, '2026-05-07 04:55:36'),
(5, 'Semilla Robusta', 3, 'Semilla', 'Semilla certificada robusta', 'Unidad', 2500.00, 500, 100, '2026-05-07 04:55:36'),
(6, 'Fertilizante Café Plus', 1, 'Fertilizante', 'Nutrición para café', 'Kg', 78000.00, 40, 10, '2026-05-07 04:56:42'),
(7, 'Urea Agrícola', 1, 'Fertilizante', 'Urea granulada', 'Kg', 65000.00, 25, 5, '2026-05-07 04:56:42'),
(8, 'Cal Dolomita', 2, 'Mineral', 'Mejora PH del suelo', 'Kg', 35000.00, 60, 15, '2026-05-07 04:56:42'),
(9, 'Abono Triple 15', 2, 'Abono', 'Abono químico balanceado', 'Kg', 95000.00, 20, 5, '2026-05-07 04:56:42'),
(10, 'Compost Orgánico', 3, 'Abono', 'Compost natural', 'Kg', 28000.00, 80, 20, '2026-05-07 04:56:42'),
(11, 'Semilla Castilla', 3, 'Semilla', 'Semilla certificada', 'Unidad', 1800.00, 400, 100, '2026-05-07 04:56:42'),
(12, 'Semilla Geisha', 3, 'Semilla', 'Semilla premium', 'Unidad', 4500.00, 150, 30, '2026-05-07 04:56:42'),
(13, 'Herbicida Selectivo', 4, 'Químico', 'Control de maleza', 'Litros', 110000.00, 18, 5, '2026-05-07 04:56:42'),
(14, 'Fungicida Max', 4, 'Químico', 'Protección contra hongos', 'Litros', 134000.00, 12, 3, '2026-05-07 04:56:42'),
(15, 'Insecticida Verde', 4, 'Químico', 'Control de insectos', 'Litros', 99000.00, 10, 2, '2026-05-07 04:56:42'),
(16, 'Manguera Riego', 5, 'Herramienta', 'Manguera flexible', 'Unidad', 65000.00, 14, 4, '2026-05-07 04:56:42'),
(17, 'Aspersor Industrial', 5, 'Herramienta', 'Aspersor metálico', 'Unidad', 45000.00, 22, 5, '2026-05-07 04:56:42'),
(18, 'Guantes Protección', 5, 'Seguridad', 'Guantes impermeables', 'Par', 12000.00, 70, 20, '2026-05-07 04:56:42'),
(19, 'Botas Caucho', 5, 'Seguridad', 'Botas para cultivo', 'Par', 55000.00, 25, 5, '2026-05-07 04:56:42'),
(20, 'Costales Café', 6, 'Empaque', 'Costal de fique', 'Unidad', 8500.00, 120, 30, '2026-05-07 04:56:42'),
(21, 'Canastilla Recolección', 6, 'Herramienta', 'Canastilla plástica', 'Unidad', 38000.00, 35, 10, '2026-05-07 04:56:42'),
(22, 'Tijeras Poda', 6, 'Herramienta', 'Tijera profesional', 'Unidad', 47000.00, 28, 4, '2026-05-07 04:56:42'),
(23, 'Motobomba Agua', 7, 'Maquinaria', 'Motobomba agrícola', 'Unidad', 850000.00, 3, 1, '2026-05-07 04:56:42'),
(24, 'Tanque Fumigación', 7, 'Maquinaria', 'Tanque espalda', 'Unidad', 145000.00, 9, 2, '2026-05-07 04:56:42'),
(25, 'Pulverizador Manual', 7, 'Herramienta', 'Pulverizador pequeño', 'Unidad', 58000.00, 16, 4, '2026-05-07 04:56:42'),
(26, 'Sulfato Magnesio', 8, 'Mineral', 'Complemento mineral', 'Kg', 42000.00, 27, 6, '2026-05-07 04:56:42'),
(27, 'Nitrato Potasio', 8, 'Fertilizante', 'Fertilizante especial', 'Kg', 115000.00, 13, 3, '2026-05-07 04:56:42'),
(28, 'Melaza Orgánica', 8, 'Abono', 'Mejorador biológico', 'Litros', 39000.00, 21, 5, '2026-05-07 04:56:42'),
(29, 'Bolsas Vivero', 9, 'Vivero', 'Bolsas para almácigos', 'Unidad', 300.00, 1000, 200, '2026-05-07 04:56:42'),
(30, 'Sustrato Premium', 9, 'Vivero', 'Sustrato enriquecido', 'Kg', 22000.00, 55, 15, '2026-05-07 04:56:42'),
(31, 'Micorrizas', 9, 'Biológico', 'Estimula raíces', 'Kg', 76000.00, 19, 4, '2026-05-07 04:56:42'),
(32, 'Machete Cafetero', 10, 'Herramienta', 'Machete acero', 'Unidad', 32000.00, 28, 6, '2026-05-07 04:56:42'),
(33, 'Lima Afilar', 10, 'Herramienta', 'Lima profesional', 'Unidad', 9000.00, 40, 10, '2026-05-07 04:56:42'),
(34, 'Cinta Injerto', 10, 'Vivero', 'Cinta para injertos', 'Unidad', 7000.00, 65, 15, '2026-05-07 04:56:42'),
(35, 'Biofertilizante Líquido', 10, 'Biológico', 'Fertilizante natural líquido', 'Litros', 54000.00, 24, 5, '2026-05-07 04:56:42'),
(36, 'fertilianfffffff', 1, 'fertilizante', 'fertlizante ', 'Kg', 45000.00, 56, 5, '2026-05-07 05:24:06'),
(37, 'fertilizan prueba', 62, 'Fertilizante', 'fertiliz prueb', '', 56000.00, 1, 5, '2026-05-12 18:12:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotes`
--

CREATE TABLE `lotes` (
  `idLote` int(11) NOT NULL,
  `nombreLote` varchar(100) DEFAULT NULL,
  `ubicacion` varchar(150) DEFAULT NULL,
  `hectareas` decimal(10,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lotes`
--

INSERT INTO `lotes` (`idLote`, `nombreLote`, `ubicacion`, `hectareas`, `estado`) VALUES
(1, 'Lote Norte', 'Zona Norte', 12.50, 'Activo'),
(2, 'Lote Sur', 'Zona Sur', 8.30, 'Activo'),
(3, 'Lote Oriental', 'Zona Oriente', 15.00, 'Activo'),
(4, 'Lote Occidental', 'Zona Occidente', 6.80, 'Inactivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `id` int(11) NOT NULL,
  `remitente_id` int(11) DEFAULT NULL,
  `receptor_id` int(11) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `archivo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mensajes`
--

INSERT INTO `mensajes` (`id`, `remitente_id`, `receptor_id`, `mensaje`, `fecha`, `archivo`) VALUES
(1, 1, 2, 'Hola administrador', '2026-05-07 22:05:59', NULL),
(2, 2, 1, 'Hola propietario', '2026-05-07 22:05:59', NULL),
(3, 1, 3, '¿Cómo va la recolección?', '2026-05-07 22:05:59', NULL),
(4, 0, 0, '', '2026-05-07 22:09:25', NULL),
(5, 0, 0, '', '2026-05-07 22:09:26', NULL),
(6, 0, 0, '', '2026-05-07 22:09:27', NULL),
(7, 0, 0, '', '2026-05-07 22:09:35', NULL),
(8, 1, 2, '', '2026-05-07 22:16:41', NULL),
(9, 2, 19, 'prueba', '2026-05-07 23:18:26', NULL),
(10, 2, 19, 'jjj', '2026-05-07 23:24:21', NULL),
(11, 2, 2, 'buenas noches prueba', '2026-05-07 23:27:35', NULL),
(12, 2, 19, 'pruva', '2026-05-08 00:01:38', NULL),
(13, 2, 12, 'hhhhhhh', '2026-05-08 17:24:50', NULL),
(14, 2, 19, 'jkjjjj', '2026-05-08 17:25:14', NULL),
(15, 2, 19, 'prueba', '2026-05-08 17:35:47', NULL),
(16, 2, 2, 'prueba', '2026-05-08 17:37:11', NULL),
(17, 2, 19, 'pruebas chat', '2026-05-08 18:07:16', NULL),
(18, 2, 18, 'aaaaa', '2026-05-14 22:01:14', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `idInsumo` int(11) NOT NULL,
  `insumo` varchar(100) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id`, `idInsumo`, `insumo`, `tipo`, `cantidad`, `observacion`, `fecha`) VALUES
(1, 1, 'Fertilizante Premium', 'Salida', 50, 'uso de fertilizante en lote sur', '2026-05-07 18:54:36'),
(2, 1, 'Abono Orgánico', 'Salida', 30, 'fertilizacion lote norte ', '2026-05-07 18:54:36'),
(3, 1, 'Herbicida Total', 'Salida', 3, 'Aplicado en cultivo norte', '2026-05-07 18:54:36'),
(4, 1, 'Insecticida Forte', 'Salida', 3, 'Control de plagas', '2026-05-07 18:54:36'),
(5, 1, 'Semilla Robusta', 'Entrada', 100, 'Ingreso semillas nuevas', '2026-05-07 18:54:36'),
(6, 1, 'Fertilizante Café Plus', 'Salida', 8, 'Uso semanal', '2026-05-07 18:54:36'),
(7, 1, 'Urea Agrícola', 'Entrada', 25, 'Ingreso proveedor', '2026-05-07 18:54:36'),
(8, 1, 'Cal Dolomita', 'Salida', 6, 'Corrección suelo', '2026-05-07 18:54:36'),
(9, 1, 'Abono Triple 15', 'Entrada', 20, 'Compra urgente', '2026-05-07 18:54:36'),
(10, 1, 'Compost Orgánico', 'Salida', 10, 'Aplicación orgánica', '2026-05-07 18:54:36'),
(11, 1, 'Semilla Castilla', 'Entrada', 80, 'Ingreso vivero', '2026-05-07 18:54:36'),
(12, 1, 'Semilla Gesha', 'Entrada', 40, 'Semillas premium', '2026-05-07 18:54:36'),
(13, 1, 'Herbicida Selectivo', 'Salida', 2, 'Control maleza', '2026-05-07 18:54:36'),
(14, 1, 'Fungicida Max', 'Salida', 4, 'Prevención hongos', '2026-05-07 18:54:36'),
(15, 1, 'Insecticida Verde', 'Salida', 1, 'Aplicación manual', '2026-05-07 18:54:36'),
(16, 1, 'Manguera Riego', 'Entrada', 12, 'Ingreso herramientas', '2026-05-07 18:54:36'),
(17, 1, 'Aspersor Industrial', 'Entrada', 5, 'Compra agrícola', '2026-05-07 18:54:36'),
(18, 1, 'Guantes Protección', 'Salida', 7, 'Entrega personal', '2026-05-07 18:54:36'),
(19, 1, 'Botas Caucho', 'Entrada', 15, 'Dotación recolectores', '2026-05-07 18:54:36'),
(20, 1, 'Costales Café', 'Salida', 20, 'Empaque cosecha', '2026-05-07 18:54:36'),
(21, 1, 'Canastilla Recolección', 'Entrada', 10, 'Ingreso bodega', '2026-05-07 18:54:36'),
(22, 1, 'Tijeras Poda', 'Salida', 3, 'Uso mantenimiento', '2026-05-07 18:54:36'),
(23, 1, 'Motobomba Agua', 'Entrada', 2, 'Equipo nuevo', '2026-05-07 18:54:36'),
(24, 1, 'Tanque Fumigación', 'Salida', 1, 'Asignado cultivo', '2026-05-07 18:54:36'),
(25, 1, 'Pulverizador Manual', 'Entrada', 6, 'Compra proveedor', '2026-05-07 18:54:36'),
(26, 1, 'Sulfato Magnesio', 'Salida', 4, 'Fertilización', '2026-05-07 18:54:36'),
(27, 1, 'Nitrato Potasio', 'Entrada', 13, 'Ingreso inventario', '2026-05-07 18:54:36'),
(28, 1, 'Melaza Orgánica', 'Salida', 2, 'Preparación mezcla', '2026-05-07 18:54:36'),
(29, 1, 'Bolsas Vivero', 'Entrada', 300, 'Producción vivero', '2026-05-07 18:54:36'),
(30, 1, 'Sustrato Premium', 'Salida', 18, 'Uso semillero', '2026-05-07 18:54:36'),
(31, 1, 'fertilixxx', 'Entrada', 10, 'fertilizante de prueba', '2026-05-07 19:01:38'),
(32, 1, 'felizprueba', 'Salida', 197, 'prueba', '2026-05-07 19:04:55'),
(33, 1, 'fertilixxx', 'Salida', 10, 'prueba', '2026-05-07 19:06:14'),
(34, 22, NULL, 'Entrada', 10, 'herramienta\n', '2026-05-11 21:56:39'),
(35, 37, NULL, 'Entrada', 1, 'COMPRA', '2026-05-12 13:14:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `usuario_id`, `titulo`, `mensaje`, `fecha`) VALUES
(1, 1, 'Prueba Sistema', 'Esta es una notificación de prueba desde MySQL', '2026-05-08 00:35:40'),
(2, 1, 'Stock Bajo', 'El fertilizante premium está por debajo del stock mínimo', '2026-05-08 02:13:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion`
--

CREATE TABLE `produccion` (
  `id` int(11) NOT NULL,
  `idRecolector` int(11) DEFAULT NULL,
  `idLote` int(11) DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `produccion`
--

INSERT INTO `produccion` (`id`, `idRecolector`, `idLote`, `cantidad`, `fecha`, `observacion`, `responsable`) VALUES
(1, 1, 1, 120.00, '2026-05-14', 'Excelente producción', 'Admin'),
(2, 2, 2, 95.00, '2026-05-14', 'Buen rendimiento', 'Admin'),
(3, 3, 3, 140.00, '2026-05-14', 'Muy buena cosecha', 'Admin'),
(4, 4, 4, 88.00, '2026-05-14', 'Producción estable', 'Admin'),
(5, 5, 1, 132.00, '2026-05-14', 'Excelente café', 'Admin'),
(6, 6, 2, 76.00, '2026-05-14', 'Producción media', 'Admin'),
(7, 26, 3, 154.00, '2026-05-14', 'Muy alta producción', 'Admin'),
(8, 28, 4, 110.00, '2026-05-14', 'Buen trabajo', 'Admin'),
(9, 30, 1, 125.00, '2026-05-14', 'Café de calidad', 'Admin'),
(10, 32, 2, 98.00, '2026-05-14', 'Producción normal', 'Admin'),
(11, 34, 3, 143.00, '2026-05-14', 'Excelente día', 'Admin'),
(12, 36, 4, 101.00, '2026-05-14', 'Buen rendimiento', 'Admin'),
(13, 37, 1, 112.00, '2026-05-14', 'Producción buena', 'Admin'),
(14, 38, 2, 135.00, '2026-05-14', 'Excelente cosecha', 'Admin'),
(15, 39, 3, 121.00, '2026-05-14', 'Muy buena recolección', 'Admin'),
(16, 40, 4, 82.00, '2026-05-14', 'Producción media', 'Admin'),
(17, 41, 1, 145.00, '2026-05-14', 'Excelente café', 'Admin'),
(18, 42, 2, 118.00, '2026-05-14', 'Muy buena calidad', 'Admin'),
(19, 43, 3, 107.00, '2026-05-14', 'Producción estable', 'Admin'),
(20, 44, 4, 129.00, '2026-05-14', 'Excelente rendimiento', 'Admin'),
(21, 45, 1, 91.00, '2026-05-14', 'Buen trabajo', 'Admin'),
(22, 46, 2, 156.00, '2026-05-14', 'Producción alta', 'Admin'),
(23, 47, 3, 134.00, '2026-05-14', 'Muy buen lote', 'Admin'),
(24, 48, 4, 99.00, '2026-05-14', 'Producción normal', 'Admin'),
(25, 49, 1, 122.00, '2026-05-14', 'Excelente producción', 'Admin'),
(26, 50, 2, 108.00, '2026-05-14', 'Buen rendimiento', 'Admin'),
(27, 51, 3, 117.00, '2026-05-14', 'Producción buena', 'Admin'),
(28, 52, 4, 139.00, '2026-05-14', 'Muy buena cosecha', 'Admin'),
(29, 53, 1, 126.00, '2026-05-14', 'Excelente calidad', 'Admin'),
(30, 54, 2, 84.00, '2026-05-14', 'Producción media', 'Admin'),
(31, 55, 3, 142.00, '2026-05-14', 'Muy alta producción', 'Admin'),
(32, 56, 4, 115.00, '2026-05-14', 'Buen rendimiento', 'Admin'),
(33, 57, 1, 133.00, '2026-05-14', 'Excelente café', 'Admin'),
(34, 58, 2, 104.00, '2026-05-14', 'Producción estable', 'Admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `idProveedor` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `empresa` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Activo',
  `fechaRegistro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`idProveedor`, `nombre`, `empresa`, `telefono`, `correo`, `direccion`, `estado`, `fechaRegistro`) VALUES
(1, 'Carlos Mendoza', 'AgroFertil SAS', '3001111111', 'agrofertil@gmail.com', 'Zona Norte', 'Activo', '2026-05-07 04:58:39'),
(2, 'Luis Ramírez', 'Ferticampo', '3002222222', 'ferticampo@gmail.com', 'Zona Sur', 'Activo', '2026-05-07 04:58:39'),
(3, 'María Torres', 'Orgánicos del Café', '3003333333', 'organicoscafe@gmail.com', 'Zona Oriente', 'Activo', '2026-05-07 04:58:39'),
(4, 'Pedro Salazar', 'Químicos Agrícolas', '3004444444', 'quimicosagro@gmail.com', 'Zona Occidente', 'Activo', '2026-05-07 04:58:39'),
(5, 'Ana López', 'Riego y Cultivo', '3005555555', 'riegocultivo@gmail.com', 'Zona Centro', 'Activo', '2026-05-07 04:58:39'),
(6, 'Jorge Herrera', 'Empaques Cafeteros', '3006666666', 'empaquescafe@gmail.com', 'Zona Norte', 'Activo', '2026-05-07 04:58:39'),
(7, 'Sofía Vargas', 'Maquinaria Verde', '3007777777', 'maquinariaverde@gmail.com', 'Zona Sur', 'Activo', '2026-05-07 04:58:39'),
(8, 'Daniel Castro', 'Minerales Agro', '3008888888', 'mineralesagro@gmail.com', 'Zona Centro', 'Activo', '2026-05-07 04:58:39'),
(9, 'Laura Martínez', 'Viveros Premium', '3009999999', 'viverospremium@gmail.com', 'Zona Oriente', 'Activo', '2026-05-07 04:58:39'),
(10, 'Andrés Gómez', 'Herramientas del Campo', '3010000000', 'herramientascampo@gmail.com', 'Zona Occidente', 'Activo', '2026-05-07 04:58:39'),
(11, 'laura', 'damisis', '12166565', 'gamihmjkq@gmal.com', 'cuidad verde diagonal 38 # 37-35 torreo 07 ap 502', 'Activo', '2026-05-07 05:32:55'),
(12, 'giovanny', 'ssnjdhhsjhdj', '3203163557', 'giova@gmail.com', 'DIAGONAL 38 # 19 - 83', 'Activo', '2026-05-07 05:42:54'),
(13, 'Juan Pérez', 'Agro Café SAS', '3001112001', 'juanperez@agrocafe.com', 'Zona Norte', 'Activo', '2026-05-12 00:39:27'),
(14, 'Laura Gómez', 'FertiCampo', '3001112002', 'laura@ferticampo.com', 'Zona Sur', 'Activo', '2026-05-12 00:39:27'),
(15, 'Carlos Ruiz', 'BioCultivos', '3001112003', 'carlos@biocultivos.com', 'Zona Centro', 'Activo', '2026-05-12 00:39:27'),
(16, 'Mariana López', 'Agroinsumos del Tolima', '3001112004', 'mariana@agrotolima.com', 'Zona Oriente', 'Activo', '2026-05-12 00:39:27'),
(17, 'Pedro Castro', 'Café Premium', '3001112005', 'pedro@cafepremium.com', 'Zona Occidente', 'Activo', '2026-05-12 00:39:27'),
(18, 'Diana Herrera', 'Químicos Agrícolas SAS', '3001112006', 'diana@quimicosagricolas.com', 'Zona Norte', 'Activo', '2026-05-12 00:39:27'),
(19, 'Javier Ramírez', 'Semillas Verdes', '3001112007', 'javier@semillasverdes.com', 'Zona Sur', 'Activo', '2026-05-12 00:39:27'),
(20, 'Natalia Torres', 'AgroTech', '3001112008', 'natalia@agrotech.com', 'Zona Centro', 'Activo', '2026-05-12 00:39:27'),
(21, 'Andrés Molina', 'Cultivos del Café', '3001112009', 'andres@cultivoscafe.com', 'Zona Oriente', 'Activo', '2026-05-12 00:39:27'),
(22, 'Paula Vargas', 'AgroFert', '3001112010', 'paula@agrofert.com', 'Zona Occidente', 'Activo', '2026-05-12 00:39:27'),
(23, 'Camilo Rojas', 'Insumos del Campo', '3001112011', 'camilo@insumoscampo.com', 'Zona Norte', 'Activo', '2026-05-12 00:39:27'),
(24, 'Sofía Medina', 'Riego Inteligente', '3001112012', 'sofia@riegointeligente.com', 'Zona Sur', 'Activo', '2026-05-12 00:39:27'),
(25, 'Miguel Castro', 'Maquinaria Verde', '3001112013', 'miguel@maquinariaverde.com', 'Zona Centro', 'Activo', '2026-05-12 00:39:27'),
(26, 'Valentina Pérez', 'Agro Export', '3001112014', 'valentina@agroexport.com', 'Zona Oriente', 'Activo', '2026-05-12 00:39:27'),
(27, 'Daniel Ortiz', 'Café Orgánico', '3001112015', 'daniel@cafeorganico.com', 'Zona Occidente', 'Activo', '2026-05-12 00:39:27'),
(28, 'Sara León', 'Fungicidas Premium', '3001112016', 'sara@fungicidas.com', 'Zona Norte', 'Activo', '2026-05-12 00:39:27'),
(29, 'Kevin Sánchez', 'Herbicidas del Sur', '3001112017', 'kevin@herbicidas.com', 'Zona Sur', 'Activo', '2026-05-12 00:39:27'),
(30, 'Tatiana Gil', 'AgroTools', '3001112018', 'tatiana@agrotools.com', 'Zona Centro', 'Activo', '2026-05-12 00:39:27'),
(31, 'Mauricio Rincón', 'Sembrados SAS', '3001112019', 'mauricio@sembrados.com', 'Zona Oriente', 'Activo', '2026-05-12 00:39:27'),
(32, 'Luisa Fernández', 'Campo Vivo', '3001112020', 'luisa@campovivo.com', 'Zona Occidente', 'Activo', '2026-05-12 00:39:27'),
(33, 'David Romero', 'Agro Global', '3001112021', 'david@agroglobal.com', 'Zona Norte', 'Activo', '2026-05-12 00:39:27'),
(34, 'Juliana Méndez', 'Agro Elite', '3001112022', 'juliana@agroelite.com', 'Zona Sur', 'Activo', '2026-05-12 00:39:27'),
(35, 'Felipe Silva', 'Verde Natural', '3001112023', 'felipe@verdenatural.com', 'Zona Centro', 'Activo', '2026-05-12 00:39:27'),
(36, 'Karen Acosta', 'Cultiva Más', '3001112024', 'karen@cultivamas.com', 'Zona Oriente', 'Activo', '2026-05-12 00:39:27'),
(37, 'Cristian Peña', 'Campo Seguro', '3001112025', 'cristian@camposeguro.com', 'Zona Occidente', 'Activo', '2026-05-12 00:39:27'),
(38, 'Alejandra Ruiz', 'Eco Fertilizantes', '3001112026', 'alejandra@ecofertilizantes.com', 'Zona Norte', 'Activo', '2026-05-12 00:39:27'),
(39, 'Brayan Torres', 'Agro Plus', '3001112027', 'brayan@agroplus.com', 'Zona Sur', 'Activo', '2026-05-12 00:39:27'),
(40, 'Jessica Rojas', 'Viveros del Café', '3001112028', 'jessica@viveroscafe.com', 'Zona Centro', 'Activo', '2026-05-12 00:39:27'),
(41, 'Nicolás Castro', 'Agro Service', '3001112029', 'nicolas@agroservice.com', 'Zona Oriente', 'Activo', '2026-05-12 00:39:27'),
(42, 'Daniela Molina', 'Agro Líder', '3001112030', 'daniela@agrolider.com', 'Zona Occidente', 'Activo', '2026-05-12 00:39:27'),
(43, 'Sebastián Herrera', 'Semillas del Norte', '3001112031', 'sebastian@semillasnorte.com', 'Zona Norte', 'Activo', '2026-05-12 00:39:27'),
(44, 'Gabriela Martínez', 'Riego Total', '3001112032', 'gabriela@riegototal.com', 'Zona Sur', 'Activo', '2026-05-12 00:39:27'),
(45, 'Oscar Gómez', 'Agro Campo', '3001112033', 'oscar@agrocampo.com', 'Zona Centro', 'Activo', '2026-05-12 00:39:27'),
(46, 'Laura Díaz', 'Agro Future', '3001112034', 'lauradiaz@agrofuture.com', 'Zona Oriente', 'Activo', '2026-05-12 00:39:27'),
(47, 'Iván Morales', 'Campo Verde', '3001112035', 'ivan@campoverde.com', 'Zona Occidente', 'Activo', '2026-05-12 00:39:27'),
(48, 'Patricia Salazar', 'FertiPlus', '3001112036', 'patricia@fertiplus.com', 'Zona Norte', 'Activo', '2026-05-12 00:39:27'),
(49, 'Ricardo Vega', 'Químicos del Café', '3001112037', 'ricardo@quimicoscafe.com', 'Zona Sur', 'Activo', '2026-05-12 00:39:27'),
(50, 'Monica Cruz', 'AgroMax', '3001112038', 'monica@agromax.com', 'Zona Centro', 'Activo', '2026-05-12 00:39:27'),
(51, 'Samuel Arias', 'Cultivos Premium', '3001112039', 'samuel@cultivospremium.com', 'Zona Oriente', 'Activo', '2026-05-12 00:39:27'),
(52, 'Yuliana Gómez', 'Agro Colombia', '3001112040', 'yuliana@agrocolombia.com', 'Zona Occidente', 'Activo', '2026-05-12 00:39:27'),
(53, 'Jhon Córdoba', 'Agro Insumos SAS', '3001112041', 'jhon@agroinsumos.com', 'Zona Norte', 'Activo', '2026-05-12 00:39:27'),
(54, 'Marcela Pinto', 'Verde Café', '3001112042', 'marcela@verdecafe.com', 'Zona Sur', 'Activo', '2026-05-12 00:39:27'),
(55, 'Esteban Ramírez', 'Agro Express', '3001112043', 'esteban@agroexpress.com', 'Zona Centro', 'Activo', '2026-05-12 00:39:27'),
(56, 'Carolina León', 'Cultivos Integrales', '3001112044', 'carolina@cultivosintegrales.com', 'Zona Oriente', 'Activo', '2026-05-12 00:39:27'),
(57, 'Fernando Díaz', 'Agro Soluciones', '3001112045', 'fernando@agrosoluciones.com', 'Zona Occidente', 'Activo', '2026-05-12 00:39:27'),
(58, 'Angie Torres', 'Agro Expertos', '3001112046', 'angie@agroexpertos.com', 'Zona Norte', 'Activo', '2026-05-12 00:39:27'),
(59, 'Diego Martínez', 'Campo Productivo', '3001112047', 'diego@campoproductivo.com', 'Zona Sur', 'Activo', '2026-05-12 00:39:27'),
(60, 'Lina Acuña', 'Agro Natura', '3001112048', 'lina@agronatura.com', 'Zona Centro', 'Activo', '2026-05-12 00:39:27'),
(61, 'Héctor Suárez', 'Agro Ferti', '3001112049', 'hector@agroferti.com', 'Zona Oriente', 'Activo', '2026-05-12 00:39:27'),
(62, 'Paola Herrera', 'Agro Bio', '3001112050', 'paola@agrobio.com', 'Zona Occidente', 'Activo', '2026-05-12 00:39:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recoleccion`
--

CREATE TABLE `recoleccion` (
  `idRecoleccion` int(11) NOT NULL,
  `idRecolector` int(11) NOT NULL,
  `idLote` int(11) NOT NULL,
  `variedad` varchar(100) NOT NULL,
  `estado` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `kg` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recoleccion`
--

INSERT INTO `recoleccion` (`idRecoleccion`, `idRecolector`, `idLote`, `variedad`, `estado`, `fecha`, `kg`) VALUES
(1, 1, 1, 'Arábico', 'Mojado', '2026-05-01', 120.50),
(2, 2, 2, 'Robusta', 'Seco', '2026-05-02', 98.20),
(3, 3, 3, 'Arábico', 'Mojado', '2026-05-03', 150.00),
(4, 4, 4, 'Robusta', 'Seco', '2026-05-04', 97.30),
(25, 39, 1, 'Arábico', 'Maduro', '2026-05-11', 125.50),
(26, 40, 1, 'Robusta', 'Seco', '2026-05-12', 98.20),
(27, 41, 1, 'Arábico', 'Mojado', '2026-05-13', 142.80),
(28, 42, 1, 'Robusta', 'Verde', '2026-05-14', 87.30),
(29, 43, 1, 'Arábico', 'Maduro', '2026-05-15', 131.40),
(30, 44, 1, 'Robusta', 'Seco', '2026-05-16', 105.70),
(31, 45, 1, 'Arábico', 'Mojado', '2026-05-17', 149.90),
(32, 46, 1, 'Robusta', 'Verde', '2026-05-18', 93.10),
(33, 47, 1, 'Arábico', 'Maduro', '2026-05-19', 138.60),
(34, 48, 1, 'Robusta', 'Seco', '2026-05-20', 101.25),
(35, 49, 1, 'Arábico', 'Mojado', '2026-05-21', 156.75),
(36, 39, 1, 'Robusta', 'Verde', '2026-05-22', 89.45),
(37, 40, 1, 'Arábico', 'Maduro', '2026-05-23', 143.00),
(38, 41, 1, 'Robusta', 'Seco', '2026-05-24', 97.80),
(39, 42, 1, 'Arábico', 'Mojado', '2026-05-25', 162.30),
(40, 43, 1, 'Robusta', 'Verde', '2026-05-26', 84.90),
(41, 44, 1, 'Arábico', 'Maduro', '2026-05-27', 149.70),
(42, 45, 1, 'Robusta', 'Seco', '2026-05-28', 105.15),
(43, 46, 1, 'Arábico', 'Mojado', '2026-05-29', 158.40),
(44, 26, 1, 'Robusta', 'Maduro', '2026-05-30', 100.00),
(47, 1, 1, 'Arábico', 'Mojado', '2026-01-10', 120.50),
(48, 2, 2, 'Robusta', 'Seco', '2026-02-15', 98.20),
(49, 3, 3, 'Geisha', 'Maduro', '2026-03-20', 150.00),
(50, 4, 1, 'Arábico', 'Seco', '2026-04-05', 97.30),
(51, 1, 2, 'Robusta', 'Maduro', '2026-05-12', 125.50),
(152, 1, 1, 'Arábico', 'Mojado', '2026-01-05', 120.50),
(153, 2, 2, 'Robusta', 'Seco', '2026-01-08', 98.20),
(154, 3, 3, 'Geisha', 'Maduro', '2026-01-12', 150.00),
(155, 4, 4, 'Arábico', 'Seco', '2026-01-15', 97.30),
(156, 1, 1, 'Robusta', 'Maduro', '2026-02-20', 125.50),
(157, 2, 2, 'Geisha', 'Verde', '2026-02-25', 80.00),
(158, 3, 3, 'Arábico', 'Mojado', '2026-03-05', 132.00),
(159, 4, 4, 'Robusta', 'Seco', '2026-03-10', 110.00),
(160, 1, 1, 'Geisha', 'Maduro', '2026-04-02', 140.00),
(161, 2, 2, 'Arábico', 'Seco', '2026-04-06', 95.00),
(162, 3, 3, 'Robusta', 'Mojado', '2026-04-12', 160.00),
(163, 4, 4, 'Geisha', 'Verde', '2026-04-18', 70.00),
(164, 1, 1, 'Arábico', 'Maduro', '2026-05-02', 155.00),
(165, 2, 2, 'Robusta', 'Seco', '2026-05-05', 112.00),
(166, 3, 3, 'Geisha', 'Mojado', '2026-05-07', 175.00),
(167, 4, 4, 'Arábico', 'Verde', '2026-05-10', 82.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recolectores`
--

CREATE TABLE `recolectores` (
  `idRecolector` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cedula` varchar(30) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `zonaTrabajo` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `idCultivo` int(11) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Activo',
  `fechaRegistro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recolectores`
--

INSERT INTO `recolectores` (`idRecolector`, `nombre`, `cedula`, `telefono`, `zonaTrabajo`, `foto`, `idCultivo`, `idUsuario`, `estado`, `fechaRegistro`) VALUES
(1, 'Juan Recolector', '100000001', '3001111111', 'Zona Norte', 'uploads/usuarios/default.jpg', 1, 5, 'Activo', '2026-05-06 20:56:37'),
(2, 'Pedro Recolector', '100000002', '3002222222', 'Zona Sur', 'uploads/usuarios/default.jpg', 1, 6, 'Activo', '2026-05-06 20:56:37'),
(3, 'Luis Recolector', '100000003', '3003333333', 'Zona Centro', 'uploads/usuarios/default.jpg', 1, 7, 'Activo', '2026-05-06 20:56:37'),
(4, 'Ana Recolectora', '100000004', '3004444444', 'Zona Occidente', 'uploads/usuarios/default.jpg', 1, 8, 'Activo', '2026-05-06 20:56:37'),
(5, 'Sofia Recolectora', '100000005', '3005555555', 'Zona Oriente', 'uploads/usuarios/default.jpg', 1, 9, 'Activo', '2026-05-06 20:56:37'),
(6, 'javier soler', '124563', '3698527411', 'zona sur', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-06 20:58:41'),
(26, 'bladimir loaiza', '28368479', '3216547890', 'zona sur', 'uploads/usuarios/danesrobinson.jpg', 1, 1, 'Activo', '2026-05-06 22:19:13'),
(28, 'Martha vargas', '258741963', '3207894562', 'Zona Norte', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-06 22:24:23'),
(30, 'marcela vargas', '147852', '31012345664', 'Zona Occidente', 'uploads/usuarios/danesrobinson.jpg', 1, 1, 'Activo', '2026-05-06 22:25:52'),
(32, 'cecilia poveda', '98765412', '2564781963', 'Zona Sur', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-06 22:27:23'),
(34, 'gina milena valbuena conde', '124679', '3176667038', 'Zona Oriente', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-06 22:30:17'),
(36, 'LAURA ALEXANDRA ', '124679', '3203163555', 'Zona Oriente', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-06 22:41:08'),
(37, 'david loaiza', '124679556464', '314376685121211', 'Zona Sur', 'uploads/usuarios/danesrobinson.jpg', 1, 1, 'Activo', '2026-05-06 22:42:17'),
(38, 'pedro leal', '1020400010', '32145979879', 'Zona Sur', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-07 18:56:58'),
(39, 'Carlos Medina', '100000101', '3001110001', 'Zona Norte', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(40, 'Luis Gómez', '100000102', '3001110002', 'Zona Sur', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(41, 'María Torres', '100000103', '3001110003', 'Zona Centro', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(42, 'Andrés Pérez', '100000104', '3001110004', 'Zona Occidente', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(43, 'Laura Ramírez', '100000105', '3001110005', 'Zona Oriente', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(44, 'Javier León', '100000106', '3001110006', 'Zona Norte', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(45, 'Camila Vargas', '100000107', '3001110007', 'Zona Sur', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(46, 'Pedro Salas', '100000108', '3001110008', 'Zona Centro', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(47, 'Ana Castillo', '100000109', '3001110009', 'Zona Occidente', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(48, 'Miguel Rojas', '100000110', '3001110010', 'Zona Oriente', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(49, 'Sofía Herrera', '100000111', '3001110011', 'Zona Norte', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(50, 'Daniel Mora', '100000112', '3001110012', 'Zona Sur', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(51, 'Paula Díaz', '100000113', '3001110013', 'Zona Centro', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(52, 'José Cárdenas', '100000114', '3001110014', 'Zona Occidente', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(53, 'Natalia Ruiz', '100000115', '3001110015', 'Zona Oriente', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(54, 'Felipe Suárez', '100000116', '3001110016', 'Zona Norte', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(55, 'Valentina Cruz', '100000117', '3001110017', 'Zona Sur', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(56, 'Kevin Martínez', '100000118', '3001110018', 'Zona Centro', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(57, 'Juliana Peña', '100000119', '3001110019', 'Zona Occidente', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27'),
(58, 'Brayan López', '100000120', '3001110020', 'Zona Oriente', 'uploads/usuarios/default.jpg', 1, 1, 'Activo', '2026-05-11 21:30:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRol` int(11) NOT NULL,
  `nombreRol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`idRol`, `nombreRol`) VALUES
(1, 'Propietario'),
(2, 'Administrador'),
(3, 'Recolector');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `contrasena` varchar(100) DEFAULT NULL,
  `idRol` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `documento` varchar(30) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `correo`, `contrasena`, `idRol`, `foto`, `telefono`, `documento`, `direccion`, `estado`) VALUES
(1, 'Admin Sistema', 'admin@scafi.com', '123456', 2, 'uploads/usuarios/default.jpg', '3001001001', '100000001', 'Centro Administrativo', 'Activo'),
(2, 'Carlos Propietario', 'anamaris22@outlook.com', '12345', 1, 'uploads/usuarios/default.jpg', '3001001002', '100000002', 'Finca El Cafetal', 'Activo'),
(3, 'Maria Propietaria', 'maria@scafi.com', '123456', 1, 'uploads/usuarios/default.jpg', '3001001003', '100000003', 'Vereda La Esperanza', 'Activo'),
(4, 'Admin Sistema', 'admin@scafi.com', '123456', 2, 'uploads/usuarios/default.jpg', '3001001004', '100000004', 'Oficina Principal', 'Activo'),
(5, 'Juan Recolector', 'juan@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001005', '100000005', 'Zona Norte', 'Activo'),
(6, 'Pedro Recolector', 'pedro@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001006', '100000006', 'Zona Sur', 'Activo'),
(7, 'Luis Recolector', 'luis@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001007', '100000007', 'Zona Rural', 'Activo'),
(8, 'Ana Recolectora', 'ana@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001008', '100000008', 'Barrio Central', 'Activo'),
(9, 'Sofia Recolectora', 'sofia@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001009', '100000009', 'Sector Cafetero', 'Activo'),
(10, 'Camila Recolectora', 'camila@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001010', '100000010', 'Zona Alta', 'Activo'),
(11, 'Diego Recolector', 'diego@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001011', '100000011', 'Zona Baja', 'Activo'),
(12, 'Andres Recolector', 'andres@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001012', '100000012', 'Vereda Norte', 'Activo'),
(13, 'Miguel Recolector', 'miguel@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001013', '100000013', 'Vereda Sur', 'Activo'),
(14, 'Jose Recolector', 'jose@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001014', '100000014', 'Finca La Palma', 'Activo'),
(15, 'Laura Recolectora', 'laura@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001015', '100000015', 'Finca Central', 'Activo'),
(16, 'Paula Recolectora', 'paula@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001016', '100000016', 'Zona Cafetera', 'Activo'),
(17, 'Kevin Recolector', 'kevin@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001017', '100000017', 'Vereda Alta', 'Activo'),
(18, 'Daniel Recolector', 'daniel@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001018', '100000018', 'Sector Norte', 'Activo'),
(19, 'Valentina Recolectora', 'valentina@scafi.com', '123456', 3, 'uploads/usuarios/default.jpg', '3001001019', '100000019', 'Sector Sur', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `idVenta` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `cliente` varchar(150) DEFAULT NULL,
  `producto` varchar(150) DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`idVenta`, `fecha`, `cliente`, `producto`, `cantidad`, `precio`, `total`, `estado`) VALUES
(1, '2026-05-01', 'Carlos Gómez', 'Arábico', 10.00, 18000.00, 180000.00, 'Pagado'),
(2, '2026-05-01', 'Laura Medina', 'Robusta', 15.00, 16000.00, 240000.00, 'Pagado'),
(3, '2026-05-02', 'Pedro Ramírez', 'Geisha', 5.00, 45000.00, 225000.00, 'Pagado'),
(4, '2026-05-02', 'Ana Torres', 'Arábico', 20.00, 17500.00, 350000.00, 'Pagado'),
(5, '2026-05-03', 'Miguel Rojas', 'Robusta', 18.00, 16500.00, 297000.00, 'Pagado'),
(6, '2026-05-03', 'Sofía Herrera', 'Geisha', 4.00, 48000.00, 192000.00, 'Pagado'),
(7, '2026-05-04', 'Daniel Castro', 'Arábico', 25.00, 17800.00, 445000.00, 'Pagado'),
(8, '2026-05-04', 'Camila Vargas', 'Robusta', 12.00, 16200.00, 194400.00, 'Pagado'),
(9, '2026-05-05', 'Luis Gómez', 'Geisha', 3.00, 50000.00, 150000.00, 'Pagado'),
(10, '2026-05-05', 'Valentina Ruiz', 'Arábico', 30.00, 18000.00, 540000.00, 'Pagado'),
(11, '2026-05-06', 'Jorge Medina', 'Robusta', 22.00, 16500.00, 363000.00, 'Pagado'),
(12, '2026-05-06', 'Paula León', 'Geisha', 6.00, 47000.00, 282000.00, 'Pagado'),
(13, '2026-05-07', 'Ricardo Pérez', 'Arábico', 16.00, 17600.00, 281600.00, 'Pagado'),
(14, '2026-05-07', 'María López', 'Robusta', 14.00, 16000.00, 224000.00, 'Pagado'),
(15, '2026-05-08', 'Andrés Silva', 'Geisha', 7.00, 49000.00, 343000.00, 'Pagado'),
(16, '2026-05-08', 'Juliana Herrera', 'Arábico', 28.00, 18200.00, 509600.00, 'Pagado'),
(17, '2026-05-09', 'Fernando Díaz', 'Robusta', 10.00, 15800.00, 158000.00, 'Pagado'),
(18, '2026-05-09', 'Natalia Cruz', 'Geisha', 2.00, 52000.00, 104000.00, 'Pagado'),
(19, '2026-05-10', 'Juan Martínez', 'Arábico', 19.00, 17900.00, 340100.00, 'Pagado'),
(20, '2026-05-10', 'Carolina Vega', 'Robusta', 24.00, 16400.00, 393600.00, 'Pagado'),
(21, '2026-05-11', 'David León', 'Geisha', 5.00, 51000.00, 255000.00, 'Pagado'),
(22, '2026-05-11', 'Tatiana Gómez', 'Arábico', 21.00, 17700.00, 371700.00, 'Pagado'),
(23, '2026-05-12', 'Kevin Torres', 'Robusta', 13.00, 16100.00, 209300.00, 'Pagado'),
(24, '2026-05-12', 'Liliana Mora', 'Geisha', 8.00, 49500.00, 396000.00, 'Pagado'),
(25, '2026-05-13', 'Mauricio Ruiz', 'Arábico', 17.00, 18000.00, 306000.00, 'Pagado'),
(26, '2026-05-13', 'Sara López', 'Robusta', 11.00, 15900.00, 174900.00, 'Pagado'),
(27, '2026-05-14', 'Diego Herrera', 'Geisha', 4.00, 53000.00, 212000.00, 'Pagado'),
(28, '2026-05-14', 'Mónica Castro', 'Arábico', 26.00, 18100.00, 470600.00, 'Pagado'),
(29, '2026-05-15', 'Cristian Díaz', 'Robusta', 20.00, 16600.00, 332000.00, 'Pagado'),
(30, '2026-05-15', 'Adriana Pérez', 'Geisha', 6.00, 50000.00, 300000.00, 'Pagado'),
(31, '2026-05-16', 'Santiago Rojas', 'Arábico', 18.00, 17800.00, 320400.00, 'Pagado'),
(32, '2026-05-16', 'Andrea Medina', 'Robusta', 9.00, 16200.00, 145800.00, 'Pagado'),
(33, '2026-05-17', 'Felipe Gómez', 'Geisha', 7.00, 51500.00, 360500.00, 'Pagado'),
(34, '2026-05-17', 'Paola Vargas', 'Arábico', 32.00, 18000.00, 576000.00, 'Pagado'),
(35, '2026-05-18', 'Óscar Ramírez', 'Robusta', 16.00, 16300.00, 260800.00, 'Pagado'),
(36, '2026-05-18', 'Verónica León', 'Geisha', 5.00, 50500.00, 252500.00, 'Pagado'),
(37, '2026-05-19', 'Eduardo Silva', 'Arábico', 14.00, 17600.00, 246400.00, 'Pagado'),
(38, '2026-05-19', 'Lorena Torres', 'Robusta', 27.00, 16500.00, 445500.00, 'Pagado'),
(39, '2026-05-20', 'Alejandro Cruz', 'Geisha', 3.00, 54000.00, 162000.00, 'Pagado'),
(40, '2026-05-20', 'Claudia Gómez', 'Arábico', 29.00, 18200.00, 527800.00, 'Pagado'),
(41, '2026-05-21', 'Iván Herrera', 'Robusta', 15.00, 16000.00, 240000.00, 'Pagado'),
(42, '2026-05-21', 'Patricia Díaz', 'Geisha', 9.00, 49800.00, 448200.00, 'Pagado'),
(43, '2026-05-22', 'Raúl Medina', 'Arábico', 24.00, 17900.00, 429600.00, 'Pagado'),
(44, '2026-05-22', 'Marcela Ruiz', 'Robusta', 12.00, 16400.00, 196800.00, 'Pagado'),
(45, '2026-05-23', 'Héctor López', 'Geisha', 6.00, 52000.00, 312000.00, 'Pagado'),
(46, '2026-05-23', 'Gloria Vega', 'Arábico', 20.00, 17700.00, 354000.00, 'Pagado'),
(47, '2026-05-24', 'Sebastián Castro', 'Robusta', 18.00, 16600.00, 298800.00, 'Pagado'),
(48, '2026-05-24', 'Diana León', 'Geisha', 4.00, 55000.00, 220000.00, 'Pagado'),
(49, '2026-05-25', 'Tomás Silva', 'Arábico', 31.00, 18100.00, 561100.00, 'Pagado'),
(50, '2026-05-25', 'Yulieth Pérez', 'Robusta', 22.00, 16300.00, 358600.00, 'Pagado'),
(57, '2026-05-11', 'laura estrada', 'Robusta', 100.00, 4000.00, 400000.00, 'Pagado'),
(59, '2026-05-05', 'semicafe', 'Robusta', 500.00, 4000.00, 2000000.00, 'Pagado'),
(60, '2026-05-11', 'Laura Lopera', 'Robusta', 100.00, 4000.00, 400000.00, 'Pagado'),
(71, '2026-05-26', 'Carlos Ramírez', 'Arábico', 25.00, 18000.00, 450000.00, 'Pagado'),
(72, '2026-05-26', 'María Torres', 'Robusta', 14.00, 16500.00, 231000.00, 'Pagado'),
(73, '2026-05-27', 'Andrés López', 'Geisha', 7.00, 50000.00, 350000.00, 'Pagado'),
(74, '2026-05-27', 'Sofía Martínez', 'Arábico', 30.00, 18200.00, 546000.00, 'Pagado'),
(75, '2026-05-28', 'Julián Herrera', 'Robusta', 20.00, 16000.00, 320000.00, 'Pagado'),
(76, '2026-05-28', 'Camila Díaz', 'Geisha', 10.00, 52000.00, 520000.00, 'Pagado'),
(77, '2026-01-05', 'Carlos Ramírez', 'Arábico', 20.00, 18000.00, 360000.00, 'Pagado'),
(78, '2026-01-08', 'María Torres', 'Robusta', 15.00, 16000.00, 240000.00, 'Pagado'),
(79, '2026-01-12', 'Andrés López', 'Geisha', 8.00, 50000.00, 400000.00, 'Pagado'),
(80, '2026-01-15', 'Sofía Martínez', 'Arábico', 25.00, 18200.00, 455000.00, 'Pagado'),
(81, '2026-01-20', 'Julián Herrera', 'Robusta', 10.00, 16500.00, 165000.00, 'Pagado'),
(82, '2026-01-25', 'Camila Díaz', 'Geisha', 12.00, 52000.00, 624000.00, 'Pagado'),
(83, '2026-01-28', 'Luis Gómez', 'Arábico', 18.00, 17900.00, 322200.00, 'Pagado'),
(84, '2026-01-30', 'Paola Ruiz', 'Robusta', 22.00, 16200.00, 356400.00, 'Pagado'),
(85, '2026-02-03', 'Héctor López', 'Geisha', 6.00, 51000.00, 306000.00, 'Pagado'),
(86, '2026-02-06', 'Gloria Vega', 'Arábico', 30.00, 18000.00, 540000.00, 'Pagado'),
(87, '2026-02-10', 'Sebastián Castro', 'Robusta', 14.00, 16400.00, 229600.00, 'Pagado'),
(88, '2026-02-14', 'Diana León', 'Geisha', 9.00, 55000.00, 495000.00, 'Pagado'),
(89, '2026-02-18', 'Tomás Silva', 'Arábico', 28.00, 18100.00, 506800.00, 'Pagado'),
(90, '2026-02-22', 'Yulieth Pérez', 'Robusta', 20.00, 16300.00, 326000.00, 'Pagado'),
(91, '2026-02-25', 'Laura Estrada', 'Geisha', 7.00, 52000.00, 364000.00, 'Pagado'),
(92, '2026-02-28', 'Miguel Ángel', 'Arábico', 26.00, 17800.00, 462800.00, 'Pagado'),
(93, '2026-03-02', 'Patricia Díaz', 'Robusta', 12.00, 16000.00, 192000.00, 'Pagado'),
(94, '2026-03-05', 'Raúl Medina', 'Arábico', 24.00, 17900.00, 429600.00, 'Pagado'),
(95, '2026-03-08', 'Marcela Ruiz', 'Geisha', 10.00, 54000.00, 540000.00, 'Pagado'),
(96, '2026-03-12', 'Iván Herrera', 'Robusta', 18.00, 16500.00, 297000.00, 'Pagado'),
(97, '2026-03-15', 'Claudia Gómez', 'Arábico', 20.00, 18200.00, 364000.00, 'Pagado'),
(98, '2026-03-18', 'Fernando Ríos', 'Geisha', 5.00, 56000.00, 280000.00, 'Pagado'),
(99, '2026-03-22', 'Natalia López', 'Robusta', 16.00, 16200.00, 259200.00, 'Pagado'),
(100, '2026-03-26', 'Esteban Torres', 'Arábico', 22.00, 18000.00, 396000.00, 'Pagado'),
(101, '2026-04-01', 'Andrea Ramírez', 'Geisha', 8.00, 53000.00, 424000.00, 'Pagado'),
(102, '2026-04-04', 'Jorge Castillo', 'Arábico', 27.00, 18100.00, 488700.00, 'Pagado'),
(103, '2026-04-08', 'Lucía Fernández', 'Robusta', 14.00, 16000.00, 224000.00, 'Pagado'),
(104, '2026-04-12', 'Pedro Sánchez', 'Geisha', 6.00, 55000.00, 330000.00, 'Pagado'),
(105, '2026-04-16', 'Valentina Díaz', 'Arábico', 25.00, 17900.00, 447500.00, 'Pagado'),
(106, '2026-04-20', 'Samuel Herrera', 'Robusta', 20.00, 16300.00, 326000.00, 'Pagado'),
(107, '2026-04-24', 'Isabel Gómez', 'Geisha', 9.00, 52000.00, 468000.00, 'Pagado'),
(108, '2026-04-28', 'Ricardo Vega', 'Arábico', 30.00, 18200.00, 546000.00, 'Pagado'),
(109, '2026-05-02', 'Laura Estrada', 'Robusta', 12.00, 16000.00, 192000.00, 'Pagado'),
(110, '2026-05-05', 'Semicafé Ltda', 'Robusta', 500.00, 4000.00, 2000000.00, 'Pagado'),
(111, '2026-05-07', 'Carlos Ramírez', 'Arábico', 29.00, 18200.00, 527800.00, 'Pagado'),
(112, '2026-05-10', 'María Torres', 'Robusta', 15.00, 16000.00, 240000.00, 'Pagado'),
(113, '2026-05-13', 'Patricia Díaz', 'Geisha', 9.00, 49800.00, 448200.00, 'Pagado'),
(114, '2026-05-16', 'Raúl Medina', 'Arábico', 24.00, 17900.00, 429600.00, 'Pagado'),
(115, '2026-05-19', 'Marcela Ruiz', 'Robusta', 12.00, 16400.00, 196800.00, 'Pagado'),
(116, '2026-05-22', 'Héctor López', 'Geisha', 6.00, 52000.00, 312000.00, 'Pagado'),
(117, '2026-05-25', 'Gloria Vega', 'Arábico', 20.00, 17700.00, 354000.00, 'Pagado'),
(118, '2026-05-28', 'Sebastián Castro', 'Robusta', 18.00, 16600.00, 298800.00, 'Pagado'),
(119, '2026-05-30', 'Diana León', 'Geisha', 5.00, 55000.00, 220000.00, 'Pagado');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  ADD PRIMARY KEY (`idCultivo`),
  ADD KEY `idLote` (`idLote`);

--
-- Indices de la tabla `insumos`
--
ALTER TABLE `insumos`
  ADD PRIMARY KEY (`idInsumo`);

--
-- Indices de la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`idLote`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idRecolector` (`idRecolector`),
  ADD KEY `idLote` (`idLote`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`idProveedor`);

--
-- Indices de la tabla `recoleccion`
--
ALTER TABLE `recoleccion`
  ADD PRIMARY KEY (`idRecoleccion`),
  ADD KEY `idRecolector` (`idRecolector`),
  ADD KEY `fk_recoleccion_lote` (`idLote`);

--
-- Indices de la tabla `recolectores`
--
ALTER TABLE `recolectores`
  ADD PRIMARY KEY (`idRecolector`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idRol` (`idRol`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`idVenta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  MODIFY `idCultivo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `insumos`
--
ALTER TABLE `insumos`
  MODIFY `idInsumo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `lotes`
--
ALTER TABLE `lotes`
  MODIFY `idLote` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `produccion`
--
ALTER TABLE `produccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `idProveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `recoleccion`
--
ALTER TABLE `recoleccion`
  MODIFY `idRecoleccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=184;

--
-- AUTO_INCREMENT de la tabla `recolectores`
--
ALTER TABLE `recolectores`
  MODIFY `idRecolector` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `idVenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cultivos`
--
ALTER TABLE `cultivos`
  ADD CONSTRAINT `cultivos_ibfk_1` FOREIGN KEY (`idLote`) REFERENCES `lotes` (`idLote`);

--
-- Filtros para la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD CONSTRAINT `produccion_ibfk_1` FOREIGN KEY (`idRecolector`) REFERENCES `recolectores` (`idRecolector`),
  ADD CONSTRAINT `produccion_ibfk_2` FOREIGN KEY (`idLote`) REFERENCES `lotes` (`idLote`);

--
-- Filtros para la tabla `recoleccion`
--
ALTER TABLE `recoleccion`
  ADD CONSTRAINT `fk_recoleccion_lote` FOREIGN KEY (`idLote`) REFERENCES `lotes` (`idLote`),
  ADD CONSTRAINT `recoleccion_ibfk_1` FOREIGN KEY (`idRecolector`) REFERENCES `recolectores` (`idRecolector`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
