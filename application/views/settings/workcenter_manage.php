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
var settings_inventory =  "<?=site_url('settings/inventory')?>";          
var settings_skins =  "<?=site_url('settings/skins')?>";
var workcenter_save= "<?=site_url('workcenter/save')?>";
var basedata_admin = "<?=site_url('basedata/admin')?>";

var unit_save = "<?=site_url('unit/save')?>";
</script>
<style>
body{background: #fff;}
.manage-wrap{margin: 20px auto 10px;width: 300px;}
.manage-wrap .ui-input{width: 200px;font-size:14px;}
</style>
</head>
<body>
<div id="manage-wrap" class="manage-wrap">
	<form id="manage-form" action="">
		<ul class="mod-form-rows">
			<li class="row-item">
				<div class="label-wrap"><label for="name">中心名称:</label></div>
				<div class="ctn-wrap"><input type="text" value="" class="ui-input" name="name" id="name"></div>
			</li>
            <li class="row-item">
                <div class="label-wrap"><label for="desc">描述:</label></div>
                <div class="ctn-wrap"><input type="text" value="" class="ui-input" name="desc" id="desc" maxlength="200"></div>
            </li>
<!--            <li class="row-item">
                <div class="label-wrap"><label for="headName">负责人:</label></div>
                <div class="ctn-wrap"><input type="text" value="" class="ui-input" name="headName" id="headName" ></div>
            </li>-->

            <li class="row-item">
                <div class="label-wrap"> <label  class="tit" for="filter-user">负责人：</label></div>
                <div class="ctn-wrap"><span class="ui-combo-wrap" id="headName">
                    <input type="text" name="filter-user" id="filter-user" class="input-txt" autocomplete="off" />
                    <span class="trigger"></span>
                    </span></div>
            </li>


            <li class="row-item">
                <div class="label-wrap"><label for="IsKey">是否关键:</label></div>
                <div class="ctn-wrap">
                    <select name="IsKey" id="IsKey" style="height: 30px">
                        <option value =0 selected="selected">不关键</option>
                        <option value =1>关键</option>
                    </select></div>
            </li>


<!--            <li class="row-item">
                <div class="label-wrap"><label for="IsKey">是否关键:</label></div>
                <div class="ctn-wrap"><input type="text" value="" class="ui-input" name="IsKey" id="IsKey"></div>
            </li>-->
		</ul>
	</form>
</div>
<script src="<?=skin_url()?>/js/dist/workcenterManage.js?2"></script>
</body>
</html>