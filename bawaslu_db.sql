-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 05, 2024 at 03:37 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bawaslu`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` int(2) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `username`, `password`, `role`) VALUES
(1, 'super-admin', 'superadmin123', 'super-admin'),
(2, 'admin', 'sangaji123', 'admin'),
(3, 'ammar', 'sangaji123', 'admin'),
(4, 'ammarhawari', 'sangaji123', 'admin'),
(5, 'tes', '123', 'admin'),
(6, 'ammar', 'hawari', 'super-admin');

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `id` int(3) NOT NULL,
  `kecamatan` varchar(100) DEFAULT NULL,
  `file` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`id`, `kecamatan`, `file`) VALUES
(3, 'Asemrowo', ''),
(4, 'Benowo', ''),
(5, 'Bubutan', ''),
(6, 'Bulak', ''),
(7, 'Dukuh Pakis', ''),
(8, 'Gayungan', ''),
(9, 'Genteng', ''),
(10, 'Gubeng', ''),
(11, 'Gunung Anyar', ''),
(12, 'Jambangan', ''),
(13, 'Karang Pilang', ''),
(14, 'Kenjeran', ''),
(15, 'Krembangan', ''),
(16, 'Lakarsantri', ''),
(17, 'Mulyorejo', ''),
(18, 'Pabean Cantian', ''),
(19, 'Pakal', ''),
(20, 'Rungkut', ''),
(21, 'Sambikerep', ''),
(22, 'Sawahan', ''),
(23, 'Semampir', ''),
(24, 'Simokerto', ''),
(25, 'Sukolilo', ''),
(26, 'Sukomanunggal', ''),
(27, 'Tambaksari', ''),
(28, 'Tandes', ''),
(29, 'Tegalsari', ''),
(30, 'Tenggilis Mejoyo', ''),
(31, 'Wiyung', ''),
(32, 'Wonocolo', ''),
(33, 'Wonokromo', '');

-- --------------------------------------------------------

--
-- Table structure for table `desa`
--

