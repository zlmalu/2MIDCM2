<?php if(!defined('BASEPATH')) exit('No direct script access allowed');?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Editable TreeGrid - jQuery EasyUI Demo</title>
    <link rel="stylesheet" type="text/css" href="<?=skin_url()?>/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="<?=skin_url()?>/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="<?=skin_url()?>/css/demo.css">
    <script src="<?=skin_url()?>/js/common/libs/jquery/jquery-1.10.2.min.js"></script>
    <script src="<?=skin_url()?>/js/common/libs/jquery/jquery.easyui.min.js"></script>
</head>
<body>
<div style="margin:20px 0;">
    <a href="javascript:void(0)" class="easyui-linkbutton" onclick="edit()">编辑</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" onclick="save()">保存</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" onclick="cancel()">取消</a>
</div>
<table id="tg" class="easyui-treegrid" title="ZC-G370分拆表" style="width:1200px;height:450px"
       data-options="
				iconCls: 'icon-ok',
				rownumbers: true,
				animate: true,
				collapsible: true,
				collapsed:false,
				fitColumns: true,
				url: '/2MIDCM2/data/json/product.json',
				method: 'get',
				idField: 'id',
				treeField: 'name',
				showFooter: true
			">
    <thead>
    <tr>
        <th data-options="field:'name',width:380,editor:'false'">产品、半成品、原料</th>
        <th data-options="field:'number',width:60,editor:'numberbox'">数量</th>
        <th data-options="field:'attribute',width:280,editor:'text'">属性</th>
        <th data-options="field:'attribute_introduction',width:280,editor:'false'">属性说明</th>
        <th data-options="field:'specifications',width:280,editor:'text'">规格</th>
        <th data-options="field:'specifications_introduction',width:280,editor:'false'">规格说明</th>
    </tr>
    </thead>
</table>
<script type="text/javascript">
    var productToBom_recive= "<?=site_url('productToBom/recive')?>";
    function formatProgress(value){
        if (value){
            var s = '<div style="width:100%;border:1px solid #ccc">' +
                '<div style="width:' + value + '%;background:#cc0000;color:#fff">' + value + '%' + '</div>'
            '</div>';
            return s;
        } else {
            return '';
        }
    }
    var editingId;
    function edit(){
        if (editingId != undefined){
            $('#tg').treegrid('select', editingId);
            return;
        }
        var row = $('#tg').treegrid('getSelected');
        if(row.id!=13){
            var tt=$('#tg').datagrid('getColumnOption', 'specifications');
            tt.editor={type:'false'};
            var tt=$('#tg').datagrid('getColumnOption', 'number');
            tt.editor={type:'text'};
            var tt=$('#tg').datagrid('getColumnOption', 'attribute');
            tt.editor={type:'text'};
        }else{
            var tt=$('#tg').datagrid('getColumnOption', 'specifications');
            tt.editor={type:'text'};
            var tt=$('#tg').datagrid('getColumnOption', 'number');
            tt.editor={type:'false'};
            var tt=$('#tg').datagrid('getColumnOption', 'attribute');
            tt.editor={type:'false'};
            $('#tg').datagrid('beginEdit', row.id);
            var opts = $('#tg').datagrid('getEditor',{index:row.id,field:'specifications'});
            $(opts.target).focus();
            $(opts.target).val("450*400*1500");

        }
        if (row&&row.id<100){
            editingId = row.id
            $('#tg').treegrid('beginEdit', editingId);
        }
    }
    function save(){
        if (editingId != undefined){

            var row = $('#tg').treegrid('getSelected');
            var t = $('#tg');
            t.treegrid('endEdit', editingId);
            editingId = undefined;
            var persons = 0;
            var rows = t.treegrid('getChildren');
            for(var i=0; i<rows.length; i++){
                var p = parseInt(rows[i].persons);
                if (!isNaN(p)){
                    persons += p;
                }
            }
            var frow = t.treegrid('getFooterRows')[0];
            frow.persons = persons;
            t.treegrid('reloadFooter');
        }
        $.ajax({
            //请求方式
            type : "POST",
            //请求的媒体类型
            //请求地址
            url : "productToBom/handleProduct",
            //数据，json字符串
            data : {"attribute":row.attribute,"rowid":row.id,"name":row.name,"number":row.number,"specifications":row.specifications},
            //请求成功
            success : function(result) {
                var obj = eval("("+result+")");
                if (row){
                    for(var i=0;i<obj.length;i++){
                        $('#tg').treegrid('append', {
                            parent: obj[i]['_parentId'],
                            data:[
                                {
                                    "id":obj[i]["id"],
                                    "name":obj[i]["name"],
                                    "number":obj[i]['number'],
                                    "attribute":obj[i]["attribute"],
                                    "attribute_introduction":obj[i]["attribute_introduction"],
                                    "specifications_introduction":obj[i]["specifications_introduction"]
                                }
                            ]
                        });}
                }
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    }
    function cancel(){
        if (editingId != undefined){
            $('#tg').treegrid('cancelEdit', editingId);
            editingId = undefined;
        }
    }
</script>

</body>
</html>
