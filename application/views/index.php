<?php if(!defined('BASEPATH')) exit('No direct script access allowed');?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1280, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="renderer" content="webkit|ie-comp|ie-stand">
<title>在线进销存</title>
<link href="<?=skin_url()?>/css/common.css?ver=20190505" rel="stylesheet" type="text/css">
<link href="<?=skin_url()?>/css/<?=skin()?>/ui.min.css?ver=20190505" rel="stylesheet">
<script src="<?=skin_url()?>/js/common/libs/jquery/jquery-1.10.2.min.js"></script>
<script src="<?=skin_url()?>/js/common/libs/json2.js"></script>
<script src="<?=skin_url()?>/js/common/common.js?ver=20190505"></script>
<script src="<?=skin_url()?>/js/common/grid.js?ver=20190505"></script>
<script src="<?=skin_url()?>/js/common/plugins.js?ver=20190505"></script>
<script src="<?=skin_url()?>/js/common/plugins/jquery.dialog.js?self=true&ver=20190505"></script>

<script type="text/javascript">
var SCHEME= "<?=skin()?>";
var icon_url = "<?=skin_url()?>/css/base/dialog/icons/";                      //图片路径
var settings_customer_manage = "<?=site_url('settings/customer_manage')?>";   //新增修改客户 
var basedata_customer = "<?=site_url('basedata/customer')?>";                 //客户列表
var settings_vendor_manage = "<?=site_url('settings/vendor_manage')?>";       //新增供应商
var settings_vendor_batch = "<?=site_url('settings/vendor_batch')?>";             //批量选择供应商 
var basedata_vendor = "<?=site_url('basedata/vendor')?>";                     //供应商列表
var basedata_settlement = "<?=site_url('basedata/settlement')?>";             //结算方式列表
var settings_settlement_manage = "<?=site_url('settings/settlement_manage')?>";       //新增修改结算方式
var basedata_category = "<?=site_url('basedata/category')?>";                     //分类列表
var basedata_category_type= "<?=site_url('basedata/category_type')?>";            //分类分类
var settings_goods_manage = "<?=site_url('settings/goods_manage')?>";       //新增修改商品
var settings_goods_batch  = "<?=site_url('settings/goods_batch')?>";        //批量选择商品
var basedata_goods = "<?=site_url('basedata/goods')?>";                     //商品
var settings_unit_manage = "<?=site_url('settings/unit_manage')?>";       //单位增修改
var settings_skins =  "<?=site_url('settings/skins  ')?>";  
</script>
<link href="<?=skin_url()?>/css/base.css" rel="stylesheet" type="text/css">
<link href="<?=skin_url()?>/css/<?=skin()?>/default.css?a" rel="stylesheet" type="text/css" id="defaultFile">
<script src="<?=skin_url()?>/js/common/tabs.js?ver=20190505"></script>

<script>
var CONFIG = {
	DEFAULT_PAGE: true,
	SERVICE_URL: '<?=base_url()?>'
};
//系统参数控制
var SYSTEM = {
	skin: "<?=skin()?>",         //皮肤
	curDate: '<?=time()?>',    //系统当前日期
    realName: '<?=$name?>',    //真实姓名
	rights: {},//权限列表
	billRequiredCheck: 0,  //是否启用单据审核功能  1：是、0：否
	requiredMoney: 0,      //是否启用资金功能  1：是、0：否
	taxRequiredCheck: 0,
	taxRequiredInput: 17,
	isAdmin:true,   //是否管理员
	main_url:"<?=site_url('home/main')?>",   //首页
	clear_url:"<?=site_url('home/clear')?>",   //清理系统缓存
};
//区分服务支持
var cacheList = {};	//缓存列表查询
//全局基础数据
(function(){
	/*
	 * 判断IE6，提示使用高级版本
	 */
	if(Public.isIE6) {
		 var Oldbrowser = {
			 init: function(){
				 this.addDom();
			 },
			 addDom: function() {
			 	var html = $('<div id="browser">您使用的浏览器版本过低，影响网页性能，建议您换用<a href="http://www.google.cn/chrome/intl/zh-CN/landing_chrome.html" target="_blank">谷歌</a>、<a href="http://download.microsoft.com/download/4/C/A/4CA9248C-C09D-43D3-B627-76B0F6EBCD5E/IE9-Windows7-x86-chs.exe" target="_blank">IE9</a>、或<a href=http://firefox.com.cn/" target="_blank">火狐浏览器</a>，以便更好的使用！<a id="bClose" title="关闭">x</a></div>').insertBefore('#container').slideDown(500); 
			 	this._colse();
			 },
			 _colse: function() {
				  $('#bClose').click(function(){
						 $('#browser').remove();
				 });
			 }
		 };
		 Oldbrowser.init();
	};
	getGoods();
	getUnitcostHide();
})();

