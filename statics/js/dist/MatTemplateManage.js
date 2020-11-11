function initField() {
    let Attr = rowData.Attr;
var str;
if(Attr)
    str = Attr.split('|');
    rowData.id  &&$("#BOMTemplName").val(rowData.Name) && $("#Desc").val(rowData.Desc)&& $("#unitClass").val(rowData.UnitClass_ID)
    && $("#AttrNum").val(str[0]);
    numberChange();
    // $("#level1").append("<option value=3>电脑</option>");
    $("#level1").find("option:contains('"+rowData.Level1+"')").attr("selected",true);
if(Attr)
    for(let i = 1;i<=str[0];i++)
        $("#Attr"+i+"").val(str[i]);
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
    if ($("#manage-form").validate().form()) {
        var i;
        if($("#AttrNum").val()==="")
            i=5;
        else
            i = $.trim($("#AttrNum").val());
        var n = $.trim($("#BOMTemplName").val()),
            d = $.trim($("#Desc").val()),
            // a = areaCombo.getValue(),
            // i = industryCombo.getValue(),
            // an = areaCombo.getText(),
            // // iname = industryCombo.getText(),
            t = goodsCombo.getValue(),
            j = goodsTemplCombo.getValue(),
            p = goodsTemplCombo.getText(),
            l = goodsCombo.getText(),
           f = $.trim($("#unitClass option:selected").text()),
            s = $("#unitClass").val(),
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
        e = {
            id: rowData.id,
            name: n,
            desc : d,
            attrNum : i,
            unitClass_ID : s,
            unitClass : f,
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
            BOMCat_ID1 : j,
            Level1 : p,
            Level2: l,
	    BOMCat_ID2: t
            // status : s,
            // areaname : an,
            // industryname : iname
        },
            i = "add" == oper ? "新增物料模板" : "修改物料模板";
if(t)
        Public.ajaxPost(MatTemplate_save+"?act=" + ("add" == oper ? "add" : "update"), e, function(t) {
            if (200 == t.status) {
                parent.parent.Public.tips({
                    content: i + "成功！"
                });
                callback && "function" == typeof callback && callback(t.data, oper, window)
            } else parent.parent.Public.tips({
                type: 1,
                content: i + "失败！" + t.msg
            })
        });else
 parent.parent.Public.tips({
                    content: "请输入自定义类的第二选项！"
                });

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

if(rowData){
	$.ajax({  
	   type: "POST",
	   url: MatTemplate_getBOMCat_ID1,
	   async: false,
	   data: {name: rowData.Level1}, 
	   dataType: "json",  
	   async: false,
	   success: function(data, status){  
		   rowData.BOMCat_ID1 = data.data[0]; 
	   },  
	   error: function(err){  
	   }
});
	$.ajax({  
	   type: "POST",
	   url: MatTemplate_getBOMCat_ID2,
	   async: false,
	   data: {name: rowData.Level2}, 
	   dataType: "json",  
	   async: false,
	   success: function(data, status){  
		   rowData.BOMCat_ID2 = data.data[0]; 
	   },  
	   error: function(err){  
	   }
});
}
var goodsTemplCombo = $("#goodsTempl").combo({
    text: "name",
    value: "id",
    width: 200,
    data: MatTemplate_init,
    defaultSelected: ["id", parseInt(rowData.BOMCat_ID1)] || void 0,

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
            data: MatTemplate_initNextLevel+"?Up_Cat2="+rowData.BOMCat_ID1,
            defaultSelected: ["id", parseInt(rowData.BOMCat_ID2)] || void 0,
            ajaxOptions: {
                formatData: function(e) {
                    return e.data.items
                }
            }
        }).getCombo();

initPopBtns();
init();
initField();
initEvent();

var flag = 0;
function getName(){
$("#goods").removeData("_combo");
    flag++;
    if(flag>1) {
        var Up_Cat2 = goodsTemplCombo.getValue();
        goodsCombo = $("#goods").combo({
            text: "name",
            upName: name,
            value: "id",
            width: 200,
            data: MatTemplate_initNextLevel+"?Up_Cat2="+Up_Cat2,
            defaultSelected: ["id", parseInt(rowData.Area_ID)] || void 0,
            ajaxOptions: {
                formatData: function(e) {
                    return e.data.items
                }
            }
        }).getCombo();
    }
}
