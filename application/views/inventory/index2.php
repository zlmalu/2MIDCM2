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
try{
	document.domain = '<?=base_url()?>';
}catch(e){
	//console.log(e);
}
</script>

<script type="text/javascript">
var SCHEME= "<?=skin()?>";
var icon_url = "<?=skin_url()?>/css/base/dialog/icons/";                      
var settings_customer_manage = "<?=site_url('settings/customer_manage')?>";   
var settings_vendor_manage = "<?=site_url('settings/vendor_manage')?>";       
var settings_vendor_batch = "<?=site_url('settings/vendor_batch')?>";         
var settings_customer_batch = "<?=site_url('settings/customer_batch')?>";   
var basedata_settlement = "<?=site_url('basedata/settlement')?>";            
var settings_settlement_manage = "<?=site_url('settings/settlement_manage')?>";       
var basedata_category = "<?=site_url('basedata/category')?>";                     
var basedata_category_type= "<?=site_url('basedata/category_type')?>";         
var settings_goods_manage = "<?=site_url('settings/goods_manage')?>";     
var settings_goods_batch  = "<?=site_url('settings/goods_batch')?>";       
var basedata_goods = "<?=site_url('basedata/goods')?>";                     
var basedata_unit  = "<?=site_url('basedata/unit')?>";                      
var settings_unit_manage = "<?=site_url('settings/unit_manage')?>";    
var basedata_contact  = "<?=site_url('basedata/contact')?>";             
var basedata_getUser  = "<?=site_url('basedata/getUser')?>";
var settings_inventory =  "<?=site_url('settings/inventory')?>";
var settings_skins =  "<?=site_url('settings/skins')?>";             
var basedata_goods = "<?=site_url('basedata/goods')?>";                     //商品
        var basedata_storehouse  = "<?=site_url('basedata/storehouse')?>";

var inventory_lists= "<?=site_url('inventory/lists')?>";
var inventory_query= "<?=site_url('inventory/query')?>";
var inventory_export= "<?=site_url('inventory/export')?>";
var inventory_generator = "<?=site_url('inventory/generator')?>";
var inventory_change = "<?=site_url('inventory/change')?>";
var inventory_inventoryLock = "<?=site_url('inventory/inventoryLock')?>";
var inventory_inventoryUnLock = "<?=site_url('inventory/inventoryUnLock')?>";
</script>
<style>
.mod-search{ position:relative; }
#custom{ position:absolute; top:0; right:0; }
.ui-jqgrid-bdiv .ui-state-highlight { background: none; }
</style>
</head>

<body class="min-w">
<div class="container" style="width:1500px;position:absolute;left:300px;top:200px">
<div style="float:left">
  <label  class="tit" for="filter-user" style="float:left">物料:</label>
                <div class="ctn-wrap"><span class="ui-combo-wrap" id="goods" style="float:left">
                    <input type="text" name="filter-user" id="filter-user1" class="input-txt" autocomplete="off" />
                    <span class="trigger"></span>
                    </span></div>
</div>
<div style="float:left">
  <label  class="tit" for="filter-user" style="float:left">从仓库:</label>
                <div class="ctn-wrap"><span class="ui-combo-wrap" id="fromStorehouse">
                    <input type="text" name="filter-user" id="filter-user2" class="input-txt" autocomplete="off" />
                    <span class="trigger"></span>
</div>
</div>
<div style="float:left">
  <label  class="tit" for="filter-user" style="float:left">到仓库:</label>
                <div class="ctn-wrap"><span class="ui-combo-wrap" id="toStorehouse">
                    <input type="text" name="filter-user" id="filter-user" class="input-txt" autocomplete="off" />
                    <span class="trigger"></span>
</div>
</div>
<div style="float:left">
  <label  class="tit" for="filter-user" style="float:left">数量:</label>
<div class="ctn-wrap"><span class="ui-combo-wrap" id="headName">
                    <input type="text" name="filter-user" id="number" class="input-txt" autocomplete="off" />
</div>
</div>
</div>
<div style="position:absolute;left:1000px;top:300px">
        <a class="ui-btn ui-btn-sp mrb" id="search">提交</a>
</div>
<script src="<?=skin_url()?>/js/dist/inventoryChange.js?77779"></script>
</body>
</html>
