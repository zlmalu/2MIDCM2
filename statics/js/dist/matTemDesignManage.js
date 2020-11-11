function initField() {
var AttrNum=0;
for(var i = 0;i<20;i++){
	var F = 'F'+i;
	if(rowData[F] !=='')
	AttrNum++;
}
var AttrNum1=0;
for(var i = 0;i<11;i++){
	var F = 'C'+i;
	if(rowData[F] !=='')
	AttrNum1++;
}
    rowData.id  &&$("#BOMTemplName").val(rowData.Name) && $("#Desc").val(rowData.Desc)&& $("#Amount").val(rowData.DownAmount)&& $("#AttrNum").val(AttrNum)&& $("#AttrNum1").val(AttrNum1)&& $("#Desc1").val(rowData.Coef);
    numberChange();
    numberChange1();
if(AttrNum>0)
for(var i = 1;i<=AttrNum;i++){
	var id = '#Attr'+i;
	var j = i-1;
	var F = 'F'+j;
	$(id).val(rowData[F]);
}
if(AttrNum1>0)
for(var i = 1;i<=AttrNum1;i++){
	var id = '#Attr2'+i;
	var j = i-1;
	var F = 'C'+j;
	$(id).val(rowData[F]);
}
}
function initEvent() {
    var t = $("#name");
    $("#manage-form").submit(function(t) {
        t.preventDefault();
        postData()
    });
    t.focus().select();
    initValidator();
}
function initPopBtns() {
    var t = "add" == oper ? ["保存", "关闭"] : ["确定", "取消"];
    api.button({
        id: "confirm",
        name: t[0],
        focus: !0,
        callback: function() {
            postData();
            return !1
        }
    }, {
        id: "cancel",
        name: t[1]
    })
}
function initValidator() {
    $("#manage-form").validate({
        rules: {
            name: {
                required: !0
            }
        },
        messages: {
            name: {
                required: "名称不能为空"
            }
        },
        errorClass: "valid-error"
    })
}
function postData() {
    if (true) {
        var i,o;
            i = $.trim($("#AttrNum").val());
            o = $.trim($("#AttrNum1").val());
        var n = $.trim($("#BOMTemplName").val()),
            d = $.trim($("#Desc").val()),
            m = $.trim($("#Desc1").val()),
            // a = areaCombo.getValue(),
            // i = industryCombo.getValue(),
            // an = areaCombo.getText(),
            // // iname = industryCombo.getText(),
            t = goodsCombo.getValue(),
            j = goodsTemplCombo.getValue(),
            p = goodsTemplCombo.getText(),
            l = goodsCombo.getText(),
            f = goodsCombo1.getValue(),
            s = $("#Amount").val(),
            a1 = $("#Attr1").val(),
                a2 = $.trim($("#Attr2").val()),
                a3 = $.trim($("#Attr3").val()),
                a4 = $.trim($("#Attr4").val()),
                a5 = $.trim($("#Attr5").val()),
                a6 = $.trim($("#Attr6").val()),
                a7 = $.trim($("#Attr7").val()),
                a8 = $.trim($("#Attr8").val()),
                a9 = $.trim($("#Attr9").val()),
                a10 = $.trim($("#Attr10").val()),
                a11 = $.trim($("#Attr11").val()),
                a12 = $.trim($("#Attr12").val()),
                a13 = $.trim($("#Attr13").val()),
                a14 = $.trim($("#Attr14").val()),
                a15 = $.trim($("#Attr15").val()),
                a16 = $.trim($("#Attr16").val()),
                a17 = $.trim($("#Attr17").val()),
                a18 = $.trim($("#Attr18").val()),
                a19 = $.trim($("#Attr19").val()),
                a20 = $.trim($("#Attr20").val()),
            a21 = $("#Attr21").val(),
            a22 = $.trim($("#Attr22").val()),
            a23 = $.trim($("#Attr23").val()),
            a24 = $.trim($("#Attr24").val()),
            a25 = $.trim($("#Attr25").val()),
            a26 = $.trim($("#Attr26").val()),
            a27 = $.trim($("#Attr27").val()),
            a28 = $.trim($("#Attr28").val()),
            a29 = $.trim($("#Attr29").val()),
            a210 = $.trim($("#Attr210").val()),
            a211 = $.trim($("#Attr211").val()),
            a212 = $.trim($("#Attr212").val()),
            a213 = $.trim($("#Attr213").val()),
            a214 = $.trim($("#Attr214").val()),
            a215 = $.trim($("#Attr215").val()),
            a216 = $.trim($("#Attr216").val()),
            a217 = $.trim($("#Attr217").val()),
            a218 = $.trim($("#Attr218").val()),
            a219 = $.trim($("#Attr219").val()),
            a220 = $.trim($("#Attr220").val()),
        e = {
            id: rowData.id,
            name: n,
            desc : d,
            coef : m,
            attrNum : i,
            attrNum1 : o,
            Amount : s,
            goods1 : f,
            Attr0 : a1,
            Attr1 : a2,
            Attr2 : a3,
            Attr3 : a4,
            Attr4 : a5,
            Attr5 : a6,
            Attr6 : a7,
            Attr7 : a8,
            Attr8 : a9,
            Attr9 : a10,
            Attr10 : a11,
            Attr11 : a12,
            Attr12 : a13,
            Attr13 : a14,
            Attr14 : a15,
            Attr15 : a16,
            Attr16 : a17,
            Attr17 : a18,
            Attr18 : a19,
            Attr19 : a20,
            Attr20 : a21,
            Attr21 : a22,
            Attr22 : a23,
            Attr23 : a24,
            Attr24 : a25,
            Attr25 : a26,
            Attr26 : a27,
            Attr27 : a28,
            Attr28 : a29,
            Attr29 : a210,
            Attr210 : a211,
            Attr211 : a212,
            Attr212 : a213,
            Attr213 : a214,
            Attr214 : a215,
            Attr215 : a216,
            Attr216 : a217,
            Attr217 : a218,
            Attr218 : a219,
            Attr219 : a220,
            BOMCat_ID1 : j,
            Level1 : p,
            Level2: l,
	    BOMCat_ID2: t,
	    BOMCat_ID3: f
            // status : s,
            // areaname : an,
            // industryname : iname
        },
            i = "add" == oper ? "新增物料模板" : "修改物料模板";
        Public.ajaxPost(matTemDesign_save+"?act=" + ("add" == oper ? "add" : "update"), e, function(t) {
            if (200 == t.status) {
                parent.parent.Public.tips({
                    content: i + "成功！"
                });
                callback && "function" == typeof callback && callback(t.data, oper, window)
            } else parent.parent.Public.tips({
                type: 1,
                content: i + "失败！" + t.msg
            })
        })
    } else $("#manage-form").find("input.valid-error").eq(0).focus()
}
function resetForm() {
    $("#manage-form").validate().resetForm();
    $("#name").val("").focus().select();
    $("#remark").val("");
    $("#Area_ID").val("");
    $("#BU_Cat").val("");
    $("#Industry_ID").val("");
    $("#Taxrate").val("");
    $("#Status").val("");
    $("#phone").val("");
}
var api = frameElement.api,
    oper = api.data.oper,
    rowData = api.data.rowData || {},
    callback = api.data.callback;