CREATE TABLE `desa` (
  `id` int(11) NOT NULL,
  `kecamatan_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `file` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `desa`
--

INSERT INTO `desa` (`id`, `kecamatan_id`, `name`, `file`) VALUES
(1, 3, 'ASEM ROWO', 'Asem Rowo.xlsx'),
(2, 3, 'GENTING KALIANAK', 'Asem Rowo.xlsx'),
(3, 3, 'TAMBAK SARIOSO', 'Asem Rowo.xlsx'),
(4, 4, 'KANDANGAN', 'Benowo.xlsx'),
(5, 4, 'ROMOKALISARI', 'Benowo.xlsx'),
(6, 4, 'SEMEMI', 'Benowo.xlsx'),
(7, 4, 'TAMBAK OSOWILANGUN', 'Benowo.xlsx'),
(8, 5, 'ALUN-ALUN GONTONG', 'Bubutan.xlsx'),
(9, 5, 'BUBUTAN', 'Bubutan.xlsx'),
(10, 5, 'GUNDIH', 'Bubutan.xlsx'),
(11, 5, 'Jepara', NULL),
(12, 5, 'TEMBOK DUKUH', 'Bubutan.xlsx'),
(13, 6, 'BULAK', 'Bulak.xlsx'),
(14, 6, 'KEDUNGCOWEK', 'Bulak.xlsx'),
(15, 6, 'KENJERAN', 'Bulak.xlsx'),
(16, 6, 'Sukolilo Baru', 'Bulak.xlsx'),
(17, 7, 'Dukuh Kupang', NULL),
(18, 7, 'Dukuh Pakis', NULL),
(19, 7, 'GUNUNG SARI', 'test.xlsx'),
(20, 7, 'Pradah Kalikendal', NULL),
(21, 8, 'Dukuh Menanggal', NULL),
(22, 8, 'Gayungan', NULL),
(23, 8, 'Keputih', NULL),
(24, 8, 'Ketintang', NULL),
(25, 9, 'Embong Kaliasin', NULL),
(26, 9, 'Genteng', NULL),
(27, 9, 'Kapasari', NULL),
(28, 9, 'Ketabang', NULL),
(29, 9, 'Peneleh', NULL),
(30, 10, 'Airlangga', NULL),
(31, 10, 'Barata Jaya', NULL),
(32, 10, 'Gubeng', NULL),
(33, 10, 'Kertajaya', NULL),
(34, 10, 'Mojo', NULL),
(35, 10, 'Pucangsewu', NULL),
(36, 11, 'Gunung Anyar', NULL),
(37, 11, 'Gunung Anyar Tambak', NULL),
(38, 11, 'Rungkut Menanggal', NULL),
(39, 11, 'Rungkut Tengah', NULL),
(40, 12, 'Jambangan', NULL),
(41, 12, 'Karah', NULL),
(42, 12, 'Kebonsari', NULL),
(43, 12, 'Pagesangan', NULL),
(44, 13, 'Karang Pilang', NULL),
(45, 13, 'Kebraon', NULL),
(46, 13, 'Kedurus', NULL),
(47, 13, 'Warugunung', NULL),
(48, 14, 'Bulakbanteng', NULL),
(49, 14, 'Tambakwedi', NULL),
(50, 14, 'Tanah Kalikedinding', NULL),
(51, 14, 'Sidotop Wetan', NULL),
(52, 15, 'Dupak', NULL),
(53, 15, 'Kemayoran', NULL),
(54, 15, 'Krembangan Selatan', NULL),
(55, 15, 'Monokrembangan', NULL),
(56, 15, 'Perak Barat', NULL),
(57, 16, 'Bangkingan', NULL),
(58, 16, 'Jeruk', NULL),
(59, 16, 'Lakarsantri', NULL),
(60, 16, 'Lidah Kulon', NULL),
(61, 16, 'Lidah Wetan', NULL),
(62, 16, 'Sumur Welut', NULL),
(63, 17, 'Dukuh Sutorejo', NULL),
(64, 17, 'Kalijudan', NULL),
(65, 17, 'Kalisari', NULL),
(66, 17, 'Kejawan Putih Tambak', NULL),
(67, 17, 'Manyar Sabrangan', NULL),
(68, 17, 'Mulyorejo', NULL),
(69, 18, 'Bongkaran', NULL),
(70, 18, 'Krembangan Utara', NULL),
(71, 18, 'Nyamplungan', NULL),
(72, 18, 'Perak Timur', NULL),
(73, 18, 'Perak Utara', NULL),
(74, 19, 'Babat Jerawat', NULL),
(75, 19, 'Benowo', NULL),
(76, 19, 'Pakal', NULL),
(77, 19, 'Sumberejo', NULL),
(78, 20, 'Kali Rungkut', NULL),
(79, 20, 'Kedung Baruk', NULL),
(80, 20, 'Medokan Ayu', NULL),
(81, 20, 'Penjaringan Sari', NULL),
(82, 20, 'Rungkut Kidul', NULL),
(83, 20, 'Wonorejo', NULL),
(84, 21, 'Bringin', NULL),
(85, 21, 'Made', NULL),
(86, 21, 'Lontar', NULL),
(87, 21, 'Sambikerep', NULL),
(88, 22, 'Banyu Urip', NULL),
(89, 22, 'Kupang Krajan', NULL),
(90, 22, 'Pakis', NULL),
(91, 22, 'Patemon', NULL),
(92, 22, 'Putat Jaya', NULL),
(93, 22, 'Sawahan', NULL),
(94, 23, 'Ampel', NULL),
(95, 23, 'Pegirian', NULL),
(96, 23, 'Sidotopo', NULL),
(97, 23, 'Ujung', NULL),
(98, 23, 'Wonokusumo', NULL),
(99, 24, 'Kapasan', NULL),
(100, 24, 'Sidodadi', NULL),
(101, 24, 'Simokerto', NULL),
(102, 24, 'Simolawang', NULL),
(103, 24, 'Tambakrejo', NULL),
(104, 25, 'Gebang Putih', NULL),
(105, 25, 'Keputih', NULL),
(106, 25, 'Klampingasem', NULL),
(107, 25, 'Medokan Semampir', NULL),
(108, 25, 'Menur Pumpungan', NULL),
(109, 25, 'Nginden Jangkungan', NULL),
(110, 25, 'Semolowaru', NULL),
(111, 26, 'Putatgede', NULL),
(112, 26, 'Simomulyo', NULL),
(113, 26, 'Simomulyo Baru', NULL),
(114, 26, 'Sonokwijenan', NULL),
(115, 26, 'Sokomanunggal', NULL),
(116, 26, 'Tanjungsari', NULL),
(117, 27, 'Dukuh Setro', NULL),
(118, 27, 'Gading', NULL),
(119, 27, 'Kapas Madya', NULL),
(120, 27, 'Pacar Kembang', NULL),
(121, 27, 'Pacar Keling', NULL),
(122, 27, 'Ploso', NULL),
(123, 27, 'Rangkah', NULL),
(124, 27, 'Tambaksari', NULL),
(125, 28, 'Balongsari', NULL),
(126, 28, 'Banjar Sugihan', NULL),
(127, 28, 'Karang Poh', NULL),
(128, 28, 'Manukan Kulon', NULL),
(129, 28, 'Manukan Wetan', NULL),
(130, 28, 'Tandes', NULL),
(131, 29, 'Dr. Sutomo', NULL),
(132, 29, 'Kedungdoro', NULL),
(133, 29, 'Keputran', NULL),
(134, 29, 'Tegalsari', NULL),
(135, 29, 'Wonorejo', NULL),
(136, 30, 'Kendangsari', NULL),
(137, 30, 'Kutisari', NULL),
(138, 30, 'Panjang Jiwo', NULL),
(139, 30, 'Tenggilis Mejoyo', NULL),
(140, 31, 'Babatan', NULL),
(141, 31, 'Balasklumprik', NULL),
(142, 31, 'Jajar Tunggal', NULL),
(143, 31, 'Wiyung', NULL),
(144, 32, 'Bendul Merisi', NULL),
(145, 32, 'Jemur Wonosari', NULL),
(146, 32, 'Margorejo', NULL),
(147, 32, 'Sidosermo', NULL),
(148, 32, 'Siwalan Kerto', NULL),
(149, 33, 'Darmo', NULL),
(150, 33, 'Jagir', NULL),
(151, 33, 'Ngagel', NULL),
(152, 33, 'Ngagelrejo', NULL),
(153, 33, 'Sawunggaling', NULL),
(154, 33, 'Wonokromo', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kode_verifikasi`
--

CREATE TABLE `kode_verifikasi` (
  `id` int(11) NOT NULL,
  `kode` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kode_verifikasi`
--

INSERT INTO `kode_verifikasi` (`id`, `kode`) VALUES
(1, 'hapus_data');

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `id` int(4) NOT NULL,
  `name` varchar(100) NOT NULL,
  `jenis-kelamin` varchar(100) NOT NULL,
  `rt` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test`
--

INSERT INTO `test` (`id`, `name`, `jenis-kelamin`, `rt`) VALUES
(1, 'Ammar Hawari', 'Perempuan', 22),
(2, 'Ammar Hawari asd', 'Laki-laki', 20);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--
-- Error reading structure for table bawaslu.user: #1932 - Table &#039;bawaslu.user&#039; doesn&#039;t exist in engine
-- Error reading data for table bawaslu.user: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `bawaslu`.`user`&#039; at line 1

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `desa`
--
ALTER TABLE `desa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kecamatan_id` (`kecamatan_id`);

--
-- Indexes for table `kode_verifikasi`
--
ALTER TABLE `kode_verifikasi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `desa`
--
ALTER TABLE `desa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT for table `kode_verifikasi`
--
ALTER TABLE `kode_verifikasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `test`
--
ALTER TABLE `test`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `desa`
--
ALTER TABLE `desa`
  ADD CONSTRAINT `desa_ibfk_1` FOREIGN KEY (`kecamatan_id`) REFERENCES `data` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
