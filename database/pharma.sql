-- MariaDB dump 10.19  Distrib 10.9.3-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: pharma
-- ------------------------------------------------------
-- Server version	11.0.3-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_auth`
--

DROP TABLE IF EXISTS `admin_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_auth` (
  `username` varchar(20) NOT NULL,
  `password` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_auth`
--

LOCK TABLES `admin_auth` WRITE;
/*!40000 ALTER TABLE `admin_auth` DISABLE KEYS */;
INSERT INTO `admin_auth` VALUES
('Kamal','aaa');
/*!40000 ALTER TABLE `admin_auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assigned_doc`
--

DROP TABLE IF EXISTS `assigned_doc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assigned_doc` (
  `pat_id` int(11) NOT NULL,
  `doc_id` int(11) NOT NULL,
  KEY `pat_id` (`pat_id`),
  KEY `doc_id` (`doc_id`),
  CONSTRAINT `assigned_doc_ibfk_1` FOREIGN KEY (`pat_id`) REFERENCES `patient` (`pat_id`),
  CONSTRAINT `assigned_doc_ibfk_2` FOREIGN KEY (`doc_id`) REFERENCES `doctor` (`doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_doc`
--

LOCK TABLES `assigned_doc` WRITE;
/*!40000 ALTER TABLE `assigned_doc` DISABLE KEYS */;
INSERT INTO `assigned_doc` VALUES
(12,1);
/*!40000 ALTER TABLE `assigned_doc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctor` (
  `doc_id` int(11) NOT NULL,
  `doc_name` varchar(30) NOT NULL,
  `doc_spec` varchar(30) NOT NULL,
  `doc_exp` int(11) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `email` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`doc_id`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`doc_id`) REFERENCES `doctor_auth` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES
(1,'Kamal','Audiologist',30,NULL,NULL),
(44,'adf','afjlksd',84,23,'ka@ma'),
(55,'kk','kkj',12,23,'lklk@lk'),
(76,'afdd','dafkfj',33,42,'adf@kd'),
(77,'lalala','Organ trafficking',12,13,'la@la'),
(981,'Lamal Suresh',':-)',23,50,'lamal@nomail.com'),
(987,'Kamak','--',20,40,'kamak@kmail.com');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_auth`
--

DROP TABLE IF EXISTS `doctor_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctor_auth` (
  `password` varchar(20) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_auth`
--

LOCK TABLES `doctor_auth` WRITE;
/*!40000 ALTER TABLE `doctor_auth` DISABLE KEYS */;
INSERT INTO `doctor_auth` VALUES
('aaa',981),
('123',981),
('123',987),
('123',1),
('aaa',44),
('aaa',77),
('aaa',76),
('aaa',55);
/*!40000 ALTER TABLE `doctor_auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meds`
--

DROP TABLE IF EXISTS `meds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meds` (
  `presc_id` int(11) NOT NULL,
  `presc_name` varchar(20) NOT NULL,
  PRIMARY KEY (`presc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meds`
--

LOCK TABLES `meds` WRITE;
/*!40000 ALTER TABLE `meds` DISABLE KEYS */;
INSERT INTO `meds` VALUES
(22,'paracetamol'),
(307,'Dolo');
/*!40000 ALTER TABLE `meds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patient` (
  `pat_id` int(11) NOT NULL,
  `pat_name` varchar(30) NOT NULL,
  `pat_age` int(11) DEFAULT NULL,
  `pat_sex` varchar(10) NOT NULL,
  PRIMARY KEY (`pat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES
(12,'Not Kamal',5,'Male'),
(13,'ad',3,'M');
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharma_auth`
--

DROP TABLE IF EXISTS `pharma_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pharma_auth` (
  `username` varchar(30) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharma_auth`
--

LOCK TABLES `pharma_auth` WRITE;
/*!40000 ALTER TABLE `pharma_auth` DISABLE KEYS */;
INSERT INTO `pharma_auth` VALUES
('kamal','123'),
('PH102','123'),
('3','ww'),
('55','aaa');
/*!40000 ALTER TABLE `pharma_auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmasist`
--

DROP TABLE IF EXISTS `pharmasist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pharmasist` (
  `pharma_id` varchar(20) DEFAULT NULL,
  `pharma_name` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmasist`
--

LOCK TABLES `pharmasist` WRITE;
/*!40000 ALTER TABLE `pharmasist` DISABLE KEYS */;
INSERT INTO `pharmasist` VALUES
('kamal','123'),
('PH102','LAMAL'),
('3','dfaf'),
('55','kk');
/*!40000 ALTER TABLE `pharmasist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `pharmasist_view`
--

DROP TABLE IF EXISTS `pharmasist_view`;
/*!50001 DROP VIEW IF EXISTS `pharmasist_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `pharmasist_view` AS SELECT
 1 AS `pat_id`,
  1 AS `pat_name`,
  1 AS `pat_sex`,
  1 AS `pat_age`,
  1 AS `doc_id`,
  1 AS `presc_id`,
  1 AS `presc_name`,
  1 AS `presc_date`,
  1 AS `prescribed`,
  1 AS `amount` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prescription` (
  `presc_id` int(11) NOT NULL,
  `doc_id` int(11) NOT NULL,
  `pat_id` int(11) NOT NULL,
  `presc_date` varchar(20) NOT NULL,
  `amount` int(11) NOT NULL,
  `prescribed` int(11) NOT NULL,
  KEY `doc_id` (`doc_id`),
  KEY `pat_id` (`pat_id`),
  CONSTRAINT `prescription_ibfk_1` FOREIGN KEY (`doc_id`) REFERENCES `doctor` (`doc_id`),
  CONSTRAINT `prescription_ibfk_2` FOREIGN KEY (`pat_id`) REFERENCES `patient` (`pat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription`
--

LOCK TABLES `prescription` WRITE;
/*!40000 ALTER TABLE `prescription` DISABLE KEYS */;
INSERT INTO `prescription` VALUES
(22,1,12,'2023/12/12',12,1);
/*!40000 ALTER TABLE `prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `pharmasist_view`
--

/*!50001 DROP VIEW IF EXISTS `pharmasist_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `pharmasist_view` AS select `p`.`pat_id` AS `pat_id`,`p`.`pat_name` AS `pat_name`,`p`.`pat_sex` AS `pat_sex`,`p`.`pat_age` AS `pat_age`,`pr`.`doc_id` AS `doc_id`,`pr`.`presc_id` AS `presc_id`,`m`.`presc_name` AS `presc_name`,`pr`.`presc_date` AS `presc_date`,`pr`.`prescribed` AS `prescribed`,`pr`.`amount` AS `amount` from ((`patient` `p` join `prescription` `pr` on(`p`.`pat_id` = `pr`.`pat_id`)) join `meds` `m` on(`pr`.`presc_id` = `m`.`presc_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-16  6:36:07
