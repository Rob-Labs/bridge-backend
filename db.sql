SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bridge_transaction
-- ----------------------------
DROP TABLE IF EXISTS `bridge_transaction`;
CREATE TABLE `bridge_transaction`  (
  `fromChainId` int(11) UNSIGNED NOT NULL,
  `txhash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nonce` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `from` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fromToken` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `toChainId` int(11) UNSIGNED NOT NULL,
  `toToken` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL,
  `is_queued` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `toTxHash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_mined` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `bull_job_id` int(255) UNSIGNED NULL DEFAULT NULL,
  `bull_job_status` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`fromChainId`, `txhash`) USING BTREE,
  INDEX `from`(`from`) USING BTREE,
  INDEX `fromToken`(`fromToken`) USING BTREE,
  INDEX `to`(`to`) USING BTREE,
  INDEX `toChainId`(`toChainId`) USING BTREE,
  INDEX `toToken`(`toToken`) USING BTREE,
  INDEX `bull_job_id`(`bull_job_id`) USING BTREE,
  INDEX `bull_job_status`(`bull_job_status`) USING BTREE
) ENGINE = MyISAM CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
