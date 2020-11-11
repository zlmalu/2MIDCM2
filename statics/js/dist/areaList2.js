/**
 * Created by Administrator on 2019/9/12.
 */

//树属性的定义
var setting = {
    //页面上的显示效果
    view: {
        addHoverDom: addHoverDom, //当鼠标移动到节点上时，显示用户自定义控件
        removeHoverDom: removeHoverDom //离开节点时的操作
    },
    edit: {
        enable: true, //单独设置为true时，可加载修改、删除图标
        editNameSelectAll: true,
        showRemoveBtn: showRemoveBtn,
        showRenameBtn: showRenameBtn
    },
    data: {
        simpleData: {
            enable:true,
            idKey: "id",
            pIdKey: "pId",
            system:"system",
            rootPId: ""
        }
    },
    callback: {
        onClick: zTreeOnClick, //单击事件
        onRemove: onRemove, //移除事件
        onRename: onRename //修改事件
    }
};

function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span"); //获取节点信息
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;

    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='add node' οnfοcus='this.blur();'></span>"; //定义添加按钮
    sObj.after(addStr); //加载添加按钮
    var btn = $("#addBtn_"+treeNode.tId);

    //绑定添加事件，并定义添加操作
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("tree");
        //将新节点添加到数据库中
        var name='NewNode';
        $.post('./index.php?r=data/addtree&pid='+treeNode.id+'&name='+name,function (data) {
            var newID = data; //获取新添加的节点Id
            zTree.addNodes(treeNode, {id:newID, pId:treeNode.id, name:name}); //页面上添加节点
            var node = zTree.getNodeByParam("id", newID, null); //根据新的id找到新添加的节点
            zTree.selectNode(node); //让新添加的节点处于选中状态
        });
    });
};

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};

function onRename(e, treeId, treeNode, isCancel) {
    //需要对名字做判定的，可以来这里写~~
    $.post('./index.php?r=data/modifyname&id='+treeNode.id+'&name='+treeNode.name);
}

function onRemove(e, treeId, treeNode) {
    //需要对删除做判定或者其它操作，在这里写~~
    $.post('./index.php?r=data/del&id='+treeNode.id);
}

function beforeRemove(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("tree");
    zTree.selectNode(treeNode);
    return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}

var setting = {
    edit: {
        enable: true
    },
    callback: {
        beforeRename:  beforeRename
    }
};

