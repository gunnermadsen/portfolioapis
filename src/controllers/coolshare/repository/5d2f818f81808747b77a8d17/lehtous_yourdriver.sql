-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 12, 2018 at 11:52 PM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 7.1.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lehtous_yourdriver`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(7) NOT NULL,
  `user_id` int(3) NOT NULL COMMENT 'user_id foreign key to Users table',
  `origin` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `waypoint0` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `waypoint1` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `waypoint2` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `destination` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `distance` decimal(6,2) NOT NULL,
  `duration` varchar(8) COLLATE utf8_unicode_ci NOT NULL,
  `driverCost` decimal(8,2) NOT NULL,
  `originAirport` varchar(60) COLLATE utf8_unicode_ci NOT NULL DEFAULT ' NOT NULL',
  `destinationAirport` varchar(60) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'NOT NULL',
  `creationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='user route data';

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `origin`, `waypoint0`, `waypoint1`, `waypoint2`, `destination`, `distance`, `duration`, `driverCost`, `originAirport`, `destinationAirport`, `creationDate`) VALUES
(104110, 1, 'Seattle, WA, USA', 'Billings, MT, USA', 'N/A', 'N/A', 'Denver, CO, USA', '1371.00', '20:16:35', '1261.32', '', '', '2018-06-25 04:46:49'),
(104111, 2, 'Seattle, WA, USA', 'NA', 'NA', 'NA', 'Denver, CO, USA', '1337.21', '19:54:45', '1251.23', 'Seattle-Tacoma International Airport', 'Denver International Airport', '2018-06-30 00:29:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(3) NOT NULL COMMENT 'auto incrementing user_id of each user, unique index',
  `isAdmin` int(1) NOT NULL COMMENT 'user or admin',
  `firstName` char(16) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user''s firstname, unique',
  `lastName` char(16) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user''s lastname, unique',
  `userName` char(16) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user''s username, unique',
  `eMail` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user''s email, unique',
  `userPassword` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user&#039;s password in salted and hashed format',
  `userIP` varchar(32) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Users ip address upon registration',
  `userActivationHash` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Users activation code in salted format',
  `creationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastLoginDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='user data';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `isAdmin`, `firstName`, `lastName`, `userName`, `eMail`, `userPassword`, `userIP`, `userActivationHash`, `creationDate`, `lastLoginDate`) VALUES
(1, 2, 'doug', 'jones', 'djones', 'd.jones@gmail.com', '$2y$10$Z/cu6AcjqDNqbTUvWMbbGuX.J1H42WdkyoflGnwrd4OKVktlrzeze', '::1', '', '2018-06-25 04:44:01', '2018-10-11'),
(2, 1, 'firstName', 'lastName', 'userName', 'eMail', '$2y$10$ujz7FEH/jVVKlxRNnjUQfeM9UsQIsQD4zSINIP6qfhsSG1f5xLW8W', '::1', '', '2018-06-25 05:14:11', '0000-00-00'),
(3, 1, 'Neil', 'Lehto', 'neillehto', 'neillehto@gmail.com', '$2y$10$oL2QQQSzwK8SvlEMK2v2uuuCVmkj6zxt/dQLPCYYgHAb6vbQZkhIS', '::1', '', '2018-07-20 20:14:45', '2018-10-12'),
(4, 1, 'Sean', 'Pittman', 'seanpittman', 'seanpittman@yahoo.com', '$2y$10$xFjFvlIQ4H700FOl4flsl..0ntejuEFGJOk5lFIk0MI.1DYW5sQ0m', '::1', '', '2018-08-12 07:48:59', '0000-00-00'),
(5, 1, 'Jessica', 'Long', 'jlong', 'jlong@gmail.com', '$2y$10$DJM0qASvxSj4gn4Q7E0q6eoncloRb.mA4SO5EHe3jiAb/t5zM6FL2', '::1', '', '2018-09-11 02:27:14', '0000-00-00'),
(6, 1, 'Jennifer', 'Bailey', 'jBailey', 'jbailey@gmail.com', '$2y$10$C7qaLALbuxA0VYIInA2HwOctedXX26JiBV0qdtHkOsGqAztxzKpNi', '::1', '', '2018-09-11 02:30:07', '0000-00-00'),
(7, 1, 'Riley', 'Madsen', 'rmadsen', 'rmadsen@outlook.com', '$2y$10$/fzdbJI7FYkDlxrS6QuAVOHSp/RzhJQVmUY7UQn9.IXL0gCe1qOIK', '::1', '', '2018-09-11 02:35:02', '0000-00-00'),
(8, 1, 'John', 'Madsen', 'jmadsen', 'john.madsen@outlook.com', '$2y$10$7ynxcLO9kPdXxWRUS9YTnOHHKyV.euc6zsZ/aeD4sLa3G.hgb2Qrq', '::1', '', '2018-09-11 07:04:15', '0000-00-00'),
(9, 1, 'Marjorie', 'Madsen', 'mmadsen', 'margie.madsen@outlook.com', '$2y$10$CMEGzorCxwHHd8siZ/5O1O4CKbWs2D3ghVCSD0c6jx77RfzEQ/uVa', '::1', '', '2018-09-11 07:06:33', '0000-00-00'),
(10, 1, 'James', 'John', 'jjohn', 'james.john@gmail.com', '$2y$10$qVbA4e3MNSB8juOi4Yh5xuccD.LZA1UK4xr3P1IveHVDoFYJI2xDy', '::1', '', '2018-09-11 07:18:25', '0000-00-00'),
(11, 1, 'Spider', 'Man', 'spider', 'spider.man@gmail.com', '$2y$10$81xaWjhgHkgg61VY/JpwLuv1YVO26BADNTvm3Px/WAOt30xCa6/9G', '::1', '', '2018-09-11 07:28:22', '0000-00-00'),
(12, 1, '%bat', '^&man', 'batman', '<script>%%batmanoutloo.kcom</script>', '$2y$10$ikYD4xzXvXSU6tMCPDmA8ucQnph6wuNOuTVazFU00ZmzDQWPkddLa', '::1', '', '2018-09-12 18:10:48', '0000-00-00'),
(13, 1, 'Iron', 'Man', 'ironman', 'ironman@avengers.com', '$2y$10$tzc0wDS8dr9M5RcU5C1BL.HQW/8a46sgu0OYFj.x.unfPbXRzJKR6', '::1', '', '2018-09-15 21:53:14', '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `info_id` int(3) NOT NULL,
  `user_id` int(3) DEFAULT NULL COMMENT 'user_id foreign key to Users table',
  `address` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` char(16) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'user&amp;#039;s city, unique',
  `phone` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'user&amp;amp;#039;s city, unique',
  `state` char(2) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'user&amp;#039;s state, unique',
  `country` char(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'user&amp;#039;s state, unique',
  `zip` decimal(5,0) DEFAULT NULL COMMENT 'user&amp;#039;s state, unique'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='user info data';

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`info_id`, `user_id`, `address`, `city`, `phone`, `state`, `country`, `zip`) VALUES
(1, 1, '38898 N Park ave', 'Portland', '509-905-9905', 'ME', 'United States', '98101'),
(2, 2, 'address', 'city', 'phone', 'st', 'United States', '0'),
(3, 3, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 6, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 7, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 8, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 9, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 10, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 11, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 12, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 13, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `userName` (`userName`),
  ADD UNIQUE KEY `eMail` (`eMail`),
  ADD UNIQUE KEY `userPassword` (`userPassword`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`info_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104112;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(3) NOT NULL AUTO_INCREMENT COMMENT 'auto incrementing user_id of each user, unique index', AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `info_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `user_info`
--
ALTER TABLE `user_info`
  ADD CONSTRAINT `User_Info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
