-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 22, 2020 at 05:51 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ajency-films`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `catid` int(3) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `value` varchar(30) NOT NULL,
  PRIMARY KEY (`catid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`catid`, `type`, `value`) VALUES
(1, 'language', 'english'),
(2, 'genre', 'science-fiction'),
(3, 'language', 'hindi'),
(4, 'genre', 'horror'),
(5, 'genre', 'drama');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE IF NOT EXISTS `movies` (
  `movieid` int(3) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL COMMENT 'description',
  `description` varchar(50) NOT NULL,
  `image` blob NOT NULL COMMENT 'mlength',
  `mlength` decimal(3,2) NOT NULL COMMENT 'releasedt',
  `releasedt` varchar(10) NOT NULL,
  PRIMARY KEY (`movieid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`movieid`, `title`, `description`, `image`, `mlength`, `releasedt`) VALUES
(1, 'English Vinglish', 'hindi movie', 0x456e676c6973682056696e676c69736820323031322048445269702e6a7067, '2.07', '2012-10-05'),
(2, 'Jurasic Park', 'English', 0x6a7572617369637061726b2e6a7067, '2.14', '1993-06-11'),
(3, '3 Idiots', 'hindi movie', 0x74687265656964696f74732e6a7067, '2.50', '2009-12-25'),
(4, 'Inside Out', 'English', 0x696e736964656f75742e6a7067, '1.35', '2015-05-19'),
(5, 'Insidious', 'Insidious', 0x696e736964696f75732e6a7067, '1.35', '2013-03-01'),
(6, 'Queen', 'hindi movie', 0x717565656e2e6a7067, '2.26', '2014-03-07'),
(7, 'Singham', 'hindi movie', 0x73696e6768616d2e6a7067, '2.40', '2010-05-28'),
(8, 'Now You See Me', 'English', 0x6e6f77796f7573656d652e6a7067, '1.55', '2013-05-31'),
(9, 'Bhool Bhulaiya', 'hindi movie', 0x62686f6f6c6268756c616979612e6a7067, '2.39', '2007-10-12');

-- --------------------------------------------------------

--
-- Table structure for table `relationship`
--

CREATE TABLE IF NOT EXISTS `relationship` (
  `relid` int(3) NOT NULL AUTO_INCREMENT,
  `catid` int(3) NOT NULL,
  `movieid` int(3) NOT NULL,
  PRIMARY KEY (`relid`),
  KEY `fk_movieid` (`movieid`),
  KEY `fk_catid` (`catid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `relationship`
--

INSERT INTO `relationship` (`relid`, `catid`, `movieid`) VALUES
(1, 3, 1),
(2, 5, 1),
(3, 1, 2),
(4, 2, 2),
(5, 3, 3),
(6, 5, 3),
(7, 1, 4),
(8, 5, 4),
(9, 1, 5),
(10, 4, 5),
(11, 3, 6),
(12, 5, 6),
(13, 3, 7),
(14, 5, 7),
(15, 1, 8),
(16, 5, 8),
(17, 1, 9),
(18, 4, 9);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `relationship`
--
ALTER TABLE `relationship`
  ADD CONSTRAINT `fk_catid` FOREIGN KEY (`catid`) REFERENCES `category` (`catid`),
  ADD CONSTRAINT `fk_movieid` FOREIGN KEY (`movieid`) REFERENCES `movies` (`movieid`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
