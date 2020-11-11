function initField() {
    $("#Desc").val(rowData.Desc);
  var cat1 = rowData.BOMCat_ID2;
  cat2Combo =  $("#BOMCat_ID2").combo({
        text: "name",
        value: "id",
        width: 200,
        data: basedata_cat2List+"?cat1="+cat1,
        defaultSelected: ["id", parseInt(rowData.BOMCat_ID1)] || void 0,
        ajaxOptions: {
	async:false,
            formatData: function(e) {
                return e.data.items
            }
        }
    }).getCombo();
}
function initEvent() {
    $("#manage-form").submit(function(t) {
        postData();
    });
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
function postData() {
    if ($("#manage-form").validate().form()) {

        var attr_key=[];
        var attr_val=[];

        $("input[name='key']").each(function () {
            attr_key.push($(this).val());
        });

        $("input[name='val']").each(function () {
            attr_val.push($(this).val());
        });
var AttrValue = '_';
$.ajax({
           type: "POST",
           url: basedata_getAttr,
           data: {id:mateplateCombo.getValue()},
           dataType: "json",
           async: false,
           success: function(data, status){
                   Attr = data.data;
           },
           error: function(err){
           }
});
AttrArr = Attr.split('|');
len = AttrArr[0];

for(var j = 0;j<len;j++){
        var id = "#val"+j;
        if(j==len-1)
                AttrValue += $(id).val();
        else
                AttrValue += $(id).val()+'*';
}
        e = {
            id: rowData.id,
            BOMModel: $.trim($("#BOMModel").val()),
            BOMName: mateplateCombo.getText()+AttrValue,
            Desc: $.trim($("#Desc").val()),
            BOMCat_ID1: cat1Combo.getValue(),
            BOMCat_ID2: cat2Combo.getValue(),
            BOMCat_ID1_Name: cat1Combo.getText(),
            BOMCat_ID2_Name: cat2Combo.getText(),
            attr_key : attr_key,
            mateplateValue : mateplateCombo.getValue(),
            mateplateText : mateplateCombo.getText(),
            attr_val : attr_val
        },
            i = "add" == oper ? "新增物料" : "修改物料";
        Public.ajaxPost(bom_save+"?act=" + ("add" == oper ? "add" : "update"), e, function(t) {
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
    $("#Desc").val("");
}
var api = frameElement.api,
    oper = api.data.oper,
    rowData = api.data.rowData || {},
    callback = api.data.callback;
var cat1Combo = $("#BOMCat_ID1").combo({
    text: "name",
    value: "id",
    width: 200,
    data: basedata_cat1List,
    defaultSelected: ["id", parseInt(rowData.BOMCat_ID2)] || void 0,
    ajaxOptions: {
	async:false,
        formatData: function(e) {
            e.data.items.unshift({
                id: "",
                name: ""
            });
            return e.data.items
        }
    }
}).getCombo();
var mateplateCombo = $("#MT_ID").combo({
    text: "name",
    value: "id",
    width: 200,
    data: basedata_mattemplate,
    defaultSelected: ["id", parseInt(rowData.MT_ID)] || void 0,

    ajaxOptions: {
	async:false,
        formatData: function(e) {
            e.data.items.unshift({
                userid: "",
                name: ""
            });
            return e.data.items
        }
    }

}).getCombo();
initPopBtns();
if(oper=='edit')
initField();
initEvent();
var flag = 0;
var cat2Combo;
function initNextLevel() {
    if(flag==0)flag++;
    else{
    var cat1 = $('#BOMCat_ID1').data('_combo').getValue();
    cat2Combo =  $("#BOMCat_ID2").combo({
        text: "name",
        value: "id",
        width: 200,
        data: basedata_cat2List+"?cat1="+cat1,
        defaultSelected: ["id", parseInt(-1)] || void 0,
        ajaxOptions: {
            formatData: function(e) {
                return e.data.items
            }
        }
    }).getCombo();
    }
}
var AttrArr;
var flag1 = 0;
function initAttr(){
	if(flag1==0)flag1++;
	else{
$.ajax({
           type: "POST",
           url: basedata_getAttr,
           data: {id:mateplateCombo.getValue()},
           dataType: "json",
           async: false,
           success: function(data, status){
                   Attr = data.data;
           },
           error: function(err){
           }
});
AttrArr = Attr.split('|');
                                        $('#addVar').parent().siblings().remove();
for(var i = 0;i<AttrArr[0];i++){
$node = '<li class="row-item"><div><input type="text" value='+AttrArr[i+1]+'  class="attr-input" name="key" id="key">：'
                        + '<input type="text" placeholder="属性值"  class="attr-input" name="val" id="val'+i+'">'
                        + '<span class="removeVar">删除</span></div></li>';
                    //新表单项添加到“新增”按钮前面
                                        $('#addVar').parent().before($node);
}
	}
}
