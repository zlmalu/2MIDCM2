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
        let attrNum = 0;
        let attrNum1 = 0;
        // let isInput = 0;
        var SCHEME= "<?=skin()?>";
        var icon_url = "<?=skin_url()?>/css/base/dialog/icons/";
        var MatTemplate_save  = "<?=site_url('MatTemplate/save')?>";
        var settings_customer_manage = "<?=site_url('settings/customer_manage')?>";
        var settings_vendor_manage = "<?=site_url('settings/vendor_manage')?>";
        var settings_vendor_batch = "<?=site_url('settings/vendor_batch')?>";
        var settings_customer_batch = "<?=site_url('settings/customer_batch')?>";
        var basedata_settlement = "<?=site_url('basedata/settlement')?>";
        var settings_settlement_manage = "<?=site_url('settings/settlement_manage')?>";
        var basedata_category_type= "<?=site_url('basedata/category_type')?>";
        var settings_goods_manage = "<?=site_url('settings/goods_manage')?>";
        var settings_goods_batch  = "<?=site_url('settings/goods_batch')?>";
        var basedata_goods = "<?=site_url('basedata/goods')?>";
        var basedata_unit  = "<?=site_url('basedata/unit')?>";
        var settings_unit_manage = "<?=site_url('settings/unit_manage')?>";
        var basedata_contact  = "<?=site_url('basedata/contact')?>";
        var settings_inventory =  "<?=site_url('settings/inventory')?>";
        var settings_skins =  "<?=site_url('settings/skins')?>";
        var category_save = "<?=site_url('category/save')?>";
        var basedata_category = "<?=site_url('basedata/category')?>";  //分类接口
        var basedata_goods_query = "<?=site_url('basedata/goods_query')?>";
        var basedata_goods_checkname = "<?=site_url('basedata/goods_checkname')?>";
        var basedata_goods_getnextno = "<?=site_url('basedata/goods_getnextno')?>";
        var matTemDesign_init = "<?=site_url('matTemDesign/init')?>";
        var matTemDesign_initNextLevel = "<?=site_url('matTemDesign/initNextLevel')?>";
        var basedata_cat1List = "<?=site_url('basedata/cat1List')?>";
        var basedata_cat2List = "<?=site_url('basedata/cat2List')?>";
        var category_lists = "<?=site_url('category/lists')?>";
        var matTemDesign_level1Change = "<?=site_url('matTemDesign/level1Change')?>";
        var MatTemplate_initUnitClass = "<?=site_url('MatTemplate/initUnitClass')?>";
        var MatTemplate_findVal = "<?=site_url('MatTemplate/findVal')?>";
        var basedata_area = "<?=site_url('basedata/area')?>";
        var matTemDesign_save    = "<?=site_url('matTemDesign/save')?>";
        var matTemDesign_del    = "<?=site_url('matTemDesign/del')?>";
    </script>
    <!--    <link rel="stylesheet" href="<?/*=skin_url()*/?>/js/common/plugins/validator/jquery.validator.css">
    <script type="text/javascript" src="<?/*=skin_url()*/?>/js/common/plugins/validator/jquery.validator.js"></script>
    <script type="text/javascript" src="<?/*=skin_url()*/?>/js/common/plugins/validator/local/zh_CN.js"></script>-->
    <style>
        body{background: #fff;}
        .ui-combo-wrap{position:static;width: 200px}
        .mod-form-rows .label-wrap{font-size:12px;}
        .manage-wrapper{margin:20px auto 0;width:600px;}
        .manage-wrap .ui-input{width: 198px;}
        .base-form{*zoom: 1;margin:0 -10px;}
        .base-form:after{content: '.';display: block;clear: both;height: 0;overflow: hidden;}
        .base-form .row-item{float: left;width: 290px;height: 31px;margin: 0 10px;overflow: visible;padding-bottom:15px;}
        .manage-wrap textarea.ui-input{width: 588px;height: 60px;*vertical-align:auto;overflow: hidden;}

        .contacters h3{margin-bottom: 10px;font-weight: normal;}
        .ui-jqgrid-bdiv .ui-state-highlight { background: none; }
        .operating .ui-icon{ margin:0; }
        .ui-icon-plus { background-position:-80px 0; }
        .ui-icon-trash { background-position:-64px 0; }
        .mod-form-rows .ctn-wrap{overflow: visible;;}
        .mod-form-rows .pb0{margin-bottom:0;}
        .manage-wrap .attr-input{width: 100px;height:25px}
    </style>
    <style>
        #container{
            /*            width:380px;
                        margin:20px auto;
                        padding:15px;
                        background-color:#eee;
                        border-radius: 15px;*/
        }
        /** 新增按钮 **/
        #addVar{
            margin:0 0 0 52px;
            padding:5px;
            display:inline-block;
            background-color:#3A9668;
            color:#f1f1f1;
            border:1px solid #005;
            border-radius: 4px;
        }
        /** 删除按钮 **/
        .removeVar{
            margin:auto;
            padding:5px;
            display:inline-block;
            background-color:#B02109;
            color:#f1f1f1;
            border:1px solid #005;
            border-radius: 4px;
        }

        #addVar:hover, .removeVar:hover{
            cursor: pointer;
        }

        .alignRight{
            text-align: right;
        }

        input, textarea{
            padding:5px;
            font-size: 16px;
        }
    </style>
