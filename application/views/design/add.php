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
        var settings_invsa_batch  = "<?=site_url('settings/invsa_batch')?>";
        var basedata_goods = "<?=site_url('basedata/goods')?>";
        var basedata_unit  = "<?=site_url('basedata/unit')?>";
        var settings_invsa_manage = "<?=site_url('settings/unit_manage')?>";
        var basedata_contact  = "<?=site_url('basedata/contact')?>";
        var settings_inventory =  "<?=site_url('settings/inventory')?>";
        var settings_skins =  "<?=site_url('settings/skins')?>";
        var settings_select_vendor =  "<?=site_url('settings/select_vendor')?>";

        var design_lists = "<?=site_url('design/lists')?>";
        var design_add   = "<?=site_url('design/add')?>";
        var design_edit   = "<?=site_url('design/edit')?>";
        var design_del   = "<?=site_url('design/del')?>";
        var api_logistics_print = "<?=site_url('api/invpu_print')?>";
        var plug_down = "<?=base_url()?>/install_lodop32.rar";
        var settings_goods_batch  = "<?=site_url('settings/goods_batch')?>";
        var basedata_getGroupContractNum  = "<?=site_url('basedata/getGroupContractNum')?>";
    </script>
    <script language="javascript" src="<?=skin_url()?>/js/common/plugins/print/LodopFuncs.js?2"></script>
    <link href="<?=skin_url()?>/css/<?=skin()?>/bills.css" rel="stylesheet" type="text/css">
    <style>
        #bottomField{line-height:30px;}
        #bottomField label{width: 75px;display: inline-block;}
        .con-footer{padding:10px 0 0 0;}
    </style>
</head>

<body>
<div class="wrapper">
    <div class="mod-toolbar-top mr0 cf dn" id="toolTop"></div>
    <div class="bills" style="width:1300px;">
        <div class="con-header">
            <dl class="cf">
                <dd class="pct30">
                    <div class="ui-combo-wrap" id="customer" style="display: none">
                    </div>
                </dd>
            </dl>
        </div>
        <div class="grid-wrap">
            <table id="grid">
            </table>
            <div id="page"></div>
        </div>
        <div class="cf" id="bottomField">
            <div class="fr" id="toolBottom"></div>
        </div>
        <div id="mark"></div>
    </div>

    <div id="initCombo" class="dn">
        <input type="text" class="textbox goodsAuto" name="goods" autocomplete="off">
        <input type="text" class="textbox storageAuto" name="storage" autocomplete="off">
    </div>
    <div id="storageBox" class="shadow target_box dn">
    </div>
</div>
<script src="<?=skin_url()?>/js/dist/design.js?22"></script>
</body>
</html>


