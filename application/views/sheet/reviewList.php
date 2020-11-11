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
        var settings_ =  "<?=site_url('settings/inventory')?>";
        var settings_skins =  "<?=site_url('settings/skins')?>";

        var invpu_lists = "<?=site_url('invpu/lists')?>";
        var invpu_add   = "<?=site_url('invpu/add')?>";
        var sheet_edit   = "<?=site_url('sheet/edit')?>";
        var logistics_export    = "<?=site_url('logistics/export')?>";
        var logistics_del    = "<?=site_url('logistics/del')?>";
        var logistics_lists  = "<?=site_url('logistics/lists')?>";
        var settings_sheet_info    = "<?=site_url('settings/sheet_info')?>";
        var sheet_sheetReviewList = "<?=site_url('sheet/sheetReviewList')?>";
        var sheet_review = "<?=site_url('sheet/review')?>";
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
    <div class="mod-search cf">
        <div class="fl">
            <ul class="ul-inline">
                <li>
                    <input type="text" id="matchCon" class="ui-input ui-input-ph" value="请输入订单编号或订单名称或付款条件">
                </li>
                <li>
                    <label>日期:</label>
                    <input type="text" id="beginDate" value="" class="ui-input ui-datepicker-input">
                    <i>-</i>
                    <input type="text" id="endDate" value="" class="ui-input ui-datepicker-input">
                </li>
                <li><a class="ui-btn" id="search">查询</a><a class="ui-btn dn" id="audit">审核通过</a><a class="ui-btn" id="reAudit">审核不通过</a><!--<a class="ui-btn ui-btn-refresh" id="refresh" title="刷新"><b></b></a>--></li>
            </ul>
        </div>
    </div>
    <!--  <div class="mod-toolbar-top cf">
        <div class="fl"><strong class="tit">仓库</strong></div>
        <div class="fr"><a class="ui-btn ui-btn-sp mrb" id="search">新增</a><a class="ui-btn" id="export">导出</a></div>
      </div>-->
    <div class="grid-wrap">
        <table id="grid">
        </table>
        <div id="page"></div>
    </div>
</div>
<script src="<?=skin_url()?>/js/dist/sheetReviewList.js?2"></script>
</body>
</html>