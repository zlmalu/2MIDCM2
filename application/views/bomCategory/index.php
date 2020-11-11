<?php if (!defined('BASEPATH')) exit('No direct script access allowed');?>
<!doctype html>
<html>
<head>
    <title>ZTREE DEMO - select menu</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <script type="text/javascript" src="<?=skin_url()?>/js/common/plugins/zTree/js/jquery-1.4.4.min.js"></script>
    <link rel="stylesheet" href="<?=skin_url()?>/js/common/plugins/zTree/css/demo.css" type="text/css">
    <link rel="stylesheet" href="<?=skin_url()?>/js/common/plugins/zTree/css/zTreeStyle/zTreeStyle.css" type="text/css">
<link href="<?=skin_url()?>/css/<?=skin()?>/index.css?ver=1" rel="stylesheet" type="text/css" id="indexFile">
    <script type="text/javascript" src="<?=skin_url()?>/js/common/libs/jquery/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="<?=skin_url()?>/js/common/plugins/zTree/js/jquery.ztree.core-3.5.js"></script>
    <script type="text/javascript" src="<?=skin_url()?>/js/common/plugins/zTree/js/jquery.ztree.excheck-3.5.js"></script>
    <script type="text/javascript" src="<?=skin_url()?>/js/common/plugins/zTree/js/jquery.ztree.exedit-3.5.js"></script>
    <script src="<?=skin_url()?>/js/common/common.js?ver=20140815"></script>
    <link href="<?=skin_url()?>/css/<?=skin()?>/ui.min.css?ver=20140815" rel="stylesheet">
    <script type="text/javascript">

        var Public = Public || {};
        var bomCategory_lists = "<?=site_url('bomCategory/lists')?>";
        var bomCategory_del = "<?=site_url('bomCategory/del')?>";
        var bomCategory_save= "<?=site_url('bomCategory/save')?>";

        var setting = {
            view: {
                dblClickExpand: false,
                addHoverDom: addHoverDom
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            check: {
                enable: true
            },
            callback: {
                onRightClick: OnRightClick,
                beforeRename: beforeRename
            }
        };
        function beforeRename(treeId, treeNode, newName) {
            var param = JSON.stringify({
                "id": treeNode.id,
                "name": newName,
                "parentId": treeNode.pId,
                "act": "update"
            });
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = zTree.getSelectedNodes();
            $.ajax({
                type: "post",
                url: bomCategory_save,
                dataType: 'json',
                data: {
                    act: "update",
                    Name: newName,
                    Area_ID: treeNode.id
                },
                success: function (result) {
                    //强行加载父节点
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                    var nodes = treeObj.getSelectedNodes();
                    treeObj.reAsyncChildNodes(null, "refresh", true);
                    if (result.status == -1) alert("操作失败！");
                },
                error: function () {
                    alert('Error loading HTML document');
                }
            });
            $("#rMenu2").css({ "visibility": "hidden" });
        }

        function initialStr (){
            var str = "";
            $.ajax({
                type: "get",
                async:false,
                dataType: "json",
                url: bomCategory_lists,
                success: function (result) {
                    if(200 ===result.status && result){
                        str = result.data.items;
                    }
                }
            });
            return str;
        }
        var zNodes = initialStr();

        function OnRightClick(event, treeId, treeNode) {
            if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                zTree.cancelSelectedNode();
                showRMenu("root", event.clientX, event.clientY);
            } else if (treeNode && !treeNode.noR) {
                zTree.selectNode(treeNode);
                showRMenu("node", event.clientX, event.clientY);
            }
        }

        //        function showRMenu(type, x, y) {
        //            $("#rMenu ul").show();
        //            if (type == "root") {
        //                $("#m_del").hide();
        //                $("#m_check").hide();
        //                $("#m_unCheck").hide();
        //            } else {
        //                $("#m_del").show();
        //                $("#m_check").show();
        //                $("#m_unCheck").show();
        //            }
        //            rMenu.css({ "top": y + "px", "left": x + "px", "visibility": "visible" });
        //            $("body").bind("mousedown", onBodyMouseDown);
        //        }
        //        function hideRMenu() {
        //            if (rMenu) rMenu.css({ "visibility": "hidden" });
        //            $("body").unbind("mousedown", onBodyMouseDown);
        //        }

        //显示右鍵
        function showRMenu(type, x, y) {
            $("#rMenu").show();
            if (type == "root") {
                $("#rMenu").hide();
            } else {
                $("#m_add").show();
                $("#m_del").show();
                $("#m_modify").show();
            }
            //0000000,0000001,0000002,不可以删除修改
            zTree = $.fn.zTree.getZTreeObj("treeDemo");
            nodes = zTree.getSelectedNodes();
            treeNode = nodes[0];
            if (treeNode != null) {
                treeID = treeNode.id;
                if ( treeNode.children) {//有子节点的时候
                    $("#m_del").hide();
                }
                if (treeNode.pId !== null && treeNode.pId !== "" && parseInt(treeNode.pId) >0) {//是叶子节点的时候
                    $("#m_add").hide();
                }
            }
            rMenu.css({ "top": y + "px", "left": x + "px", "visibility": "visible" });
            $("body").bind("mousedown", onBodyMouseDown);
        }


        //隐藏右鍵
        function hideRMenu() {
            // alert();
            if (rMenu) rMenu.css({ "visibility": "hidden" });
            $("body").unbind("mousedown", onBodyMouseDown);
        }


        function onBodyMouseDown(event) {
            if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
                rMenu.css({ "visibility": "hidden" });
            }
            if (!(event.target.id == "rMenu2" || $(event.target).parents("#rMenu2").length > 0)) {
                $("#rMenu2").css({ "visibility": "hidden" });
            }
        }
        function addHoverDom(event) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = zTree.transformToArray(zTree.getNodes());
            for (var i = 0,l = nodes.length; i < l; i++) {
                var desc = nodes[i].desc;
                var aObj = $("#" + nodes[i].tId + "_span");
                aObj.attr("title",desc);//给ID为....设置title属性，属性值为oname
            }
        }
        //鼠标点击事件不在节点上时隐藏右键菜单
        $(function () {
            $("body").bind(
                "mousedown",
                function (event) {
                    if (!(event.target.id == "rMenu2" || $(event.target)
                            .parents("#rMenu2").length > 0)) {
                        $("#rMenu2").hide();
                    }

                    if (!(event.target.id == "rMenu3" || $(event.target)
                            .parents("#rMenu3").length > 0)) {
                        $("#rMenu3").hide();
                    }
                });
        });

        /*******************新增  start*********************/
        //显示新增
        function showRMenu2(x, y) {
            $("#rMenu2").show();
            $("#rMenu2").css({ "top": y + "px", "left": x + "px", "visibility": "visible" });
            $("body").bind("mousedown", onBodyMouseDown);
        }

        //显示修改
        function showRMenu3(x, y) {
            $("#rMenu3").show();
            $("#rMenu3").css({ "top": y + "px", "left": x + "px", "visibility": "visible" });
            $("body").bind("mousedown", onBodyMouseDown);
        }

        var addCount = 1;
        //新增树节点
        function addTreeNode() {
            $("#rMenu").hide();
            //显示新增div
            var tag = 0;
            $("#treeDemo").mousemove(function (e) {
                if (tag == 0) showRMenu2(e.pageX, e.pageY);
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                var nodes = zTree.getSelectedNodes();
                $("#Name").focus();
                tag = tag + 1;
            });
        }

        function editTreeNode() {
            $("#rMenu").hide();
            //显示修改div
            var tag = 0;
            $("#treeDemo").mousemove(function (e) {
                if (tag == 0) showRMenu3(e.pageX, e.pageY);
                $("#Name2").val(nodes[0].name);
                $("#Desc2").val(nodes[0].desc || '');
                tag = tag + 1;
            });
        }

        //新增执行后台
        function addTree() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = zTree.getSelectedNodes();
            var id = null;  //兼容是顶层父节点的情况
            if(nodes[0]){
                id = nodes[0].id;
            }
            $.ajax({
                type: "post",
                url: bomCategory_save,
                dataType: 'json',
                data: {
                    act: "add",
                    pId : id,
                    Name: $("#Name").val(),
                    Desc: $("#Desc").val()
                },
                success: function (result) {
                    if(result.status == 200){
                        if(result.data.pId !== null && result.data.pId !== 0){//不是最顶层节点时
                            //强行加载父节点
                            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                            var nodes = treeObj.getSelectedNodes();
                            var newNode = {name:result.data.Name,pId:result.data.pId,
                                id:result.data.id,desc:result.data.Desc};
                            newNode = treeObj.addNodes(nodes[0], newNode);
                            node = zTree.getNodeByParam("id", result.data.id, null);
                            node.nocheck = true;
                            zTree.updateNode(node);
                        }else{
                            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                            var newNode = {name:result.data.Name,pId:result.data.pId,
                                id:result.data.id,desc:result.data.Desc};
                            newNode = treeObj.addNodes(null, newNode);
                            node = zTree.getNodeByParam("id", result.data.id, null);
                            node.nocheck = true;
                            zTree.updateNode(node);
                        }
                    }

                    if (result.status == -1) alert("添加失败！"+result.msg);
                },
                error: function () {
                    alert('Error loading HTML document');
                }
            });
            $("#rMenu2").css({ "visibility": "hidden" });
            $("#Name").val("");
            $("#Desc").val("");
        }
        /*******************新增  end*********************/

        /*******************修改  start*********************/
        function editName() {
            $("#rMenu").hide();
/*            zTree = $.fn.zTree.getZTreeObj("treeDemo");
            nodes = zTree.getSelectedNodes();
            zTree.editName(nodes[0]);*/
editTreeNode();
        }

        //新增执行后台
        function editTree() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = zTree.getSelectedNodes();
            $.ajax({
                type: "post",
                url: bomCategory_save,
                dataType: 'json',
                data: {
                    act: "update",
                    id: nodes[0].id ,
                    Name: $("#Name2").val(),
                    desc: $("#Desc2").val(),
                    pId : nodes[0].pId
                },
                success: function (result) {
                    if(result.status == 200){
                            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                            var nodes = treeObj.getSelectedNodes();
                            nodes[0].name = result.data.Name;
                            nodes[0].desc = result.data.desc;
                            treeObj.updateNode(nodes[0]);
                    }

                    if (result.status == -1) alert("添加失败！"+result.msg);
                },
                error: function () {
                    alert('Error loading HTML document');
                }
            });
            $("#rMenu3").css({ "visibility": "hidden" });
            $("#Name2").val("");
            $("#Desc2").val("");
        }

        //捕获节点编辑名称结束（Input 失去焦点 或 按下 Enter 键）之后，更新节点名称数据之前的事件回调函数，并且根据返回值确定是否允许更改名称的操作
        function onRename(treeId, treeNode, newName) {
            zTree = $.fn.zTree.getZTreeObj("treeDemo");
            nodes = zTree.getSelectedNodes();
            treeId = "treeDemo";
            treeNode = nodes[0];
            newName = nodes[0].name;
            if (newName.length == 0) {
                alert("名称不能为空.");
                return false;
            }
            $.ajax({
                type: "post",
                url: basedata_area,
                dataType: 'json',
                data: {
                    action: "update",
                    id: nodes[0].id,
                    Name: newName
                },
                success: function (json) {
                    alert('操作成功！');
                },
                error: function () {
                    alert('Error loading HTML document');
                }
            });
            return true;
        }
        /*******************修改  end*********************/
        function removeTreeNode() {
            hideRMenu();
            var nodes = zTree.getSelectedNodes();
            if (nodes && nodes.length > 0) {
                if (0) {//nodes[0].children && nodes[0].children.length > 0
                    var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";
                    if (confirm(msg) == true) {
                        delTree();
                    }
                } else {
                    delTree();
                }
            }
        }


        //新增执行后台
        function delTree() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = zTree.getSelectedNodes();
            $.ajax({
                type: "post",
                url: bomCategory_del,
                dataType: 'json',
                data: {
                    id: nodes[0].id
                },
                success: function (result) {

                    if(result.status == 200)
                        zTree.removeNode(nodes[0]);

                    if (result.status == -1)
                        alert("删除失败！" + result.msg);
                },
                error: function () {
                    alert('Error loading HTML document');
                }
            });
            $("#rMenu2").css({ "visibility": "hidden" });
            $("#Name").val("");
            $("#Desc").val("");
        }


        //删除节点end
        function checkTreeNode(checked) {
            var nodes = zTree.getSelectedNodes();
            if (nodes && nodes.length > 0) {
                zTree.checkNode(nodes[0], checked, true);
            }
            hideRMenu();
        }
        function resetTree() {
            hideRMenu();
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        }

        function setCheck() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = zTree.transformToArray(zTree.getNodes());
            //设置跟节点不显示复选框
            for (var i = 0; i < nodes.length; i++) {
                var id = nodes[i].id;
                for (var j = 0; j < nodes.length; j++) {
                    /*if (id == nodes[j].pId) {*/
                    node = zTree.getNodeByParam("id", id, null);
                    node.nocheck = true;
                    zTree.updateNode(node);
                    /*}*/
                }
            }
        }

        //初始化树
        var zTree, rMenu;
        $(document).ready(function () {
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            setCheck();
            zTree = $.fn.zTree.getZTreeObj("treeDemo");
            rMenu = $("#rMenu");
        });

        function submit() {
            var tree = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = tree.transformToArray(tree.getCheckedNodes(true));
            var nodesArr = new Array();
            var aHtml = "";
            for (var i = 0; i < nodes.length; i++) {
                nodesArr[i] = nodes[i].name;
                if (i / 5 == 1) {
                    aHtml += "<br/>"
                }
                aHtml += "<input type='checkbox' name='checkbox' value='" + nodes[i].id + "' checked>" + nodes[i].name;
            }
            $("#text").val(nodesArr.join(","));


            document.getElementById("ckDiv").innerHTML = aHtml;
        }





        $(document).ready(function(){
            //构建树
            //getTree();
            //新增
            $("#m_add").on("click",function(){
                addTreeNode();
            });
            $("#p_add").on("click",function(){
		 addTreeNode();
            });
            //重命名
            $("#m_modify").on("click",function(){
                editTreeNode();
            });
            //删除
            $("#m_del").on("click",function(){
                removeTreeNode();
            });
            //删除

            $("#addTree").on("click",function(){
                addTree();
            });
            $("#editTree").on("click",function(){
                editTree();
            });
        });



    </script>
    <style type="text/css">
        div#rMenu
        {
            position: absolute;
            visibility: hidden;
            top: 0;
            background-color: #555;
            text-align: left;
            padding: 2px;
        }
        div#rMenu ul li
        {
            margin: 1px 0;
            padding: 0 5px;
            cursor: pointer;
            list-style: none outside none;
            background-color: #DFDFDF;
        }
        div#rMenu2
        {
            position: absolute;
            visibility: hidden;
            background-color: #555;
            text-align: left;
            padding: 2px;
        }

        div#rMenu2 ul
        {
            margin: 1px 0;
            padding: 0 5px;
            cursor: pointer;
            list-style: none outside none;
            background-color: #DFDFDF;
        }

        div#rMenu3
        {
            position: absolute;
            visibility: hidden;
            background-color: #555;
            text-align: left;
            padding: 2px;
        }

        div#rMenu3 ul
        {
            margin: 1px 0;
            padding: 0 5px;
            cursor: pointer;
            list-style: none outside none;
            background-color: #DFDFDF;
        }
    </style>
