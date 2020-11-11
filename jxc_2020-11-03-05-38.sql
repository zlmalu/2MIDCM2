-- ----------------------------
-- Table structure for `t_Area`
-- ----------------------------

DROP TABLE IF EXISTS `t_Area`;

CREATE TABLE `t_Area` (
  `PK_Area_ID` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `Name` varchar(32) DEFAULT NULL COMMENT '地区名称',
  `Level` tinyint(4) DEFAULT '0' COMMENT '地区等级 分省市县区',
  `UpArea_ID` int(10) DEFAULT NULL COMMENT '父id',
  PRIMARY KEY (`PK_Area_ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=47549 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_Area`
-- ----------------------------

INSERT INTO `t_Area` VALUES ('47545', '广东', '1', '0');
INSERT INTO `t_Area` VALUES ('47546', '广州', '2', '47545');
INSERT INTO `t_Area` VALUES ('47547', '天河', '3', '47546');
INSERT INTO `t_Area` VALUES ('47548', '棠下', '4', '47547');

-- ----------------------------
-- Table structure for `t_BOM_Base`
-- ----------------------------

DROP TABLE IF EXISTS `t_BOM_Base`;

CREATE TABLE `t_BOM_Base` (
  `PK_BOM_ID` int(11) unsigned NOT NULL COMMENT 'BOM编号AAA+BBB+xxxxx',
  `Name` varchar(50) DEFAULT NULL COMMENT '名称',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `MT_ID` smallint(3) unsigned NOT NULL COMMENT '物料模板ID',
  `BOMCat_ID1` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '类别1',
  `Amount` decimal(11,3) NOT NULL DEFAULT '0.000' COMMENT '数量',
  `Attr` varchar(120) DEFAULT NULL COMMENT '规格属性描述：A0|A1|A2|...|Ax，x不大于20，数据适度冗余',
  `Attr0` varchar(20) DEFAULT NULL COMMENT '属性0',
  `Attr1` varchar(20) DEFAULT NULL COMMENT '属性1',
  `Attr2` varchar(20) DEFAULT NULL,
  `Attr3` varchar(20) DEFAULT NULL,
  `Attr4` varchar(20) DEFAULT NULL,
  `Attr5` varchar(20) DEFAULT NULL,
  `Attr6` varchar(20) DEFAULT NULL,
  `Attr7` varchar(20) DEFAULT NULL,
  `Attr8` varchar(20) DEFAULT NULL,
  `Attr9` varchar(20) DEFAULT NULL,
  `Attr10` varchar(20) DEFAULT NULL,
  `Attr11` varchar(20) DEFAULT NULL,
  `Attr12` varchar(20) DEFAULT NULL,
  `Attr13` varchar(20) DEFAULT NULL,
  `Attr14` varchar(20) DEFAULT NULL,
  `Attr15` varchar(20) DEFAULT NULL,
  `Attr16` varchar(20) DEFAULT NULL,
  `Attr17` varchar(20) DEFAULT NULL,
  `Attr18` varchar(20) DEFAULT NULL,
  `Attr19` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`PK_BOM_ID`) USING BTREE,
  KEY `BOMCat_ID1` (`BOMCat_ID1`) USING BTREE,
  KEY `FK_MT_ID` (`MT_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='物料基本表';

-- ----------------------------
-- Data for the table `t_BOM_Base`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_BOM_Category1`
-- ----------------------------

DROP TABLE IF EXISTS `t_BOM_Category1`;

CREATE TABLE `t_BOM_Category1` (
  `PK_BOMCat_ID1` tinyint(3) unsigned NOT NULL COMMENT '类别编码BOM种类基础表 0,商品1,产成品:2,半成品3,原料4,低值或易耗品',
  `Name` varchar(20) DEFAULT NULL COMMENT 'BOM类别名称',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`PK_BOMCat_ID1`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_BOM_Category1`
-- ----------------------------

INSERT INTO `t_BOM_Category1` VALUES ('0', '商品', '');
INSERT INTO `t_BOM_Category1` VALUES ('1', '产成品', '');
INSERT INTO `t_BOM_Category1` VALUES ('2', '半成品', '');
INSERT INTO `t_BOM_Category1` VALUES ('3', '原料', '');
INSERT INTO `t_BOM_Category1` VALUES ('4', '低值或易耗品', '');

-- ----------------------------
-- Table structure for `t_BOM_Category2`
-- ----------------------------

DROP TABLE IF EXISTS `t_BOM_Category2`;

CREATE TABLE `t_BOM_Category2` (
  `PK_BOMCat_ID2` smallint(3) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户自定义类别',
  `Name` varchar(20) DEFAULT NULL COMMENT '名称，如底层板、立柱等',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `Level` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '类别层次，不建议超过三层',
  `Up_Cat2` smallint(3) unsigned NOT NULL DEFAULT '0' COMMENT '上位层次',
  PRIMARY KEY (`PK_BOMCat_ID2`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=123 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Data for the table `t_BOM_Category2`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_BOM_Stock`
-- ----------------------------

DROP TABLE IF EXISTS `t_BOM_Stock`;

CREATE TABLE `t_BOM_Stock` (
  `Stock_ID` smallint(4) unsigned NOT NULL COMMENT '仓库编号',
  `BOM_ID` int(11) unsigned NOT NULL COMMENT '物料编号',
  `Desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `Amount` decimal(11,3) NOT NULL DEFAULT '0.000' COMMENT '库存量',
  `MInAmount` decimal(11,3) NOT NULL DEFAULT '0.000' COMMENT '最低库存量',
  `Cost` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '成本',
  `CostType` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '成本计算方式,1移动加权平均,2FIFO,3LIFO',
  PRIMARY KEY (`Stock_ID`,`BOM_ID`) USING BTREE,
  KEY `FK_BOM_ID` (`BOM_ID`) USING BTREE,
  KEY `Stock_ID` (`Stock_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='BOM库存表';

-- ----------------------------
-- Data for the table `t_BOM_Stock`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_BetweenUnit`
-- ----------------------------

DROP TABLE IF EXISTS `t_BetweenUnit`;

CREATE TABLE `t_BetweenUnit` (
  `PK_BU_ID` mediumint(6) unsigned NOT NULL AUTO_INCREMENT COMMENT '往来单位编号',
  `Name` varchar(50) DEFAULT NULL COMMENT '单位名称',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `Area_ID` mediumint(6) unsigned NOT NULL COMMENT '地区编号',
  `BU_Cat` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '类别: 1客户,2厂家,4第三方,可叠加',
  `Industry_ID` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '所属行业，0，其它',
  `Taxrate` decimal(6,3) NOT NULL DEFAULT '0.000' COMMENT '税率',
  `Linkmans` varchar(200) DEFAULT NULL COMMENT '客户联系方式',
  `Status` tinyint(1) DEFAULT '1' COMMENT '状态：0不正常，1正常',
  PRIMARY KEY (`PK_BU_ID`) USING BTREE,
  KEY `FK_Area_ID` (`Area_ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_BetweenUnit`
-- ----------------------------

INSERT INTO `t_BetweenUnit` VALUES ('1', 'zabbix', '44', '47548', '1', '26', '23.000', '[{"linkPhone":"13006878503"}]', '1');
INSERT INTO `t_BetweenUnit` VALUES ('2', 'dd', '44', '47548', '1', '26', '54.000', '[{"linkPhone":"18312716350"}]', '1');

-- ----------------------------
-- Table structure for `t_Department`
-- ----------------------------

DROP TABLE IF EXISTS `t_Department`;

CREATE TABLE `t_Department` (
  `PK_Dept_ID` smallint(4) unsigned NOT NULL AUTO_INCREMENT COMMENT '部门编号',
  `Name` varchar(50) DEFAULT NULL COMMENT '部门名称',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `Head_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '负责人',
  `Status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：0不正常，1正常',
  `UpDept_ID` smallint(4) NOT NULL DEFAULT '1' COMMENT '上级部门',
  PRIMARY KEY (`PK_Dept_ID`) USING BTREE,
  KEY `FK_Head_ID` (`Head_ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_Department`
-- ----------------------------

INSERT INTO `t_Department` VALUES ('46', '事业部11', 'SYB', '0', '1', '0');
INSERT INTO `t_Department` VALUES ('47', '后勤部', 'HQB', '0', '1', '0');
INSERT INTO `t_Department` VALUES ('49', '总经理', '', '0', '1', '0');

-- ----------------------------
-- Table structure for `t_Logbook`
-- ----------------------------

DROP TABLE IF EXISTS `t_Logbook`;

CREATE TABLE `t_Logbook` (
  `PK_Log_ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `FK_Operator_ID` int(11) DEFAULT NULL COMMENT '操作人',
  `Log_Date` datetime DEFAULT NULL COMMENT '日志时间',
  `Action` varchar(200) DEFAULT NULL COMMENT '操作',
  PRIMARY KEY (`PK_Log_ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16541 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_Logbook`
-- ----------------------------

INSERT INTO `t_Logbook` VALUES ('16342', '22', '2020-09-01 10:34:06', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16343', '22', '2020-09-01 10:34:15', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16344', '16', '2020-09-01 10:37:41', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16345', '16', '2020-09-01 10:40:15', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16346', '16', '2020-09-01 10:40:29', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16347', '16', '2020-09-01 10:40:40', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16348', '16', '2020-09-01 10:49:39', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16349', '16', '2020-09-01 10:54:13', '新增往来单位PK_BU_ID=153 名称:看看');
INSERT INTO `t_Logbook` VALUES ('16350', '16', '2020-09-01 10:55:48', '新增地区分类:广东');
INSERT INTO `t_Logbook` VALUES ('16351', '16', '2020-09-01 10:55:58', '新增地区分类:广州');
INSERT INTO `t_Logbook` VALUES ('16352', '16', '2020-09-01 10:56:04', '新增地区分类:天河');
INSERT INTO `t_Logbook` VALUES ('16353', '16', '2020-09-01 10:56:23', '新增地区分类:棠下');
INSERT INTO `t_Logbook` VALUES ('16354', '16', '2020-09-01 10:56:44', '新增地区分类:潮州');
INSERT INTO `t_Logbook` VALUES ('16355', '16', '2020-09-01 10:58:42', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16356', '16', '2020-09-01 10:58:54', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16357', '16', '2020-09-01 10:59:53', '新增地区分类:湖南');
INSERT INTO `t_Logbook` VALUES ('16358', '16', '2020-09-01 11:00:00', '新增地区分类:长沙');
INSERT INTO `t_Logbook` VALUES ('16359', '16', '2020-09-01 11:00:19', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16360', '16', '2020-09-01 11:01:26', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16361', '22', '2020-09-01 11:08:11', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16362', '16', '2020-09-01 11:09:02', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16363', '16', '2020-09-01 11:09:36', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16364', '16', '2020-09-01 11:16:36', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16365', '16', '2020-09-01 11:17:05', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16366', '16', '2020-09-01 11:19:18', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16367', '24', '2020-09-01 11:19:27', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16368', '24', '2020-09-01 11:21:54', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16369', '16', '2020-09-01 11:22:17', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16370', '16', '2020-09-01 11:26:30', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16371', '16', '2020-09-01 11:27:02', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16372', '1', '2020-09-01 14:18:06', '备份与恢复,下载文件名:jxc_2020-08-31-04-15.sql');
INSERT INTO `t_Logbook` VALUES ('16373', '1', '2020-09-01 14:18:18', '备份与恢复,下载文件名:jxc_2020-08-19-09-57.sql');
INSERT INTO `t_Logbook` VALUES ('16374', '1', '2020-09-01 14:31:42', '新增单位:d');
INSERT INTO `t_Logbook` VALUES ('16375', '1', '2020-09-01 14:31:51', '删除单位:ID=35 名称：d');
INSERT INTO `t_Logbook` VALUES ('16376', '22', '2020-09-01 14:41:16', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16377', '1', '2020-09-01 14:52:41', '新增单位:sad');
INSERT INTO `t_Logbook` VALUES ('16378', '1', '2020-09-01 14:52:57', '删除单位:ID=36 名称：sad');
INSERT INTO `t_Logbook` VALUES ('16379', '1', '2020-09-01 14:53:00', '新增单位:发的');
INSERT INTO `t_Logbook` VALUES ('16380', '1', '2020-09-01 14:53:10', '删除单位:ID=37 名称：发的');
INSERT INTO `t_Logbook` VALUES ('16381', '22', '2020-09-01 15:16:58', '新增往来单位类别:服务业');
INSERT INTO `t_Logbook` VALUES ('16382', '22', '2020-09-01 15:17:28', '新增往来单位类别:产品加工业');
INSERT INTO `t_Logbook` VALUES ('16383', '22', '2020-09-01 15:17:52', '新增往来单位类别:运输业');
INSERT INTO `t_Logbook` VALUES ('16384', '22', '2020-09-01 15:18:30', '修改往来单位类别:制造业');
INSERT INTO `t_Logbook` VALUES ('16385', '22', '2020-09-01 15:19:07', '新增往来单位类别:tp5');
INSERT INTO `t_Logbook` VALUES ('16386', '22', '2020-09-01 15:19:14', '修改往来单位类别:tp5');
INSERT INTO `t_Logbook` VALUES ('16387', '22', '2020-09-01 15:19:26', '删除往来单位类别:ID=28 名称：tp5');
INSERT INTO `t_Logbook` VALUES ('16388', '22', '2020-09-01 15:21:22', '新增部门:事业部');
INSERT INTO `t_Logbook` VALUES ('16389', '22', '2020-09-01 15:22:19', '新增部门:后勤部');
INSERT INTO `t_Logbook` VALUES ('16390', '22', '2020-09-01 15:22:50', '新增单位:层');
INSERT INTO `t_Logbook` VALUES ('16391', '22', '2020-09-01 15:22:59', '新增单位:根');
INSERT INTO `t_Logbook` VALUES ('16392', '22', '2020-09-01 15:23:08', '修改单位:套');
INSERT INTO `t_Logbook` VALUES ('16393', '22', '2020-09-01 15:23:30', '新增单位:tp5');
INSERT INTO `t_Logbook` VALUES ('16394', '22', '2020-09-01 15:23:41', '删除单位:ID=40 名称：tp5');
INSERT INTO `t_Logbook` VALUES ('16395', '22', '2020-09-01 15:25:01', '修改了系统参数：1.2');
INSERT INTO `t_Logbook` VALUES ('16396', '1', '2020-09-01 15:25:17', '新增部门:zabbix');
INSERT INTO `t_Logbook` VALUES ('16397', '22', '2020-09-01 15:29:57', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16398', '22', '2020-09-01 15:30:29', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16399', '1', '2020-09-01 15:30:57', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16400', '23', '2020-09-01 15:31:05', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16401', '23', '2020-09-01 15:31:16', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16402', '1', '2020-09-01 15:31:20', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16403', '1', '2020-09-01 15:31:49', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16404', '23', '2020-09-01 15:31:55', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16405', '23', '2020-09-01 15:32:04', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16406', '1', '2020-09-01 15:32:08', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16407', '1', '2020-09-01 15:32:11', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16408', '1', '2020-09-01 15:32:17', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16409', '1', '2020-09-01 15:32:27', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16410', '1', '2020-09-01 15:32:49', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16411', '1', '2020-09-01 15:32:57', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16412', '1', '2020-09-01 15:33:04', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16413', '1', '2020-09-01 15:33:26', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16414', '1', '2020-09-01 15:33:29', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16415', '1', '2020-09-01 15:34:54', '新增往来单位PK_BU_ID=154 名称:zabbix');
INSERT INTO `t_Logbook` VALUES ('16416', '1', '2020-09-01 15:35:05', '修改了往来单位:154');
INSERT INTO `t_Logbook` VALUES ('16417', '1', '2020-09-01 15:35:28', '修改了往来单位:154');
INSERT INTO `t_Logbook` VALUES ('16418', '1', '2020-09-01 15:39:57', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16419', '23', '2020-09-01 15:40:04', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16420', '23', '2020-09-01 15:40:19', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16421', '1', '2020-09-01 15:40:22', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16422', '16', '2020-09-01 16:01:50', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16423', '16', '2020-09-01 16:02:51', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16424', '16', '2020-09-01 16:03:38', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16425', '16', '2020-09-01 16:04:08', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16426', '16', '2020-09-01 16:05:53', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16427', '16', '2020-09-01 16:06:02', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16428', '16', '2020-09-01 16:06:05', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16429', '16', '2020-09-01 16:06:33', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16430', '16', '2020-09-01 16:06:44', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16431', '16', '2020-09-01 16:07:29', '新增往来单位PK_BU_ID=155 名称:姥姥');
INSERT INTO `t_Logbook` VALUES ('16432', '22', '2020-09-01 16:10:30', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16433', '16', '2020-09-01 16:11:26', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16434', '16', '2020-09-01 16:11:36', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16435', '16', '2020-09-01 16:13:38', '新增地区分类:佛山');
INSERT INTO `t_Logbook` VALUES ('16436', '16', '2020-09-01 16:13:56', '新增地区分类:禅城区');
INSERT INTO `t_Logbook` VALUES ('16437', '16', '2020-09-01 16:14:12', '新增地区分类:魁奇路');
INSERT INTO `t_Logbook` VALUES ('16438', '16', '2020-09-01 16:14:31', '修改了往来单位:155');
INSERT INTO `t_Logbook` VALUES ('16439', '16', '2020-09-01 16:17:03', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16440', '16', '2020-09-01 16:17:32', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16441', '16', '2020-09-01 16:21:49', '新增往来单位PK_BU_ID=156 名称:Tuesday');
INSERT INTO `t_Logbook` VALUES ('16442', '16', '2020-09-01 16:22:04', '修改了往来单位:156');
INSERT INTO `t_Logbook` VALUES ('16443', '16', '2020-09-01 16:32:27', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16444', '16', '2020-09-01 16:32:57', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16445', '22', '2020-09-01 16:33:26', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16446', '16', '2020-09-01 16:34:03', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16447', '16', '2020-09-01 16:34:23', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16448', '16', '2020-09-01 16:46:37', '新增单位:托盘');
INSERT INTO `t_Logbook` VALUES ('16449', '16', '2020-09-01 16:47:04', '修改单位:托盘11');
INSERT INTO `t_Logbook` VALUES ('16450', '16', '2020-09-01 16:47:45', '删除单位:ID=41 名称：托盘11');
INSERT INTO `t_Logbook` VALUES ('16451', '16', '2020-09-01 16:49:58', '新增工作流程类别信息id=64 名称:tp5');
INSERT INTO `t_Logbook` VALUES ('16452', '16', '2020-09-01 16:52:03', '新增工作流程类别信息id=65 名称:9090');
INSERT INTO `t_Logbook` VALUES ('16453', '16', '2020-09-01 17:05:22', '新增工作中心:love');
INSERT INTO `t_Logbook` VALUES ('16454', '16', '2020-09-01 17:06:40', '修改工作中心:lovein');
INSERT INTO `t_Logbook` VALUES ('16455', '16', '2020-09-01 17:08:05', '新增工作中心:on');
INSERT INTO `t_Logbook` VALUES ('16456', '16', '2020-09-01 17:08:24', '删除工作中心:ID=32 名称:on');
INSERT INTO `t_Logbook` VALUES ('16457', '16', '2020-09-01 17:10:07', '删除部门:ID=48 名称：zabbix');
INSERT INTO `t_Logbook` VALUES ('16458', '16', '2020-09-01 17:11:32', '修改工作中心:事业部11');
INSERT INTO `t_Logbook` VALUES ('16459', '16', '2020-09-01 17:12:56', '新增部门:总经理');
INSERT INTO `t_Logbook` VALUES ('16460', '16', '2020-09-01 17:15:26', '新增往来单位类别:tp5');
INSERT INTO `t_Logbook` VALUES ('16461', '16', '2020-09-01 17:17:47', '修改往来单位类别:tp599');
INSERT INTO `t_Logbook` VALUES ('16462', '16', '2020-09-01 17:18:29', '删除往来单位类别:ID=29 名称：tp599');
INSERT INTO `t_Logbook` VALUES ('16463', '16', '2020-09-01 17:22:10', '删除往来单位类别:ID=47535 名称：潮州');
INSERT INTO `t_Logbook` VALUES ('16464', '16', '2020-09-01 17:22:15', '删除往来单位类别:ID=47538 名称：佛山');
INSERT INTO `t_Logbook` VALUES ('16465', '16', '2020-09-01 17:22:16', '删除往来单位类别:ID=47532 名称：广州');
INSERT INTO `t_Logbook` VALUES ('16466', '16', '2020-09-01 17:22:25', '删除往来单位类别:ID=47531 名称：广东');
INSERT INTO `t_Logbook` VALUES ('16467', '16', '2020-09-01 17:22:26', '删除往来单位类别:ID=47536 名称：湖南');
INSERT INTO `t_Logbook` VALUES ('16468', '16', '2020-09-01 17:23:12', '新增地区分类:hh');
INSERT INTO `t_Logbook` VALUES ('16469', '16', '2020-09-01 17:23:30', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16470', '16', '2020-09-01 17:24:10', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16471', '16', '2020-09-01 17:24:26', '新增地区分类:哈哈');
INSERT INTO `t_Logbook` VALUES ('16472', '16', '2020-09-01 17:24:40', '新增地区分类:哈');
INSERT INTO `t_Logbook` VALUES ('16473', '16', '2020-09-01 17:24:49', '删除往来单位类别:ID=47543 名称：哈');
INSERT INTO `t_Logbook` VALUES ('16474', '16', '2020-09-01 17:25:03', '新增地区分类:哈');
INSERT INTO `t_Logbook` VALUES ('16475', '16', '2020-09-01 17:25:57', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16476', '16', '2020-09-01 17:26:22', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16477', '16', '2020-09-01 17:26:53', '删除往来单位类别:ID=47544 名称：哈');
INSERT INTO `t_Logbook` VALUES ('16478', '16', '2020-09-01 17:27:07', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16479', '16', '2020-09-01 17:27:31', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16480', '16', '2020-09-01 17:28:08', '修改地区分类:哈哈好');
INSERT INTO `t_Logbook` VALUES ('16481', '16', '2020-09-01 17:28:15', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16482', '16', '2020-09-01 17:28:35', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16483', '16', '2020-09-01 17:28:57', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16484', '16', '2020-09-01 17:29:14', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16485', '16', '2020-09-01 17:29:26', '新增地区分类:哈哈');
INSERT INTO `t_Logbook` VALUES ('16486', '16', '2020-09-01 17:29:50', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16487', '16', '2020-09-01 17:30:09', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16488', '16', '2020-09-01 17:30:27', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16489', '16', '2020-09-01 17:30:46', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16490', '16', '2020-09-01 17:37:38', '新增物料模板:PK_MT_ID= 名称:78');
INSERT INTO `t_Logbook` VALUES ('16491', '16', '2020-09-01 17:38:23', '更新物料模板:PK_MTD_ID=51 名称:7889');
INSERT INTO `t_Logbook` VALUES ('16492', '16', '2020-09-01 17:38:55', '删除物料模板:PK_MT_ID=51 名称:7889');
INSERT INTO `t_Logbook` VALUES ('16493', '16', '2020-09-01 17:45:46', '删除往来单位类别:ID=47545 名称：哈哈');
INSERT INTO `t_Logbook` VALUES ('16494', '16', '2020-09-01 17:45:48', '删除往来单位类别:ID=47542 名称：哈哈好');
INSERT INTO `t_Logbook` VALUES ('16495', '16', '2020-09-01 17:45:54', '新增地区分类:广东');
INSERT INTO `t_Logbook` VALUES ('16496', '16', '2020-09-01 17:46:02', '新增地区分类:广州');
INSERT INTO `t_Logbook` VALUES ('16497', '16', '2020-09-01 17:46:21', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16498', '16', '2020-09-01 17:46:29', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16499', '16', '2020-09-01 17:46:45', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16500', '16', '2020-09-01 17:47:21', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16501', '16', '2020-09-01 17:49:17', '删除往来单位类别:ID=47547 名称：广州');
INSERT INTO `t_Logbook` VALUES ('16502', '16', '2020-09-01 17:49:37', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16503', '16', '2020-09-01 17:50:00', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16504', '16', '2020-09-01 17:50:11', '删除往来单位类别:ID=47546 名称：广东');
INSERT INTO `t_Logbook` VALUES ('16505', '16', '2020-09-01 17:50:18', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16506', '16', '2020-09-01 17:51:03', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16507', '16', '2020-09-01 17:51:12', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16508', '1', '2020-09-02 10:10:33', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16509', '1', '2020-09-02 10:16:12', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16510', '1', '2020-09-02 10:16:36', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16511', '1', '2020-09-02 10:16:39', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16512', '1', '2020-09-02 10:28:24', '新增地区分类:b');
INSERT INTO `t_Logbook` VALUES ('16513', '1', '2020-09-02 10:28:36', '删除往来单位类别:ID=47542 名称：b');
INSERT INTO `t_Logbook` VALUES ('16514', '1', '2020-09-02 10:28:52', '新增地区分类:广东');
INSERT INTO `t_Logbook` VALUES ('16515', '1', '2020-09-02 10:29:01', '新增地区分类:广州');
INSERT INTO `t_Logbook` VALUES ('16516', '1', '2020-09-02 10:30:09', '删除往来单位类别:ID=47544 名称：广州');
INSERT INTO `t_Logbook` VALUES ('16517', '1', '2020-09-02 10:30:13', '删除往来单位类别:ID=47543 名称：广东');
INSERT INTO `t_Logbook` VALUES ('16518', '1', '2020-09-02 10:30:40', '新增地区分类:广东');
INSERT INTO `t_Logbook` VALUES ('16519', '1', '2020-09-02 10:30:49', '新增地区分类:广州');
INSERT INTO `t_Logbook` VALUES ('16520', '1', '2020-09-02 10:30:54', '新增地区分类:天河');
INSERT INTO `t_Logbook` VALUES ('16521', '1', '2020-09-02 10:31:05', '新增地区分类:棠下');
INSERT INTO `t_Logbook` VALUES ('16522', '1', '2020-09-02 10:31:25', '新增往来单位PK_BU_ID=1 名称:zabbix');
INSERT INTO `t_Logbook` VALUES ('16523', '16', '2020-09-02 10:58:14', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16524', '1', '2020-09-02 11:53:14', '备份与恢复,下载文件名:jxc_2020-08-31-04-15.sql');
INSERT INTO `t_Logbook` VALUES ('16525', '1', '2020-09-02 15:20:40', '新增往来单位PK_BU_ID=2 名称:dd');
INSERT INTO `t_Logbook` VALUES ('16526', '1', '2020-09-02 15:36:47', '新增往来单位PK_BU_ID=3 名称:dsf');
INSERT INTO `t_Logbook` VALUES ('16527', '1', '2020-09-03 17:09:35', '删除往来单位:PK_BU_ID=3 名称:dsf');
INSERT INTO `t_Logbook` VALUES ('16528', '1', '2020-09-04 09:23:33', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16529', '1', '2020-09-04 15:40:12', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16530', '1', '2020-09-04 15:44:08', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16531', '1', '2020-09-04 15:44:49', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16532', '1', '2020-09-04 17:18:03', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16533', '1', '2020-09-05 16:00:32', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16534', '1', '2020-09-05 16:00:36', '备份与恢复,下载文件名:jxc_2020-08-31-04-15.sql');
INSERT INTO `t_Logbook` VALUES ('16535', '1', '2020-09-07 11:39:30', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16536', '1', '2020-09-11 10:28:33', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16537', '1', '2020-09-11 11:16:51', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16538', '1', '2020-10-30 15:06:58', '登陆成功');
INSERT INTO `t_Logbook` VALUES ('16539', '1', '2020-10-30 15:17:17', '退出登陆');
INSERT INTO `t_Logbook` VALUES ('16540', '1', '2020-11-03 17:38:04', '登陆成功');

-- ----------------------------
-- Table structure for `t_MatEst`
-- ----------------------------

DROP TABLE IF EXISTS `t_MatEst`;

CREATE TABLE `t_MatEst` (
  `Date` varchar(28) NOT NULL COMMENT '日期',
  `BOM_ID` int(11) unsigned NOT NULL COMMENT 'BOM_ID',
  `AmOfDem` decimal(11,3) DEFAULT NULL COMMENT '总需求量',
  `AmOfSto` decimal(11,3) DEFAULT NULL COMMENT '库存量',
  `AmOfPro` decimal(11,3) DEFAULT NULL COMMENT '需生产量',
  `AmOfPur` decimal(11,3) DEFAULT NULL COMMENT '需采购量',
  PRIMARY KEY (`Date`) USING BTREE,
  KEY `FK_BOM_ID` (`BOM_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_MatEst`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_MatTem_Design`
-- ----------------------------

DROP TABLE IF EXISTS `t_MatTem_Design`;

CREATE TABLE `t_MatTem_Design` (
  `PK_MTD_ID` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'MTD设计ID',
  `Name` varchar(20) DEFAULT NULL COMMENT 'MTD设计名字',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `WPTD_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '工作流程模板设计ID',
  `UpMT_ID` int(11) unsigned NOT NULL COMMENT '上位MT编号',
  `DownMT_ID` int(11) unsigned NOT NULL COMMENT '下位MT编号',
  `DownAmount` decimal(11,3) NOT NULL DEFAULT '0.000' COMMENT '下位MT数量',
  `F0` varchar(200) DEFAULT NULL COMMENT '规格属性关系函数表示：DownMTAttr(n)=F(UpMTAttr(x))',
  `F1` varchar(200) DEFAULT NULL,
  `F2` varchar(200) DEFAULT NULL,
  `F3` varchar(200) DEFAULT NULL,
  `F4` varchar(200) DEFAULT NULL,
  `F5` varchar(200) DEFAULT NULL,
  `F6` varchar(200) DEFAULT NULL,
  `F7` varchar(200) DEFAULT NULL,
  `F8` varchar(200) DEFAULT NULL,
  `F9` varchar(200) DEFAULT NULL,
  `F10` varchar(200) DEFAULT NULL,
  `F11` varchar(200) DEFAULT NULL,
  `F12` varchar(200) DEFAULT NULL,
  `F13` varchar(200) DEFAULT NULL,
  `F14` varchar(200) DEFAULT NULL,
  `F15` varchar(200) DEFAULT NULL,
  `F16` varchar(200) DEFAULT NULL,
  `F17` varchar(200) DEFAULT NULL,
  `F18` varchar(200) DEFAULT NULL,
  `F19` varchar(200) DEFAULT NULL,
  `Coef` varchar(200) DEFAULT NULL COMMENT '因子描述：C0|C1|C2|...|Cx，x不大于10，数据适度冗余',
  `C0` varchar(200) DEFAULT NULL COMMENT '因子0，损耗因子',
  `C1` varchar(200) DEFAULT NULL COMMENT '因子1，管理因子',
  `C2` varchar(200) DEFAULT NULL,
  `C3` varchar(200) DEFAULT NULL,
  `C4` varchar(200) DEFAULT NULL,
  `C5` varchar(200) DEFAULT NULL,
  `C6` varchar(200) DEFAULT NULL,
  `C7` varchar(200) DEFAULT NULL,
  `C8` varchar(200) DEFAULT NULL,
  `C9` varchar(200) DEFAULT NULL,
  `C10` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`PK_MTD_ID`) USING BTREE,
  KEY `FK_DownMT_ID` (`DownMT_ID`) USING BTREE,
  KEY `FK_UpMT_ID` (`UpMT_ID`) USING BTREE,
  KEY `FK_WPTD_ID` (`WPTD_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_MatTem_Design`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_MatTemplate`
-- ----------------------------

DROP TABLE IF EXISTS `t_MatTemplate`;

CREATE TABLE `t_MatTemplate` (
  `PK_MT_ID` smallint(3) unsigned NOT NULL AUTO_INCREMENT COMMENT '物料模板ID',
  `Name` varchar(50) DEFAULT NULL COMMENT '名字',
  `Desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `BOMCat_ID2` smallint(3) unsigned NOT NULL DEFAULT '0' COMMENT '用户自定义类别',
  `UnitClass_ID` tinyint(2) unsigned NOT NULL COMMENT '单位类别,0～99',
  `Attr` varchar(140) DEFAULT NULL COMMENT '规格属性描述:采用属性数量x|别名1|别名2|...|别名x,x不大于20',
  `Attr0` varchar(20) DEFAULT NULL COMMENT '属性0',
  `Attr1` varchar(20) DEFAULT NULL COMMENT '属性1',
  `Attr2` varchar(20) DEFAULT NULL,
  `Attr3` varchar(20) DEFAULT NULL,
  `Attr4` varchar(20) DEFAULT NULL,
  `Attr5` varchar(20) DEFAULT NULL,
  `Attr6` varchar(20) DEFAULT NULL,
  `Attr7` varchar(20) DEFAULT NULL,
  `Attr8` varchar(20) DEFAULT NULL,
  `Attr9` varchar(20) DEFAULT NULL,
  `Attr10` varchar(20) DEFAULT NULL,
  `Attr11` varchar(20) DEFAULT NULL,
  `Attr12` varchar(20) DEFAULT NULL,
  `Attr13` varchar(20) DEFAULT NULL,
  `Attr14` varchar(20) DEFAULT NULL,
  `Attr15` varchar(20) DEFAULT NULL,
  `Attr16` varchar(20) DEFAULT NULL,
  `Attr17` varchar(20) DEFAULT NULL,
  `Attr18` varchar(20) DEFAULT NULL,
  `Attr19` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`PK_MT_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='物料模板基本表';

-- ----------------------------
-- Data for the table `t_MatTemplate`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_OL_Detail`
-- ----------------------------

DROP TABLE IF EXISTS `t_OL_Detail`;

CREATE TABLE `t_OL_Detail` (
  `OL_ID` varchar(20) NOT NULL COMMENT '订单编号，如自定义格式L+yyyy+mm+dd+xxxx',
  `OL_De` varchar(10) NOT NULL COMMENT '详单编号，暂启用5位yyyyy',
  `BOM_ID` int(11) unsigned NOT NULL COMMENT 'BOM编号',
  `Amount` decimal(11,3) NOT NULL DEFAULT '0.000' COMMENT '物流数量',
  `Log_Price` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '物流单价',
  `Log_SubTotal` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '物流小计',
  `ReferPrice0` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价0，预留，待定义',
  `ReferPrice1` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价1，预留，待定义',
  `ReferPrice2` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价2，预留，待定义',
  `ReferPrice3` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价3，预留，待定义',
  `ReferPrice4` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价4，预留，待定义',
  PRIMARY KEY (`OL_ID`,`OL_De`) USING BTREE,
  KEY `FK_BOM_ID` (`BOM_ID`) USING BTREE,
  KEY `FK_LogOrder_ID` (`OL_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_OL_Detail`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_OP_Detail`
-- ----------------------------

DROP TABLE IF EXISTS `t_OP_Detail`;

CREATE TABLE `t_OP_Detail` (
  `OP_ID` varchar(20) NOT NULL COMMENT '订单编号，如自定义格式P/S+yyyy+mm+dd+xxxx',
  `OP_De` varchar(10) NOT NULL COMMENT '详单编号，暂启用5位yyyyy',
  `BOM_ID` int(11) unsigned NOT NULL COMMENT 'BOM编号',
  `Amount` decimal(11,3) NOT NULL DEFAULT '0.000' COMMENT '采购量',
  `Pur_Price` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '采购单价',
  `Pur_SubTotal` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '采购小计',
  `ReferPrice0` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价0，预留，待定义',
  `ReferPrice1` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价1，预留，待定义',
  `ReferPrice2` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价2，预留，待定义',
  `ReferPrice3` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价3，预留，待定义',
  `ReferPrice4` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价4，预留，待定义',
  PRIMARY KEY (`OP_ID`,`OP_De`) USING BTREE,
  KEY `FK_BOM_ID` (`BOM_ID`) USING BTREE,
  KEY `FK_OP_ID` (`OP_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_OP_Detail`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_OS_Detail`
-- ----------------------------

DROP TABLE IF EXISTS `t_OS_Detail`;

CREATE TABLE `t_OS_Detail` (
  `OS_ID` varchar(20) NOT NULL COMMENT '订单编号，如自定义格式P/S+yyyy+mm+dd+xxxx',
  `OS_De` varchar(10) NOT NULL COMMENT '详单编号，暂启用5位yyyyy',
  `BOM_ID` int(11) unsigned NOT NULL COMMENT 'BOM编号',
  `Amount` decimal(11,3) NOT NULL DEFAULT '0.000' COMMENT '销售数量',
  `Sale_Price` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '销售单价',
  `Sale_SubTotal` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '销售小计',
  `ReferPrice0` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价0，默认成本价',
  `ReferPrice1` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价1，一级',
  `ReferPrice2` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价2，二级',
  `ReferPrice3` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价3，三级',
  `ReferPrice4` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '参考价4，特别',
  PRIMARY KEY (`OS_ID`,`OS_De`) USING BTREE,
  KEY `FK_BOM_ID` (`BOM_ID`) USING BTREE,
  KEY `FK_OS_ID` (`OS_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_OS_Detail`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_OSt_Detail`
-- ----------------------------

DROP TABLE IF EXISTS `t_OSt_Detail`;

CREATE TABLE `t_OSt_Detail` (
  `PK_OSt_ID` varchar(20) NOT NULL COMMENT '订单编号，如自定义格式SO+yyyy+mm+dd+xxxx',
  `Ost_De` varchar(10) NOT NULL COMMENT '详单编号，暂启用5位yyyyy',
  `BOM_ID` int(11) unsigned NOT NULL COMMENT 'BOM编号',
  `Amount` decimal(11,3) NOT NULL DEFAULT '0.000' COMMENT '数量',
  `Cost` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '成本',
  `SO_SubTotal` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '小计金额',
  PRIMARY KEY (`PK_OSt_ID`,`Ost_De`) USING BTREE,
  KEY `FK_BOM_ID` (`BOM_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_OSt_Detail`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_OrderLog`
-- ----------------------------

DROP TABLE IF EXISTS `t_OrderLog`;

CREATE TABLE `t_OrderLog` (
  `PK_OL_ID` varchar(20) NOT NULL COMMENT '订单编号，如自定义格式L+yyyy+mm+dd+xxxx',
  `Supplier_ID` mediumint(6) unsigned NOT NULL COMMENT '供应商编号',
  `Name` varchar(20) DEFAULT NULL COMMENT '订单名称',
  `Desc` varchar(200) DEFAULT NULL COMMENT '物流要求描述',
  `SignPer_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '签约人',
  `Sign_Date` date DEFAULT NULL COMMENT '签约时间',
  `Status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '审核状态：0提交计划,1询价增补提交审核,2审核通过，3审核不通过，5签订,9执行完毕',
  `Review_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '审核人',
  `Order_Total` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '订单总金额',
  `Payment` varchar(200) DEFAULT NULL COMMENT '付款条件',
  `Creator_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '创建人',
  `Create_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `Modify_ID` smallint(4) unsigned DEFAULT NULL COMMENT '变更人',
  `Modify_Date` datetime DEFAULT NULL COMMENT '变更时间',
  PRIMARY KEY (`PK_OL_ID`) USING BTREE,
  KEY `FK_SignPer_ID` (`SignPer_ID`) USING BTREE,
  KEY `FK_Supplier_ID` (`Supplier_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_OrderLog`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_OrderPur`
-- ----------------------------

DROP TABLE IF EXISTS `t_OrderPur`;

CREATE TABLE `t_OrderPur` (
  `PK_OP_ID` varchar(20) NOT NULL COMMENT '订单编号，如自定义格式P/S+yyyy+mm+dd+xxxx',
  `Supplier_ID` mediumint(6) unsigned NOT NULL COMMENT '供应商编号',
  `Name` varchar(20) DEFAULT NULL COMMENT '订单名称',
  `SignPer_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '签约人',
  `Sign_Date` date DEFAULT NULL COMMENT '签约时间',
  `Status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '审核状态：0提交计划,1询价增补提交审核,2审核通过，3审核不通过，5签订,9执行完毕',
  `Review_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '审核人',
  `PurOrder_Total` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '订单总金额',
  `PurOrder_Payment` varchar(200) DEFAULT NULL COMMENT '付款条件',
  `Creator_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '创建人',
  `Create_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `Modify_ID` smallint(4) unsigned DEFAULT NULL COMMENT '变更人',
  `Modify_Date` datetime DEFAULT NULL COMMENT '变更时间',
  `Stock_ID` smallint(4) NOT NULL COMMENT '仓库ID',
  PRIMARY KEY (`PK_OP_ID`) USING BTREE,
  KEY `FK_SignPer_ID` (`SignPer_ID`) USING BTREE,
  KEY `FK_Supplier_ID` (`Supplier_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_OrderPur`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_OrderSale`
-- ----------------------------

DROP TABLE IF EXISTS `t_OrderSale`;

CREATE TABLE `t_OrderSale` (
  `PK_OS_ID` varchar(20) NOT NULL COMMENT '订单编号，如自定义格式P/S+yyyy+mm+dd+xxxx',
  `Customer_ID` mediumint(6) unsigned NOT NULL COMMENT '供应商编号',
  `Name` varchar(20) DEFAULT NULL COMMENT '订单名称',
  `SignPer_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '签约人',
  `Sign_Date` date DEFAULT NULL COMMENT '签约时间',
  `Status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '审核状态：0提交计划,1询价增补提交审核,2审核通过（报价），3审核不通过（报价），4报价生成销售，5签订,6审核通过（销售），7审核不通过（销售），9执行完毕',
  `Review_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '审核人',
  `SaleOrder_Total` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '订单总金额',
  `SaleOrder_TotalCost` decimal(11,2) NOT NULL DEFAULT '0.00' COMMENT '订单总成本',
  `SaleOrder_Payment` varchar(200) DEFAULT NULL COMMENT '付款条件',
  `Creator_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '创建人',
  `Create_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `Modify_ID` smallint(4) unsigned DEFAULT NULL COMMENT '变更人',
  `Modify_Date` datetime DEFAULT NULL COMMENT '变更时间',
  `Stock_ID` smallint(4) NOT NULL COMMENT '仓库ID',
  PRIMARY KEY (`PK_OS_ID`) USING BTREE,
  KEY `FK_Customer_ID` (`Customer_ID`) USING BTREE,
  KEY `FK_SignPer_ID` (`SignPer_ID`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Data for the table `t_OrderSale`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_OrderSto`
-- ----------------------------

DROP TABLE IF EXISTS `t_OrderSto`;

CREATE TABLE `t_OrderSto` (
  `PK_BOM_SO_ID` varchar(20) NOT NULL COMMENT '库存变更单编号，如自定义格式SO+yyyy+mm+dd+xxxx',
  `Stock_ID` smallint(4) unsigned NOT NULL COMMENT '仓库编号',
  `Order_ID` varchar(20) NOT NULL DEFAULT '0' COMMENT '对应采购或者销售订单编号',
  `Type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '仓库进出类型,0其它,1采购,2领用,3销售,4盘盈,5盘亏',
  `Status` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '审核状态：0，5签订,9执行完毕',
  `Review_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '审核人',
  `Creator_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '创建人',
  `Create_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `Modify_ID` smallint(4) unsigned DEFAULT NULL COMMENT '变更人',
  `Modify_Date` datetime DEFAULT NULL COMMENT '变更时间',
  PRIMARY KEY (`PK_BOM_SO_ID`) USING BTREE,
  KEY `Stock_ID` (`Stock_ID`) USING BTREE,
  KEY `Order_ID` (`Order_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_OrderSto`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_Stock`
-- ----------------------------

DROP TABLE IF EXISTS `t_Stock`;

CREATE TABLE `t_Stock` (
  `PK_Stock_ID` smallint(4) unsigned NOT NULL AUTO_INCREMENT COMMENT '仓库编号',
  `Stock_Name` varchar(50) DEFAULT NULL COMMENT '仓库名称',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `Head_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '负责人',
  PRIMARY KEY (`PK_Stock_ID`) USING BTREE,
  KEY `FK_Head_ID` (`Head_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_Stock`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_System`
-- ----------------------------

DROP TABLE IF EXISTS `t_System`;

CREATE TABLE `t_System` (
  `ParaName` varchar(20) NOT NULL COMMENT '名称',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `Type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '0为整型,1为字符,2为DEC(11,3)',
  `Value` varchar(200) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`ParaName`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_System`
-- ----------------------------

INSERT INTO `t_System` VALUES ('SalePriceRefer1', '销售参考价计算', '0', '1.2');
INSERT INTO `t_System` VALUES ('VERSION', '版本号', '0', '1.00');

-- ----------------------------
-- Table structure for `t_User`
-- ----------------------------

DROP TABLE IF EXISTS `t_User`;

CREATE TABLE `t_User` (
  `PK_User_ID` smallint(4) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `Part_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '部门编号',
  `Username` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '' COMMENT '用户名称',
  `Userpwd` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '密码',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `Status` tinyint(1) DEFAULT '1' COMMENT '状态：0不正常，1正常',
  `lever` text NOT NULL COMMENT '操作权限',
  `roleid` tinyint(1) DEFAULT '1' COMMENT '角色（0：超管）',
  PRIMARY KEY (`PK_User_ID`) USING BTREE,
  KEY `FK_Part_ID` (`Part_ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_User`
-- ----------------------------

INSERT INTO `t_User` VALUES ('1', '47', 'admin', '09f6c712b9ba5165326f2950a6c7bfcb', 'boss', '1', '1', '0');
INSERT INTO `t_User` VALUES ('16', '42', '张三', '589d5e38046b5fb8996782de2d199372', '测试', '1', '1,101,2,3,4,5,96,108,109,110,111,11,12,13,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,132,133,134,135,136,14,15,140,141,142,143,144,145,146,147,148,150,149,151,152,153,154,155,156,18,19,58,59,60,61,6,10,8,9,97,68,69,70,71,77,78,79,80,81,82,83,84,85,100,107,86,87,88,99,89,90,91,92,94,95', '1');
INSERT INTO `t_User` VALUES ('21', '40', '王五', '766d3d3406c3d9863dbacefffa23c655', '测试3', '1', '1', '1');
INSERT INTO `t_User` VALUES ('22', '43', 'wangwu', '766d3d3406c3d9863dbacefffa23c655', '王五英文名称', '1', '1,101,2,3,4,5,96,108,109,110,111,11,12,13,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,132,133,134,135,136,14,15,140,141,142,143,144,145,146,147,148,150,149,151,152,153,154,155,156,18,19,58,59,60,61,6,10,8,9,97,68,69,70,71,77,78,79,80,81,82,83,84,85,100,107,86,87,88,99,89,90,91,92,94,95', '1');
INSERT INTO `t_User` VALUES ('23', '0', 'lz', '80be4d15a7919126deff8cb9ff836e81', '555Aa', '1', '', '1');

-- ----------------------------
-- Table structure for `t_WPCat`
-- ----------------------------

DROP TABLE IF EXISTS `t_WPCat`;

CREATE TABLE `t_WPCat` (
  `PK_WPCat_ID` smallint(4) unsigned NOT NULL AUTO_INCREMENT COMMENT '工作流程类别ID，1切割,2冲压,3调整,4喷涂,5包装',
  `Name` varchar(50) DEFAULT NULL COMMENT '工作流程类别名称',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `Formula` varchar(200) DEFAULT NULL COMMENT '计算公式，OP=F(IP)',
  PRIMARY KEY (`PK_WPCat_ID`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=66 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Data for the table `t_WPCat`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_WPTem_Design`
-- ----------------------------

DROP TABLE IF EXISTS `t_WPTem_Design`;

CREATE TABLE `t_WPTem_Design` (
  `PK_WPTD_ID` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Desc` varchar(255) DEFAULT NULL,
  `WC_ID` smallint(4) unsigned NOT NULL,
  `UpMT_ID` smallint(3) unsigned NOT NULL,
  `DownMT_ID` smallint(3) unsigned NOT NULL,
  PRIMARY KEY (`PK_WPTD_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_WPTem_Design`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_Work_Center`
-- ----------------------------

DROP TABLE IF EXISTS `t_Work_Center`;

CREATE TABLE `t_Work_Center` (
  `PK_WC_ID` smallint(4) unsigned NOT NULL AUTO_INCREMENT COMMENT '工作中心编号',
  `WC_Name` varchar(50) DEFAULT NULL COMMENT '工作中心名称',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `Head_ID` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT '负责人',
  `IsKey` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '0不关键，1关键',
  PRIMARY KEY (`PK_WC_ID`) USING BTREE,
  KEY `FK_Head_ID` (`Head_ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_Work_Center`
-- ----------------------------

INSERT INTO `t_Work_Center` VALUES ('31', 'lovein', 'lovein', '0', '0');

-- ----------------------------
-- Table structure for `t_industry`
-- ----------------------------

DROP TABLE IF EXISTS `t_industry`;

CREATE TABLE `t_industry` (
  `PK_Industry_ID` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '行业编号',
  `Name` varchar(50) DEFAULT NULL COMMENT '单位名称',
  `Desc` varchar(200) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`PK_Industry_ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_industry`
-- ----------------------------

INSERT INTO `t_industry` VALUES ('25', '制造业', 'ZZY');
INSERT INTO `t_industry` VALUES ('26', '产品加工业', 'JGY');
INSERT INTO `t_industry` VALUES ('27', '运输业', 'YSY');

-- ----------------------------
-- Table structure for `t_matplan`
-- ----------------------------

DROP TABLE IF EXISTS `t_matplan`;

CREATE TABLE `t_matplan` (
  `PK_TM_ID` int(11) unsigned NOT NULL,
  `SO_ID` varchar(20) NOT NULL,
  `SO_De` varchar(20) NOT NULL,
  `UpBOM_ID` int(11) unsigned NOT NULL,
  `DownBOM_ID` int(11) unsigned NOT NULL,
  `Levil` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `BOMAmount` decimal(11,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`PK_TM_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Data for the table `t_matplan`
-- ----------------------------

-- ----------------------------
-- Table structure for `t_menu`
-- ----------------------------

DROP TABLE IF EXISTS `t_menu`;

CREATE TABLE `t_menu` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT COMMENT '导航栏目',
  `title` varchar(50) COLLATE utf8_unicode_ci DEFAULT '' COMMENT '栏目名称',
  `pid` smallint(5) DEFAULT '0' COMMENT '上级栏目ID',
  `path` varchar(100) COLLATE utf8_unicode_ci DEFAULT '' COMMENT '栏目路径',
  `depth` tinyint(2) DEFAULT '1' COMMENT '层次',
  `ordnum` smallint(6) DEFAULT '0' COMMENT '排序',
  `url` varchar(100) COLLATE utf8_unicode_ci DEFAULT '' COMMENT '外部链接',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id` (`id`) USING BTREE,
  KEY `pid` (`pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT COMMENT='导航管理';

-- ----------------------------
-- Data for the table `t_menu`
-- ----------------------------

INSERT INTO `t_menu` VALUES ('1', '采购单', '1', '1', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('2', '新增', '1', '1,2', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('3', '修改', '1', '1,3', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('4', '删除', '1', '1,4', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('5', '导出', '1', '1,5', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('6', '销售单', '6', '6', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('8', '修改', '6', '6,8', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('9', '删除', '6', '6,9', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('10', '导出', '6', '6,10', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('11', '盘点', '11', '11', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('12', '生成盘点记录', '11', '11,12', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('13', '导出', '11', '11,13', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('14', '其他入库', '14', '14', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('15', '新增', '14', '14,15', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('18', '其他出库', '18', '18', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('19', '新增', '18', '18,19', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('58', '往来单位管理', '58', '58', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('59', '新增', '58', '58,59', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('60', '修改', '58', '58,60', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('61', '删除', '58', '58,61', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('68', 'BOM管理', '68', '68', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('69', '新增', '68', '68,69', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('70', '修改', '68', '68,70', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('71', '删除', '68', '68,71', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('77', '计量单位', '77', '77', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('78', '新增', '77', '77,78', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('79', '修改', '77', '77,79', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('80', '删除', '77', '77,80', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('81', '系统参数', '81', '81', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('82', '员工权限', '82', '82', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('83', '操作日志', '83', '83', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('84', '数据备份与恢复', '84', '84', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('85', '报价单', '85', '85', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('86', '新增', '85', '85,86', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('87', '修改', '85', '85,87', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('88', '删除', '85', '85,88', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('89', '物流信息', '89', '89', '1', '99', '', '1');
INSERT INTO `t_menu` VALUES ('90', '新增', '89', '89,90', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('91', '修改', '89', '89,91', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('92', '删除', '89', '89,92', '2', '99', '', '1');
INSERT INTO `t_menu` VALUES ('94', '采购计划', '94', '94', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('95', '生成采购单', '94', '94,95', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('96', '审核采购单', '1', '1,96', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('97', '审核销售单', '6', '6,97', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('99', '审核报价单', '85', '85,99', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('100', '生成销售单', '85', '85,100', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('101', '编辑', '1', '1,101', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('107', '导出', '85', '85,107', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('108', '往来单位类别', '108', '108', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('109', '新增', '108', '108,109', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('110', '修改', '108', '108,110', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('111', '删除', '108', '108,111', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('112', '工作中心', '112', '112', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('113', '新增', '112', '112,113', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('114', '修改', '112', '112,114', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('115', '删除', '112', '112,115', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('116', '地区分类', '116', '116', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('117', '新增', '116', '116,117', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('118', '修改', '116', '116,118', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('119', '删除', '116', '116,119', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('120', '部门', '120', '120', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('121', '新增', '120', '120,121', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('122', '修改', '120', '120,122', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('123', '删除', '120', '120,123', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('124', '仓库管理', '124', '124', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('125', '新增', '124', '124,125', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('126', '修改', '124', '124,126', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('127', '删除', '124', '124,127', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('132', '物料类别管理', '132', '132', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('133', '新增', '132', '132,133', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('134', '修改', '132', '132,134', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('135', '删除', '132', '132,135', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('136', '物料生产预估', '136', '136', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('140', '物料模板设计', '140', '140', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('141', '新增', '140', '140,141', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('142', '修改', '140', '140,142', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('143', '删除', '140', '140,143', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('144', '模板设计管理', '144', '144', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('145', '新增', '144', '144,145', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('146', '修改', '144', '144,146', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('147', '删除', '144', '144,147', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('148', '物料模板管理', '148', '148', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('149', '新增', '148', '148,149', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('150', '修改', '148', '148,,150', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('151', '删除', '148', '148,151', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('152', '工作流程类别', '152', '152', '1', '0', '', '1');
INSERT INTO `t_menu` VALUES ('153', '新增', '152', '152,153', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('154', '修改', '152', '152,154', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('155', '删除', '152', '152,155', '2', '0', '', '1');
INSERT INTO `t_menu` VALUES ('156', '调仓', '156', '156', '1', '0', '', '1');

-- ----------------------------
-- Table structure for `t_unit`
-- ----------------------------

DROP TABLE IF EXISTS `t_unit`;

CREATE TABLE `t_unit` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT '' COMMENT '单位名称',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT COMMENT='计量单位';

-- ----------------------------
-- Data for the table `t_unit`
-- ----------------------------

INSERT INTO `t_unit` VALUES ('38', '层', '1');
INSERT INTO `t_unit` VALUES ('39', '套', '1');

