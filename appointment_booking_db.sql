-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2026 at 05:22 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appointment_booking_db`
--
CREATE DATABASE IF NOT EXISTS `appointment_booking_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `appointment_booking_db`;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` char(36) NOT NULL,
  `slot_id` char(36) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'CONFIRMED',
  `cancellation_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_09_05_000002_create_slots_table', 1),
(5, '2026_09_05_000003_create_appointments_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('mQNmFHvfyroqMBdVJMXNyDWqrqQoDBLtsThFOHaA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSTQ1RWxGRjhjTktOQ2hVTExrRENLdFNaaTZPRVk5WHdoSWdTaDlNZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1788621192);

-- --------------------------------------------------------

--
-- Table structure for table `slots`
--

CREATE TABLE `slots` (
  `id` char(36) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'AVAILABLE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `slots`
--

INSERT INTO `slots` (`id`, `start_time`, `end_time`, `status`, `created_at`, `updated_at`) VALUES
('0708078d-c100-45bc-8c73-287678225562', '2026-09-07 15:00:00', '2026-09-07 16:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('08bf858b-90cb-480e-bd2a-4e9ca5c6da7c', '2026-09-06 11:00:00', '2026-09-06 12:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('0a8f6d6c-35df-4d4a-8c6e-639769644509', '2026-09-05 10:00:00', '2026-09-05 11:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('0d06fd3f-9c39-4f47-a2c0-dd163938228b', '2026-09-07 16:00:00', '2026-09-07 17:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('1184b369-9f4f-4c95-9e8b-91e45edd8193', '2026-09-05 09:00:00', '2026-09-05 10:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('1324fd88-4ff0-4dd4-872f-6e2e578067e8', '2026-09-10 14:00:00', '2026-09-10 15:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('1ac19cbc-e81f-4c2f-a7df-f3a5e184aa6f', '2026-09-09 13:00:00', '2026-09-09 14:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('1e7fd2c2-479b-4553-bac8-20054894857c', '2026-09-08 11:00:00', '2026-09-08 12:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('23442291-98e0-41d5-bf13-8f1571f29404', '2026-09-11 09:00:00', '2026-09-11 10:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('23eab356-8042-4cb6-9f8f-acea19edbdd8', '2026-09-08 14:00:00', '2026-09-08 15:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('2ca32f3e-b17e-4140-82e8-9c2551939689', '2026-09-08 12:00:00', '2026-09-08 13:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('2f6e4be8-2c0a-416a-b114-5182babd3bda', '2026-09-05 15:00:00', '2026-09-05 16:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('3237fa9b-89b7-4ed0-b2da-4a97bfe95d4c', '2026-09-11 15:00:00', '2026-09-11 16:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('333017c7-bbd0-4fcd-8a7b-74d740da79b9', '2026-09-06 15:00:00', '2026-09-06 16:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('34986f41-fcb5-4b9f-85a0-89b5556fd09d', '2026-09-07 11:00:00', '2026-09-07 12:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('362afdec-ad34-4849-be39-f05b6872e90e', '2026-09-05 13:00:00', '2026-09-05 14:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('39fbb92f-08d4-45d1-ae1f-399c4e0bcb79', '2026-09-05 14:00:00', '2026-09-05 15:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('3b0ca6a7-f05e-4315-a1a9-a83b5201de69', '2026-09-10 13:00:00', '2026-09-10 14:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('3d7e89ce-e8d7-4e8d-8b30-e1750af6ec88', '2026-09-10 12:00:00', '2026-09-10 13:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('3ef393c0-c91d-4f63-8b88-d986c09c3a90', '2026-09-09 11:00:00', '2026-09-09 12:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('42380a10-7a90-4614-97f6-4db73e2befde', '2026-09-08 09:00:00', '2026-09-08 10:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('52b0df04-9fe3-47a9-a1bb-c3807f8fb3bc', '2026-09-11 11:00:00', '2026-09-11 12:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('546c72c9-8ddd-4373-9762-642a9182fbdd', '2026-09-11 10:00:00', '2026-09-11 11:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('59f5e89b-422a-43e5-a423-72c0e5291ce6', '2026-09-09 14:00:00', '2026-09-09 15:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('5a5649ef-bcdf-4ba7-8ec0-14a5b0fc970c', '2026-09-08 16:00:00', '2026-09-08 17:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('7354b9b4-4b8a-425a-8b94-07550f9e9af7', '2026-09-11 13:00:00', '2026-09-11 14:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('831ec34f-c505-424c-b113-0a60afa78a40', '2026-09-06 10:00:00', '2026-09-06 11:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('83da01ab-ef56-449d-a472-5de704641256', '2026-09-11 16:00:00', '2026-09-11 17:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('9002c3d9-9786-4b40-9e11-d1b4c3f0a763', '2026-09-07 14:00:00', '2026-09-07 15:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('920cfb53-db37-44ed-9cdf-6bcc13f24973', '2026-09-09 15:00:00', '2026-09-09 16:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('9b196d69-1bfe-415a-a032-f69bec2e6731', '2026-09-05 12:00:00', '2026-09-05 13:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('9cd18b86-bbcd-4202-a61e-6951ed768ffa', '2026-09-09 16:00:00', '2026-09-09 17:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('9e9c91ce-095a-4158-8281-dc8ad8fdfa1d', '2026-09-10 11:00:00', '2026-09-10 12:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('9f3a8aa6-7cfa-4649-9ddb-27785d710aa8', '2026-09-07 12:00:00', '2026-09-07 13:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('a0f9d8a4-091e-466c-803a-60db354651e5', '2026-09-05 11:00:00', '2026-09-05 12:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('a107c072-7361-49b3-bbe6-18e0add979af', '2026-09-09 09:00:00', '2026-09-09 10:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('a1c6d494-d8e4-487a-a27b-4e5f7462f39e', '2026-09-11 12:00:00', '2026-09-11 13:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('a20b6ad0-2f3b-4583-a840-5012ee88b45c', '2026-09-10 15:00:00', '2026-09-10 16:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('a60fb4b4-7f2d-44c6-b2ba-f87192a18b4e', '2026-09-08 15:00:00', '2026-09-08 16:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('acfa9565-1b84-4150-bf5d-d23f78a0dc47', '2026-09-06 16:00:00', '2026-09-06 17:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('bb56cb51-ff74-44cc-b7f8-0c65f5f7950e', '2026-09-06 14:00:00', '2026-09-06 15:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('bcdf1452-8a2f-4814-be50-006ecd8301c6', '2026-09-07 13:00:00', '2026-09-07 14:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('bdd3cb27-34b8-46fc-b569-afdaa351f86b', '2026-09-06 09:00:00', '2026-09-06 10:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('c2785c84-ebe3-4a84-91fb-9dd50c70f7d6', '2026-09-10 10:00:00', '2026-09-10 11:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('d28bd3e9-8084-4766-93e1-63a15bf9716d', '2026-09-09 10:00:00', '2026-09-09 11:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('d3a49a7f-e0d7-4ec4-8a4e-2dfe485f244a', '2026-09-10 16:00:00', '2026-09-10 17:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('df796d45-7880-4855-b99b-e80a6879f5c2', '2026-09-08 13:00:00', '2026-09-08 14:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('e27264a1-98ec-47f1-8378-4a3ed43f22f9', '2026-09-06 12:00:00', '2026-09-06 13:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('e812d161-3bce-41e1-9ce3-e86f1cda5244', '2026-09-09 12:00:00', '2026-09-09 13:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('ea0235bb-a0a5-4825-9e0d-adca15a2fe52', '2026-09-07 10:00:00', '2026-09-07 11:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('ea884760-f20c-47e5-91d6-b51366ea51ee', '2026-09-11 14:00:00', '2026-09-11 15:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('ecf3d192-48bc-4391-87e1-94b4f968bafc', '2026-09-10 09:00:00', '2026-09-10 10:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('ee0a4236-a590-4777-b6f2-ad6e00dd92a2', '2026-09-05 16:00:00', '2026-09-05 17:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('ee528c56-f6b2-402d-ab08-587369ed9783', '2026-09-08 10:00:00', '2026-09-08 11:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('f02eea5b-1c14-49c3-9ef9-15f3c24329b4', '2026-09-06 13:00:00', '2026-09-06 14:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55'),
('fbb4a34e-bb43-40c5-820e-d93e4cdeff10', '2026-09-07 09:00:00', '2026-09-07 10:00:00', 'AVAILABLE', '2026-09-05 08:48:55', '2026-09-05 08:48:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointments_user_id_foreign` (`user_id`),
  ADD KEY `appointments_slot_id_index` (`slot_id`),
  ADD KEY `appointments_status_index` (`status`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `slots`
--
ALTER TABLE `slots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `slots_start_time_index` (`start_time`),
  ADD KEY `slots_status_index` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_slot_id_foreign` FOREIGN KEY (`slot_id`) REFERENCES `slots` (`id`),
  ADD CONSTRAINT `appointments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;