</head>
<body>
  <!--<div class="fr storages-search" style="position:absolute;top:100px;left:500px"><label for="">物料类别查询  </label><span class="ui-search"><input type="text"  placeholder="输入物料类别名字" id="goodsAuto" class="ui-input" /></span><span id="stockSearch"></span></div>
<div class="content_wrap">-->
    <!--    <input id="text" type="text" value="" size="200">
        <div id="ckDiv">
        </div>-->
    <div class="fr"><a href="#" class="ui-btn ui-btn-sp mrb" id="p_add">新增基础类别</a></div>

    <div class="zTreeDemoBackground left">
        <ul id="treeDemo" class="ztree" style="height: 500px">
        </ul>
        <!--        <input id="text" type="button" οnclick="submit()" value="确定">-->
    </div>
</div>

<!-- 隐藏新增 -->
<div id="rMenu2">
    <ul>
        <li>名称：
            <input type="text" class="input_tx" id="Name" style="width: 100px; height: 16px;" />
        </li>
        <li>描述：
            <input type="text" class="input_tx" id="Desc" style="width: 100px; height: 16px;" />
        </li>
        <!--<li>地区编号：
            <input type="text" class="input_tx" id="Area_ID" style="width: 100px; height: 16px;" /></li>-->
        <li><a class="orange" id="addTree">确定</a> </li>
    </ul>