</head>
<body style="background-color:#f4f4f4">
<div class="manage-wrapper">
    <div id="manage-wrap" class="manage-wrap">
        <form id="manage-form " action="">
            <ul class="mod-form-rows base-form cf" id="base-form">
                <li class="row-item">
                    <div class="label-wrap"><label for="BOMTemplName">名称</label></div>
                    <div class="ctn-wrap"><input type="text" value="" class="ui-input" name="BOMTemplName" id="BOMTemplName"></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"> <label  class="tit" for="filter-user">模板名称：</label></div>
                    <div class="ctn-wrap"><span class="ui-combo-wrap" id="goodsTempl">
                    <input type="text" name="filter-user" id="filter-user"  class="input-txt" style="width:172px" autocomplete="off" />
                    <span class="trigger"></span>
                    </span></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"> <label  class="tit" for="filter-user">上级物料</label></div>
                    <div class="ctn-wrap"><span class="ui-combo-wrap" id="goods">
                    <input type="text" name="filter-user" id="filter-user" class="input-txt" style="width:172px" autocomplete="off" />
                    <span class="trigger"></span>
                    </span></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"> <label  class="tit" for="filter-user">下级物料</label></div>
                    <div class="ctn-wrap"><span class="ui-combo-wrap" id="goods1">
                    <input type="text" name="filter-user" id="filter-user1" class="input-txt" style="width:172px" autocomplete="off" />
                    <span class="trigger"></span>
                    </span></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"><label for="Desc">下位物料数量</label></div>
                    <div class="ctn-wrap"><input type="text" value="" class="ui-input" name="Desc" id="Amount"></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"><label for="Desc">描述</label></div>
                    <div class="ctn-wrap"><input type="text" value="" class="ui-input" name="Desc" id="Desc"></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"><label for="Desc">因子描述</label></div>
                    <div class="ctn-wrap"><input type="text" value="" class="ui-input" name="Desc1" id="Desc1"></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"><label for="AttrNum">函数个数</label></div>
                    <div class="ctn-wrap"><input type="text" onkeyup="value=value.match(/20|1\d|[1-9]/,'')" class="ui-input" name="AttrNum"  onfocus="inputFocus()" onblur="numberChange()" id="AttrNum" placeholder="请输入1-20的数字"></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"><label for="AttrNum">因子个数</label></div>
                    <div class="ctn-wrap"><input type="text" onkeyup="value=value.match(/11|10|[1-9]/,'')" class="ui-input" name="AttrNum1"  onfocus="inputFocus1()" onblur="numberChange1()" id="AttrNum1" placeholder="请输入1-11的数字"></div>
                </li>
            </ul>
            <ul class="mod-form-rows base-form cf" id="attr-form">
        <!--        <li class="row-item">
                    <div class="label-wrap"> <label  class="tit" for="Attr1">函数1：</label></div>
                    <div class="ctn-wrap"><span class="ui-combo-wrap">
                    <input type="text" name="filter-user" id="Attr1" class="Attr1" autocomplete="off" />
                    <span class="trigger"></span>
                    </span></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"> <label  class="tit" for="Attr2">函數2：</label></div>
                    <div class="ctn-wrap"><span class="ui-combo-wrap">
                    <input type="text" name="filter-user" id="Attr2" class="Attr2" autocomplete="off" />
                    <span class="trigger"></span>
                    </span></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"> <label  class="tit" for="Attr3">函數3：</label></div>
                    <div class="ctn-wrap"><span class="ui-combo-wrap">
                    <input type="text" name="filter-user" id="Attr3" class="input-txt" autocomplete="off" />
                    <span class="trigger"></span>
                    </span></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"> <label  class="tit" for="Attr4">函數4：</label></div>
                    <div class="ctn-wrap"><span class="ui-combo-wrap">
                    <input type="text" name="filter-user" id="Attr4" class="input-txt" autocomplete="off" />
                    <span class="trigger"></span>
                    </span></div>
                </li>
                <li class="row-item">
                    <div class="label-wrap"> <label  class="tit" for="Attr5">函數5：</label></div>
                    <div class="ctn-wrap"><span class="ui-combo-wrap">
                    <input type="text" name="filter-user" id="Attr5" class="input-txt" autocomplete="off" />
                    <span class="trigger"></span>
                    </span></div>
                </li>
        -->    </ul>
        </form>
    </div>
</div>
<script src="<?=skin_url()?>/js/dist/matTemDesignManage.js?3387"></script>
</body>
</html>