//缓存商品信息
function getGoods() {
	if(SYSTEM.isAdmin || SYSTEM.rights.INVENTORY_QUERY) {
		Public.ajaxGet('<?=site_url('basedata/goods')?>', {}, function(data){
			if(data.status === 200) {
				SYSTEM.goodsInfo = data.data.rows;
			} else if (data.status === 250){
				SYSTEM.goodsInfo = [];
			} else {
				Public.tips({type: 1, content : data.msg});
			}
		});
	} else {
		SYSTEM.goodsInfo = [];
	}
};

function getUnitcostHide() {
    Public.ajaxGet('<?=site_url('sheet/unitcostHide')?>', {}, function (data) {
        if (data.status === 200) {
            SYSTEM.unitcostHide = data.data;
        }
    });
};

</script>
</head>
<body>
<div id="container" class="cf">
  <div id="col-side">
    <ul id="nav" class="cf">
      <li class="item item-purchase"> <a href="javascript:void(0);" class="purchase main-nav"><span class="arrow">&gt;</span></a>
        <div class="sub-nav-wrap">
          <ul class="sub-nav" id="purchase">
          </ul>
        </div>
      </li>
      <li class="item item-sales"> <a href="javascript:void(0);" class="sales main-nav"><span class="arrow">&gt;</span></a>
        <div class="sub-nav-wrap">
          <ul class="sub-nav" id="sales">
          </ul>
        </div>
      </li>
      <li class="item item-storage"> <a href="javascript:void(0);" class="storage main-nav"><span class="arrow">&gt;</span></a>
        <div class="sub-nav-wrap">
          <ul class="sub-nav" id="storage">
          </ul>
        </div>
      </li>           
      <li class="item item-setting"> <a href="javascript:void(0);" class="setting main-nav"><span class="arrow">&gt;</span></a>
        <div class="sub-nav-wrap group-nav group-nav-b0 setting-nav">
          <div class="nav-item">
            <h3>基础资料</h3>
            <ul class="sub-nav" id="setting-base">
            </ul>
          </div>
          <div class="nav-item">
            <h3>辅助资料</h3>
            <ul class="sub-nav" id="setting-auxiliary">
            </ul>
          </div>
          <div class="nav-item cf last">
            <h3>高级设置</h3>
            <ul class="sub-nav" id="setting-advancedSetting">
            </ul>
            <ul class="sub-nav" id="setting-advancedSetting-right">
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div id="col-main" >
    <div id="main-hd" class="cf" >
        <div class="tit"> <span class="company" id="" ><?=SITE_NAME?></span> <span class="period" id="period"></span> </div>
      <ul class="user-menu">
      	<li id="sysSkin">换肤</li>
        <li class="space">|</li>
        
      	<li><a href="javascript:void(0);" id="clear">清空缓存</a></li>
		<li class="space">|</li>
        <li><a href="<?=site_url('login/out')?>">退出</a></li>
      </ul>  
    </div>
    <div id="main-bd" >
      <div class="page-tab" id="page-tab">
      </div>
    </div>
  </div>
</div>
<div id="selectSkin" class="shadow dn">
	<ul class="cf">
    	<li><a id="skin-default"><span></span><small>经典</small></a></li>
        <li><a id="skin-blue"><span></span><small>丰收</small></a></li>
        <li><a id="skin-green"><span></span><small>小清新</small></a></li>
    </ul>
