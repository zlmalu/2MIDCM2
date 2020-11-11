var goodsCombo = $("#goods").combo({
    text: "name",
    value: "userid",
    width: 200,
    data: basedata_goods,
    defaultSelected: ["userid", parseInt(1)] || void 0,

    ajaxOptions: {
        formatData: function(e) {
	    var a = new Array(e.data.rows.length);
	    for(var i=0;i<e.data.rows.length;i++){
			a[i]=new Array();
			a[i]['userid']=e.data.rows[i]['PK_BOM_ID'];
			a[i]['name']=e.data.rows[i]['Name'];
		}
            a.unshift({
                userid: "",
                name: ""
            });
            return a
        }
    }

}).getCombo();

var storehouseCombo1 = $("#fromStorehouse").combo({
    text: "name",
    value: "id",
    width: 200,
    data: basedata_storehouse,
    defaultSelected: ["id", parseInt(1)] || void 0,

    ajaxOptions: {
        formatData: function(e) {
            e.data.items.unshift({
                userid: "",
                name: ""
            });
            return e.data.items
        }
    }

}).getCombo();

var storehouseCombo2 = $("#toStorehouse").combo({
    text: "name",
    value: "id",
    width: 200,
    data: basedata_storehouse,
    defaultSelected: ["id", parseInt(1)] || void 0,

    ajaxOptions: {
        formatData: function(e) {
            e.data.items.unshift({
                userid: "",
                name: ""
            });
            return e.data.items
        }
    }

}).getCombo();

$("#search").click(function(){
	e = {
				stock_id1: storehouseCombo1.getValue(),
				stock_id2: storehouseCombo2.getValue(),
				stock1: storehouseCombo1.getText(),
				stock2: storehouseCombo2.getText(),
				BOM_ID : goodsCombo.getValue(),
				nubmer : $('#number').val()
			},
		Public.ajaxPost(inventory_change, e, function(t) {
			if (200 == t.status) {
				console.log(parent);
				parent.Public.tips({
					content: "调仓成功！"
				});
				//callback && "function" == typeof callback && callback(t.data, oper, window)
			} else parent.parent.Public.tips({
				type: 1,
				content: "调仓失败！" + t.msg
			})
		})
});
