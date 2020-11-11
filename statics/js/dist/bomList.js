function initTree() {
	Public.zTree.init($("#tree"), {
		defaultClass: "innerTree",
		showRoot: !0,
		rootTxt: "全部"
	}, {
		callback: {
			beforeClick: function(e, t) {
				$("#currentCategory").data("id", t.id).html(t.name);
				$("#search").data('id',t.id).trigger("click")
			}
		}
	})
}
function initGrid() {
	var e = Public.setGrid(ajustH, ajustW),
		t = ["操作", "编号","模板", "名称","模板id", "大类", "cat1id","小类", "cat2id",  "属性描述", "描述"],
		i = parent.SYSTEM.rights,
		a = !(parent.SYSTEM.isAdmin || i.AMOUNT_COSTAMOUNT),
		r = !(parent.SYSTEM.isAdmin || i.AMOUNT_INAMOUNT),
		n = !(parent.SYSTEM.isAdmin || i.AMOUNT_OUTAMOUNT),
		o = [{
			name: "operate",
			width: 60,
			fixed: !0,
			formatter: function(e, t, i) {
				var a = '<div class="operating" data-id="' + i.id + '"><span class="ui-icon ui-icon-pencil" title="修改"></span><span class="ui-icon ui-icon-trash" title="删除"></span></div>';
				return a
			},
			title: !1
		}
		, {
            name: "id",
            index: "id",
            width: 80,
            title: !1,
            align:"center"
        }, {
            name: "MTName",
            index: "MTName",
            width: 120,
            classes: "ui-ellipsis",
            align:"center"
        }
        , {
			name: "Name",
			index: "Name",
			width: 260,
            classes: "ui-ellipsis",
			align:"center"
		}
            , {
                name: "MT_ID",
                index: "MT_ID",
                width: 60,
                align: "center",
                title: !1,
				hidden :true
            }
		, {
			name: "cat1Name",
            index: "cat1Name",
            width: 60,
            align: "center",
            title: !1
            }
            , {
                name: "BOMCat_ID2",
                index: "BOMCat_ID2",
                width: 60,
                align: "center",
                title: !1,
                hidden :true
            }
		,{
		    name:"cat2Name",
			index:"cat2Name",
			width:120,
			align:"center"
        }
            , {
                name: "BOMCat_ID1",
                index: "BOMCat_ID1",
                width: 60,
                align: "center",
                title: !1,
                hidden :true
        },{
			name: "Attr",
			width:60,
			align:"center",
            formatter: function(e, t, i) {
                var a = '<div class="operating" data-name="' + i.Name + '"  data-attrStr="' + i.attrStr + '"><span class="ui-icon ui-icon-search" title="查看"></span></div>';
                return a
            }
		}
		,{
            name: "Desc",
            index: "Desc",
            width: 260,
            align: "center"
        }];
	$("#grid").jqGrid({
		url: basedata_goods,
		datatype: "json",
		width: 1200,
		height: e.h,
		altRows: !0,
		gridview: !0,
		onselectrow: !1,
		colNames: t,
		colModel: o,
		pager: "#page",
		viewrecords: !0,
		multiselect: !0,
		cmTemplate: {
			sortable: !1
		},
		rowNum: 100,
		rowList: [100, 200, 500],
		shrinkToFit: !0,
		jsonReader: {
			root: "data.rows",
			records: "data.records",
			total: "data.total",
			repeatitems: !1,
            bomCat_id1: "bomCat_id1"
		},
		loadComplete: function(e) {
			if (e && 200 == e.status) {
				var t = {};
				e = e.data;
				for (var i = 0; i < e.rows.length; i++) {
					var a = e.rows[i];
					t[a.id] = a
				}
				$("#grid").data("gridData", t)
			}
		},
		loadError: function() {
			parent.Public.tips({
				type: 1,
			})
		}
	})
}
function initEvent() {
	$_matchCon = $("#matchCon");
	$_matchCon.placeholder();
	$("#search").on("click", function(e) {
		e.preventDefault();
		var t = "按物料编号，物料名称，大类，小类，模板等查询" === $_matchCon.val() ? "" : $.trim($_matchCon.val()),
			i = $("#search").data('id');
		$("#grid").jqGrid("setGridParam", {
			postData: {
				skey: t,
				assistId: i
			}
		}).trigger("reloadGrid")
	});
	$("#btn-add").on("click", function(e) {
		e.preventDefault();
		handle.operate("add")
	});
	$("#btn-print").on("click", function(e) {
		e.preventDefault()
	});
	$("#btn-import").on("click", function(e) {
		e.preventDefault();
		parent.$.dialog({
			width: 560,
			height: 300,
			title: "批量导入",
			content: "url:"+goods_import,
			lock: !0
		})
	});
	$("#btn-export").on("click", function() {
			var e = "按物料编号，物料名称，规格型号等查询" === $_matchCon.val() ? "" : $.trim($_matchCon.val()),
				t = $("#currentCategory").data("id") || "";
			$(this).attr("href", goods_export+"?isDelete=2&skey=" + e + "&assistId=" + t)
	});
	$("#grid").on("click", ".operating .ui-icon-pencil", function(e) {
		e.preventDefault();
			var t = $(this).parent().data("id");
			handle.operate("edit", t)
	});
	$("#grid").on("click", ".operating .ui-icon-trash", function(e) {
		e.preventDefault();
			var t = $(this).parent().data("id");
			handle.del(t + "")
	});
    $(".grid-wrap").on("click", ".ui-icon-search", function(e) {
        e.preventDefault();
        var name = $(this).parent().data("name");
        var attrStr = $(this).parent().data("attrstr") || '';
        if(name) {
            $.dialog({
                width: 600,
                height: 410,
                title: name + '属性信息',
                content: 'url:'+settings_spec_info+"?attrStr=" + attrStr,
                data: {attrStr:attrStr},
                cancel: true,
                cancelVal: '关闭'

            });
        } else {
            parent.Public.tips({type: 2, content : '请先选择一个商品！'});
        };
    });
	$("#btn-batchDel").click(function(e) {
		e.preventDefault();
			var t = $("#grid").jqGrid("getGridParam", "selarrrow");
			t.length ? handle.del(t.join()) : parent.Public.tips({
				type: 2,
				content: "请选择需要删除的项"
			})
	});
	$("#hideTree").click(function(e) {
		e.preventDefault();
		var t = $(this),
			i = t.html();
		if ("&gt;&gt;" === i) {
			t.html("&lt;&lt;");
			ajustW = 0;
			$("#tree").hide();
			Public.resizeGrid(ajustH, ajustW)
		} else {
			t.html("&gt;&gt;");
			ajustW = 270;
			$("#tree").show();
			Public.resizeGrid(ajustH, ajustW)
		}
	});
	$(window).resize(function() {
		Public.resizeGrid(ajustH, ajustW);
		$(".innerTree").height($("#tree").height() - 95)
	});
	Public.setAutoHeight($("#tree"));
	$(".innerTree").height($("#tree").height() - 95)
}
var qtyPlaces = Number(parent.SYSTEM.qtyPlaces),
	pricePlaces = Number(parent.SYSTEM.pricePlaces),
	amountPlaces = Number(parent.SYSTEM.amountPlaces),
	searchFlag = !1,
	filterClassCombo, ajustH = 95,
	ajustW = 270,
	thisTree, handle = {
		operate: function(e, t) {
			if ("add" == e) var i = "新增物料",
				a = {
					oper: e,
					type:'add',
                    attrStr:'',
					callback: this.callback
				};
			else var i = "修改物料",
				a = {
					oper: e,
                    rowData: $("#grid").data("gridData")[t],
					type:'edit',
                    attrStr:$("#grid").data("gridData")[t].attrStr || '',
					callback: this.callback
				};
			var r = 640;
			//var r = parent.SYSTEM.enableStorage ? 780 : 640;
			$.dialog({
				title: i,
				content: "url:"+settings_goods_manage+"?type="+a.type + "&&attr=" + a.attrStr,
				data: a,
				width: r,
				height: 420,
				max: !1,
				min: !1,
				cache: !1,
				lock: !0
			})
		},
		del: function(e) {
			$.dialog.confirm("删除的物料将不能恢复，请确认是否删除？", function() {
				Public.ajaxPost(bom_del, {
					id: e
				}, function(t) {
					if (t && 200 == t.status) {
						var i = t.data.id || [];
						parent.Public.tips(e.split(",").length === i.length ? {
							content: "成功删除" + i.length + "个物料！"
						} : {
							type: 2,
							content: t.data.msg
						});
						for (var a = 0, r = i.length; r > a; a++) {
							$("#grid").jqGrid("setSelection", i[a]);
							$("#grid").jqGrid("delRowData", i[a])
						}
					} else parent.Public.tips({
						type: 1,
						content: "删除物料失败！" + t.msg
					})
				})
			})
		},
		callback: function(e, t, i) {
			var a = $("#grid").data("gridData");
			if (!a) {
				a = {};
				$("#grid").data("gridData", a)
			}
			a[e.id] = e;
			if ("edit" == t) {
				var flag = $("#grid").jqGrid("setRowData", e.id, e);
$("#grid").trigger("reloadGrid");
				i && i.api.close()
			} else {
				$("#grid").jqGrid("addRowData", e.id, e, "last");
$("#grid").trigger("reloadGrid");
				i && i.resetForm(e)
			}
		}
	},
	format = {
		money: function(e) {
			var e = Public.numToCurrency(e);
			return e || "&#160;"
		},
		quantity: function(e) {
			return e || "&#160;"
		}
	};
initGrid();
//initTree();
initEvent();
$("#btn-refresh").click(function(t) {
		t.preventDefault();
		$("#grid").trigger("reloadGrid")
	});