// if(rowData){
// 	$.ajax({
// 	   type: "POST",
// 	   url: MatTemplate_getBOMCat_ID1,
// 	   async: false,
// 	   data: {name: rowData.Level1},
// 	   dataType: "json",
// 	   async: false,
// 	   success: function(data, status){
// 		   rowData.BOMCat_ID1 = data.data[0];
// 	   },
// 	   error: function(err){
// 	   }
// });
// 	$.ajax({
// 	   type: "POST",
// 	   url: MatTemplate_getBOMCat_ID2,
// 	   async: false,
// 	   data: {name: rowData.Level2},
// 	   dataType: "json",
// 	   async: false,
// 	   success: function(data, status){
// 		   rowData.BOMCat_ID2 = data.data[0];
// 	   },
// 	   error: function(err){
// 	   }
// });
// }
var goodsTemplCombo = $("#goodsTempl").combo({
    text: "name",
    value: "id",
    width: 200,
    data: matTemDesign_init,
    defaultSelected: ["id", parseInt(rowData.WPTD_ID)] || void 0,

    ajaxOptions: {
        formatData: function(e) {
            e.data.items.unshift({
                id: "",
                name: ""
            });
            return e.data.items
        }
    }

}).getCombo();
var goodsCombo=$("#goods").combo({
            text: "name",
            upName: name,
            value: "id",
            width: 200,
            data: matTemDesign_initNextLevel,
            defaultSelected: ["id", parseInt(rowData.UpMT_ID)] || void 0,
            ajaxOptions: {
                formatData: function(e) {
                    return e.data.items
                }
            }
        }).getCombo();