</div>
<script>
var list = {
    purchasePlan: {
         name: "采购计划",
         href: "<?=site_url('invpu/purchaseIndex')?>",
         target: "purchase"
        },
	purchase: {
		name: "采购单",
		href: "<?=site_url('invpu/add')?>",
		target: "purchase"
	},<?php
        if ($this->purview_model->checkpurview(96,true) == true){?>
        purchaseReview: {
            name: "<span style='color: red'>采购单审核</span>",
            href: "<?=site_url('invpu/reviewIndex')?>",
            target: "purchase"
        },
        <?php }?>
	purchaseList: {
		name: "采购记录",
		href: "<?=site_url('invpu')?>",
		target: "purchase"
	},
     purchaseOrder: {
         name: "报价单",
         href: "<?=site_url('sheet/add')?>",
         target: "sales"
      },<?php
        if ($this->purview_model->checkpurview(99,true) == true){?>
        sheetReview: {
            name: "<span style='color: red'>报价单审核</span>",
            href: "<?=site_url('sheet/reviewIndex')?>",
            target: "sales"
        },
        <?php }?>
     purchaseOrderList: {
         name: "报价单记录",
         href: "<?=site_url('sheet')?>",
         target: "sales"
     },
        <?php
        if ($this->purview_model->checkpurview(97,true) == true){?>
        salesReview: {
            name: "<span style='color: red'>销售单审核</span>",
            href: "<?=site_url('invsa/reviewIndex')?>",
            target: "sales"
        },
        <?php }?>
	salesList: {
		name: "销售记录",
		href: "<?=site_url('invsa')?>",
		target: "sales"
	},
	inventory: {
		name: "盘点",
		href: "<?=site_url('inventory')?>",
		target: "storage"
	},
	changeWarehouse: {
		name: "调仓",
		href: "<?=site_url('inventory/change')?>",
		target: "storage"
	},
	otherWarehouse: {
		name: "其他入库",
		href: "<?=site_url('invoi/in')?>",
		target: "storage"
	},
	otherWarehouseList: {
		name: "其他入库记录",
		href: "<?=site_url('invoi')?>",
		target: "storage"
	},
	otherOutbound: {
		name: "其他出库",
		href: "<?=site_url('invoi/out')?>",
		target: "storage"
	},
	otherOutboundList: {
		name: "其他出库记录",
		href: "<?=site_url('invoi/outindex')?>",
		target: "storage"
	},
        logisticsManage: {
            name: "物流信息管理",
            href: "<?=site_url('logistics/index')?>",
            target: "storage"
        },
	customerList: {
		name: "往来单位管理",
		href: "<?=site_url('betweenUnit')?>",
		target: "setting-base"
	},

	goodsList: {
            name: "仓库管理",
            href: "<?=site_url('stock')?>",
            target: "setting-base"
        },

	storageList: {
		name: "物料管理",
            href: "<?=site_url('bom')?>",
            target: "setting-base"
        },
   bomCategoryList: {
       name: "物料类别管理",
       href: "<?=site_url('bomCategory')?>",
       target: "setting-base"
   },

        MatTemplate: {
            name: "物料模板管理",
            href: "<?=site_url('MatTemplate')?>",
            target: "setting-base"
        },

	areaList: {
            name: "地区分类",
            href: "<?=site_url('area')?>",
            target: "setting-auxiliary"
        },
	customerCategoryList: {
		name: "往来单位类别",
		href: "<?=site_url('category')?>",
		target: "setting-auxiliary"
	},

   departmentList: {
            name: "部门",
            href: "<?=site_url('department')?>",
            target: "setting-auxiliary"
        },
            vendorCategoryList: {
            name: "供应商类别",
            href: "<?=site_url('category')?>?typeNumber=supplytype",
            target: "setting-auxiliary"
        },
        vendorCategoryList: {
            name: "工作中心",
            href: "<?=site_url('workcenter')?>",
            target: "setting-auxiliary"
        },
        wPCat: {
            name: "工作流程类别",
            href: "<?=site_url('wPCat')?>",
            target: "setting-auxiliary"
        },
        wPTemDesign: {
            name: "模板设计管理",
            href: "<?=site_url('wPTemDesign')?>",
            target: "setting-base"
        },
       matTemDesign: {
            name: "物料模板设计",
            href: "<?=site_url('matTemDesign')?>",
            target: "setting-base"
        },
        matEst: {
            name: "物料生产预估",
            href: "<?=site_url('matest')?>",
            target: "setting-base"
        },
   unitList: {
       name: "计量单位",
       href: "<?=site_url('unit')?>",
       target: "setting-auxiliary"
   },
        <?php
        if ($this->session->userdata('roleid') == 0){?>
        parameter: {
		name: "系统参数",
		href: "<?=site_url('settings/parameter')?>",
		target: "setting-advancedSetting"
	},
    <?php } ?>
	authority: {
		name: "员工权限",
		href: "<?=site_url('admin')?>",
		target: "setting-advancedSetting"
	},
	operationLog: {
		name: "操作日志",
		href: "<?=site_url('logs')?>",
		target: "setting-advancedSetting"
	},
	backup: {
		name: "备份与恢复",
		href: "<?=site_url('backup')?>",
		target: "setting-advancedSetting"
	}
},
	menu = {
		init: function(e) {
			this.obj = e;
			this.sublist = list
			this._initDom();
		},
		_initDom: function() {
				var e = this.sublist,
					t = {};
				t.target = {};
				for (var i in e) if (!e[i].disable) {
					var a = e[i];
						t.target[a.target] = this.obj.find("#" + a.target);
				var		r = t.target[a.target],
						o = a.id ? "" : "rel=pageTab",
						s = "<li><a " + ' tabid="' + a.target.split("-")[0] + "-" + i + '" ' + o + ' href="' + a.href + '">' + a.name + "</a></li>";
					r.append(s);
				}
		}
	};
</script>
<script src="<?=skin_url()?>/js/dist/default.js"></script>
</body>
</html>
