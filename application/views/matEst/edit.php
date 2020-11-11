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
    <script src="<?=skin_url()?>/js/common/common2.js?ver=20140815"></script>
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

        var wPTemDesign_edit    = "<?=site_url('wPTemDesign/edit')?>";
        var settings_goods_templ_batch  = "<?=site_url('settings/goods_templ_batch')?>";
        var invpu_lists = "<?=site_url('invpu/lists')?>";
        var matEst_info   = "<?=site_url('matest/info')?>";
        var logistics_export    = "<?=site_url('logistics/export')?>";
        var design_del    = "<?=site_url('design/del')?>";
        var design_lists  = "<?=site_url('design/lists')?>";
        var design_add    = "<?=site_url('design/add')?>";
        var matEst_edit    = "<?=site_url('matest/edit')?>";
        var basedata_getGroupContractNum  = "<?=site_url('basedata/getGroupContractNum')?>";
    </script>
    <style>
        #matchCon { width: 280px; }
        #print{margin-left:10px;}
        a.ui-btn{margin-left:10px;}
        #reAudit,#audit{display:none;}
    </style>
</head>

<body>
<div class="wrapper">
    <!--  <div class="mod-toolbar-top cf">
        <div class="fl"><strong class="tit">仓库</strong></div>
        <div class="fr"><a class="ui-btn ui-btn-sp mrb" id="search">新增</a><a class="ui-btn" id="export">导出</a></div>
      </div>-->
    <div id="initCombo" class="dn">
        <input type="text" class="textbox goodsAuto" name="goods" autocomplete="off">
        <input type="text" class="textbox storageAuto" name="storage" autocomplete="off">
    </div>
    <div class="grid-wrap">
        <table id="grid">
        </table>
        <div id="page"></div>
    </div>
    <div class="cf" id="bottomField">
        <div class="fr" id="toolBottom"></div>
    </div>
</div>
<script src="<?=skin_url()?>/js/dist/matEstEdit.js"></script>
</body>
</html>
