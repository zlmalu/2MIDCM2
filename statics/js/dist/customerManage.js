function initField() {
    rowData.id && $("#name").val(rowData.name) && $("#remark").val(rowData.remark)
    && $("#phone").val(rowData.telephone) && $("#Taxrate").val(rowData.Taxrate)
    && $("#BU_Cat").val(rowData.BU_Cat)	&& $("#Status").val(rowData.Status)
let idArr;
if(rowData.Area_ID!=null)
$.ajax({  
	   type: "POST",
	   url: betweenUnit_recurSon,
	   data: {id: rowData.Area_ID}, 
	   dataType: "json",  
	   async: false,
	   success: function(data, status){  
		   idArr = data.data; 
	   },  
	   error: function(err){  
	   }
});
if(rowData.Area!=null){
$("#Area_ID1").removeData("_combo");
$("#Area_ID1").combo({
        text: "name",
        value: "id",
        width: 200,
        data: basedata_area1,
        defaultSelected: ["id", parseInt(idArr[0])] || void 0,
        ajaxOptions: {
            formatData: function(e) {
                return e.data.items
            }
        }
    }).getCombo();
$("#Area_ID2").removeData("_combo");
$("#Area_ID2").combo({
        text: "name",
        value: "id",
        width: 200,
        data: basedata_area2+"?value="+idArr[0],
        defaultSelected: ["id", parseInt(idArr[1])] || void 0,
        ajaxOptions: {
            formatData: function(e) {
                return e.data.items
            }
        }
    }).getCombo();
$("#Area_ID3").removeData("_combo");
$("#Area_ID3").combo({
        text: "name",
        value: "id",
        width: 200,
        data: basedata_area3+"?value="+idArr[1],
        defaultSelected: ["id", parseInt(idArr[2])] || void 0,
        ajaxOptions: {
            formatData: function(e) {
                return e.data.items
            }
        }
    }).getCombo();
$("#Area_ID4").removeData("_combo");
$("#Area_ID4").combo({
        text: "name",
        value: "id",
        width: 200,
        data: basedata_area4+"?value="+idArr[2],
        defaultSelected: ["id", parseInt(idArr[3])] || void 0,
        ajaxOptions: {
            formatData: function(e) {
                return e.data.items
            }
        }
    }).getCombo();
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
    if ($("#manage-form").validate().form()) {
	var a=0,an=0;
/*if($("#filter-area3").val()){
an =$("#filter-area3").val();
$.ajax({  
	   type: "POST",
	   url: betweenUnit_getArea_ID,
	   async: false,
	   data: {name: an}, 
	   dataType: "json",  
	   async: false,
	   success: function(data, status){  
		   a = data.data[0]; 
	   },  
	   error: function(err){  
	   }
});
}
else if($("#filter-area2").val()){
an =$("#filter-area2").val();
$.ajax({  
	   type: "POST",
	   url: betweenUnit_getArea_ID,
	   async: false,
	   data: {name: an}, 
	   dataType: "json",  
	   async: false,
	   success: function(data, status){  
		   a = data.data[0]; 
	   },  
	   error: function(err){  
	   }
});
}
else if($("#filter-area1").val()){
an =$("#filter-area1").val();
$.ajax({  
	   type: "POST",
	   url: betweenUnit_getArea_ID,
	   async: false,
	   data: {name: an}, 
	   dataType: "json",  
	   async: false,
	   success: function(data, status){  
		   a = data.data[0]; 
	   },  
	   error: function(err){  
	   }
});
}
else
	a=31,
	an=0;
*/
if($("#filter-area4").val()){
a=$("#Area_ID4").data('_combo').getValue();
an=$("#Area_ID4").data('_combo').getText();
}else if($("#filter-area3").val()){
a=$("#Area_ID3").data('_combo').getValue();
an=$("#Area_ID3").data('_combo').getText();
	}
else if($("#filter-area2").val()){
a=$("#Area_ID2").data('_combo').getValue();
an=$("#Area_ID2").data('_combo').getText();
	}
else if($("#filter-area1").val()){
a=$("#Area_ID1").data('_combo').getValue();
an=$("#Area_ID1").data('_combo').getText();
	}else{
a=0,an=0;
}
        var n = $.trim($("#name").val()),
            d = $.trim($("#remark").val()),
            i = industryCombo.getValue(),
            iname = industryCombo.getText(),
            t = $.trim($("#Taxrate").val()),
            p = $.trim($("#phone").val()),
            b = $("#BU_Cat").val(),
            s = $("#Status").val();
        e = {
            id: rowData.id,
            name: n,
            desc : d,
            Area_ID : a,
            Industry_ID : i,
            BU_Cat : b,
            Taxrate : t,
            phone : p,
            status : s,
            areaname : an,
            industryname : iname
        },
            i = "add" == oper ? "新增往来单位类别" : "修改往来单位类别";
        Public.ajaxPost(betweenUnit_save+"?act=" + ("add" == oper ? "add" : "update"), e, function(t) {
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

var industryCombo = $("#Industry_ID").combo({
    text: "Name",
    value: "id",
    width: 200,
    data: category_lists,
    defaultSelected: ["id", parseInt(rowData.Industry_ID)] || void 0,

    ajaxOptions: {
        formatData: function(e) {
            e.data.items.unshift({
                id: 0,
                Name: "其他"
            });
            return e.data.items
        }
    }

}).getCombo();
var areaCombo1 = $("#Area_ID1").combo({
    text: "name",
    value: "id",
    width: 200,
    data: basedata_area1,
    defaultSelected: ["id", parseInt()] || void 0,

    ajaxOptions: {
        formatData: function(e) {
       //     e.data.items.unshift({
    //            id: "",
      //          name: ""
         //   });
            return e.data.items
        }
    }

}).getCombo();


initPopBtns();
initField();
initEvent();

var flag = 0;
var areaCombo2;
var areaCombo3;
var upNameArr2;
function getName(){
$("#Area_ID2").removeData("_combo");
    flag++;
    if(flag>1){

$("#Area_ID2").removeData("_combo");
    var value = $("#Area_ID1").data('_combo').getValue();
/*var upNameArr;
$.ajax({  
	   type: "POST",
	   url: basedata_getAreaValue,
	   data: {id: rowData.Area_ID}, 
	   dataType: "json",  
	   async: false,
	   success: function(data, status){  
		   upNameArr = data.upNameArr1; 
	   },  
	   error: function(err){  
	   }
});*/
//var index = upNameArr.indexOf(name);
  //  upNameArr.splice(index,1);
    areaCombo2 = $("#Area_ID2").combo({
        text: "name",
        value: "id",
        width: 200,
        data: basedata_area2+"?value="+value,
        defaultSelected: ["id", parseInt(rowData.Area_ID)] || void 0,
        ajaxOptions: {
            formatData: function(e) {
                return e.data.items
            }
        }
    }).getCombo();
    }
}

var flag1 = 0;

function getName1(){
/*setTimeout("lazyLoad()",300);
}
function lazyLoad(){
    flag1++;
    if(flag1>1){
$("#Area_ID3").removeData("_combo");
var upNameArr
        var name = $('#filter-area2').val();
$.ajax({  
	   type: "POST",
	   url: basedata_getAreaName,
	   data: {id: rowData.Area_ID}, 
	   dataType: "json",  
	   async: false,
	   success: function(data, status){  
		   upNameArr = data.upNameArr2; 
	   },  
	   error: function(err){  
	   }
});*/
    flag1++;
    if(flag1>1){
$("#Area_ID3").removeData("_combo");
    var value = $("#Area_ID2").data('_combo').getValue();
        areaCombo3 = $("#Area_ID3").combo({
            text: "name",
            value: "id",
            width: 200,
            data: basedata_area3+"?value="+value,
            defaultSelected: ["id", parseInt(rowData.Area_ID)] || void 0,
            ajaxOptions: {
                formatData: function(e) {
                    return e.data.items
                }
            }
        }).getCombo();
}
}
var flag2=0;
function getName2(){
/*setTimeout("lazyLoad()",300);
}
function lazyLoad(){
    flag1++;
    if(flag1>1){
$("#Area_ID3").removeData("_combo");
var upNameArr
        var name = $('#filter-area2').val();
$.ajax({  
	   type: "POST",
	   url: basedata_getAreaName,
	   data: {id: rowData.Area_ID}, 
	   dataType: "json",  
	   async: false,
	   success: function(data, status){  
		   upNameArr = data.upNameArr2; 
	   },  
	   error: function(err){  
	   }
});*/
    flag2++;
    if(flag2>1){
$("#Area_ID4").removeData("_combo");
    var value = $("#Area_ID3").data('_combo').getValue();
        areaCombo3 = $("#Area_ID4").combo({
            text: "name",
            value: "id",
            width: 200,
            data: basedata_area4+"?value="+value,
            defaultSelected: ["id", parseInt(rowData.Area_ID)] || void 0,
            ajaxOptions: {
                formatData: function(e) {
                    return e.data.items
                }
            }
        }).getCombo();
}
}