var goodsCombo1=$("#goods1").combo({
    text: "name",
    upName: name,
    value: "id",
    width: 200,
    data: matTemDesign_initNextLevel,
    defaultSelected: ["id", parseInt(rowData.DownMT_ID)] || void 0,
    ajaxOptions: {
        formatData: function(e) {
            return e.data.items
        }
    }
}).getCombo();

initPopBtns();
initField();
initEvent();

//初始参数个数
function numberChange(){
    let number;
    if($("#AttrNum").val()==="") {
        $("#AttrNum").val(0);
        number=0;
    }
    else{
        number = $("#AttrNum").val();
    }
    if(number>=attrNum) {
        for (let i = attrNum+1; i <= number; i++) {
            $("#attr-form").append(" <li class=\"row-item\">\n" +
                "                    <div class=\"label-wrap\"> <label  class=\"tit\" for=\"Attr"+i+"\">函數" + i + "：</label></div>\n" +
                "                    <div class=\"ctn-wrap\"><span class=\"ui-combo-wrap\">\n" +
                "                    <input type=\"text\" name=\"filter-user\" id=\"Attr"+i+"\" class=\"input-txt\" autocomplete=\"off\" />\n" +
                "                    <span class=\"trigger\"></span>\n" +
                "                    </span></div>\n" +
                "                </li>");
        }
    }else{
        for(let i = number; i<attrNum; i++){
            let len = $("#attr-form").children().length-1;
            $("#attr-form li:eq("+len+")").remove();
        }
    }
}
function numberChange1(){
    let number;
    if($("#AttrNum1").val()==="") {
        $("#AttrNum1").val(0);
        number=0;
    }
    else{
        number = $("#AttrNum1").val();
    }
    if(number>=attrNum1) {
        for (let i = attrNum1+1; i <= number; i++) {
            $("#attr-form").append(" <li class=\"row-item\">\n" +
                "                    <div class=\"label-wrap\"> <label  class=\"tit\" for=\"Attr"+i+"\">因子" + i + "：</label></div>\n" +
                "                    <div class=\"ctn-wrap\"><span class=\"ui-combo-wrap\">\n" +
                "                    <input type=\"text\" name=\"filter-user\" id=\"Attr2"+i+"\" class=\"input-txt\" autocomplete=\"off\" />\n" +
                "                    <span class=\"trigger\"></span>\n" +
                "                    </span></div>\n" +
                "                </li>");
        }
    }else{
        for(let i = number; i<attrNum1; i++){
            let len = $("#attr-form").children().length-1;
            $("#attr-form li:eq("+len+")").remove();
        }
    }
}
function inputFocus() {
    if($("#AttrNum").val()==="");
    else
        attrNum=parseInt($("#AttrNum").val());
}

function inputFocus1() {
    if($("#AttrNum1").val()==="");
    else
        attrNum1=parseInt($("#AttrNum1").val());
}

