<?php if(!defined('BASEPATH')) exit('No direct script access allowed');?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1280, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="renderer" content="webkit|ie-comp|ie-stand">
<title>在线进销存</title>
<link href="<?=skin_url()?>/css/common.css?ver=20140815" rel="stylesheet" type="text/css">
<link href="<?=skin_url()?>/css/<?=skin()?>/ui.min.css?ver=20140815" rel="stylesheet">
<script src="<?=skin_url()?>/js/common/libs/jquery/jquery-1.10.2.min.js"></script>
<script src="<?=skin_url()?>/js/common/libs/json2.js"></script>
<script src="<?=skin_url()?>/js/common/common.js?ver=20140815"></script>
<script src="<?=skin_url()?>/js/common/grid.js?ver=20140815"></script>
<script src="<?=skin_url()?>/js/common/plugins.js?ver=20140815"></script>
<script src="<?=skin_url()?>/js/common/plugins/jquery.dialog.js?self=true&ver=20140815"></script>
<script type="text/javascript">
var SCHEME= "<?=skin()?>";
var icon_url = "<?=skin_url()?>/css/base/dialog/icons/";                      //图片路径
var settings_customer_manage = "<?=site_url('settings/customer_manage')?>";   //新增修改客户 
var settings_vendor_manage = "<?=site_url('settings/vendor_manage')?>";       //新增供应商
var settings_vendor_batch = "<?=site_url('settings/vendor_batch')?>";         //批量选择供应商 
var basedata_settlement = "<?=site_url('basedata/settlement')?>";             //结算方式列表
var settings_settlement_manage = "<?=site_url('settings/settlement_manage')?>";       //新增修改结算方式
var basedata_category = "<?=site_url('basedata/category')?>";                     //分类列表
var basedata_category_type= "<?=site_url('basedata/category_type')?>";            //分类分类
var settings_goods_manage = "<?=site_url('settings/goods_manage')?>";       //新增修改商品
var settings_goods_batch  = "<?=site_url('settings/goods_batch')?>";        //批量选择商品
var settings_betweenUnit_batch  = "<?=site_url('settings/betweenUnit_batch')?>"; //批量选择往来单位
var settings_order_batch  = "<?=site_url('settings/order_batch')?>";        //批量选择订单
var basedata_goods = "<?=site_url('basedata/goods')?>";                     //商品
var basedata_unit  = "<?=site_url('basedata/unit')?>";                      //单位
var settings_unit_manage = "<?=site_url('settings/unit_manage')?>";       //单位增修改 
var basedata_contact  = "<?=site_url('basedata/contact')?>";              //客户、供应商列表
var settings_inventory =  "<?=site_url('settings/inventory')?>";          //单库存查询
</script>
<link href="<?=skin_url()?>/css/<?=skin()?>/index.css?ver=1" rel="stylesheet" type="text/css" id="indexFile">
<script src="<?=skin_url()?>/js/dist/template.js"></script>

</head>
<body>
<div id="hd" class="cf">
  <div class="fl welcome cf">
	  <strong><span id="greetings"></span>，<span id="username"></span></strong>
	  <a tabTxt="权限管理" parentOpen="true" rel="pageTab" href="<?=site_url('admin/edit')?>">账号管理</a>
  </div>
  <div class="fr storages-search"><label for="">库存查询</label><span class="ui-search"><input type="text"  placeholder="输入物料名字或型号" id="goodsAuto" class="ui-input" /></span><span id="stockSearch"></span></div>
</div>
<script>
var greetings = "", cur_time = new Date().getHours();
if(cur_time >= 0 && cur_time <= 4 ) {
	greetings = "已经夜深了，请注意休息"
} else if (cur_time > 4 && cur_time <= 7 ) {
	greetings = "早上好";
} else if (cur_time > 7 && cur_time < 12 ) {
	greetings = "上午好";
} else if (cur_time >= 12 && cur_time <= 18 ) {
	greetings = "下午好";
} else {
	greetings = "晚上好";
};
$("#greetings").text(greetings);
$("#username").text(parent.SYSTEM.realName);
</script>
<div id="bd" class="index-body cf">
  <div class="col-main">
    <div class="main-wrap cf">
      <ul class="quick-links">
        <li class="purchase-purchase">
        	<a tabid="purchase-purchase" data-right="PU_ADD" tabTxt="购货单" parentOpen="true" rel="pageTab" href="<?=site_url('invpu/add')?>"><span></span>购货</a>
        </li>
          <li class="sales-sales">
              <a tabid="sales-sales" data-right="SA_ADD" tabTxt="报价单" parentOpen="true" rel="pageTab" href="<?=site_url('sheet/add')?>"><span></span>报价</a>
          </li>
       <li class="storage-transfers">
        	<a tabid="storage-change" data-right="PD_GENPD" tabTxt="调拨单" parentOpen="true" rel="pageTab" href="<?=site_url('inventory/change')?>"><span></span>仓库调拨</a>
        </li>
        <li class="storage-inventory">
        	<a tabid="storage-inventory" data-right="PD_GENPD" tabTxt="盘点" parentOpen="true" rel="pageTab" href="<?=site_url('inventory')?>"><span></span>库存盘点</a>
        </li>
        <li class="storage-otherWarehouse">
        	<a tabid="storage-otherWarehouse" data-right="IO_ADD" tabTxt="其他入库" parentOpen="true" rel="pageTab" href="<?=site_url('invoi/in')?>"><span></span>其他入库</a>
        </li>
        <li class="storage-otherOutbound">
        	<a tabid="storage-otherOutbound" data-right="OO_ADD" tabTxt="其他出库" parentOpen="true" rel="pageTab" href="<?=site_url('invoi/out')?>"><span></span>其他出库</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="col-extra">
    <div class="extra-wrap">
      <h2>快速查看</h2>
      <div class="list">
        <ul>
            <li><a tabid="sales-salesList" data-right="SA_QUERY" tabTxt="销售记录" parentOpen="true" rel="pageTab" href="<?=site_url('invsa')?>">销售记录</a></li>
            <li><a tabid="purchase-salesList" data-right="PU_QUERY" tabTxt="采购记录" parentOpen="true" rel="pageTab" href="<?=site_url('invpu')?>">采购记录</a></li>
        	<li><a tabid="storage-otherWarehouseList" data-right="IO_QUERY" tabTxt="其他入库记录" parentOpen="true" rel="pageTab" href="<?=site_url('invoi')?>">其他入库记录</a></li>
        	<li><a tabid="storage-otherOutboundList" data-right="OO_QUERY" tabTxt="其他出库记录" parentOpen="true" rel="pageTab" href="<?=site_url('invoi/outindex')?>">其他出库记录</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
<script>
Public.pageTab();
reportParam();
function reportParam(){
	$("[tabid^='report']").each(function(){
		var dateParams = "beginDate="+parent.SYSTEM.beginDate+"&endDate="+parent.SYSTEM.endDate;
		var href = this.href;
		href += (this.href.lastIndexOf("?")===-1) ? "?" : "&";
		if($(this).html() === '商品库存余额表'){
			this.href = href + "beginDate="+parent.SYSTEM.startDate+"&endDate="+parent.SYSTEM.endDate;
		}
		else{
			this.href = href + dateParams;
		}
	});
}

var goodsCombo = Business.goodsCombo($('#goodsAuto'), {
	extraListHtml: ''
});


$('#stockSearch').click(function(e){
    var id = goodsCombo.getValue();
	var text = $('#goodsAuto').val();
	Business.forSearch(id, text);
});

</script>
</body>
</html>