</div>

<div id="rMenu3">
    <ul>
        <li>名称：
            <input type="text" class="input_tx" id="Name2" style="width: 100px; height: 16px;" />
        </li>
        <li>描述：
            <input type="text" class="input_tx" id="Desc2" style="width: 100px; height: 16px;" />
        </li>
        <!--<li>地区编号：
            <input type="text" class="input_tx" id="Area_ID" style="width: 100px; height: 16px;" /></li>-->
        <li><a class="orange" id="editTree">确定</a> </li>
    </ul>
</div>

<!-- 右键树 -->
<div id="rMenu">
    <ul>
        <li id="m_add">增加 </li>
        <li id="m_modify">修改 </li>
        <li id="m_del">删除 </li>
    </ul>
</div>
</body>
</html>

<script>
/*var goodsCombo = Business.goodsCombo($('#goodsAuto'), {
        extraListHtml: ''
});
console.log(goodsCombo);

// $('#goodsAuto').click(function(){
//      var _self = this;
//      setTimeout(function(){
//              _self.select();
//      }, 50);
// });

$('#stockSearch').click(function(e){
        // e.preventDefault();
        //$('#result').html('').addClass('loading');
    var id = goodsCombo.getValue();
        var text = $('#goodsAuto').val();
        Business.forSearch(id, text);
});

</script>
