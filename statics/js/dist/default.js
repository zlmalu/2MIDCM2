function setTabHeight() {
	var e = $(window).height(),
		t = $("#main-bd"),
		i = e - t.offset().top;
	t.height(i);
}
function initDate() {
	var e = new Date,
		t = e.getFullYear(),
		i = "0" + (e.getMonth() + 1),
		a = "0" + e.getDate();
	SYSTEM.beginDate = t + "-" + i + "-01";
	SYSTEM.endDate = t + "-" + i + "-" + a
}

function setCurrentNav(e) {
	if (e) {
		var t = e.match(/([a-zA-Z]+)[-]?/)[1];
		$("#nav > li").removeClass("current");
		$("#nav > li.item-" + t).addClass("current")
	}
}

setTabHeight();
$(window).bind("resize", function() {
	setTabHeight()
});
!
function(e) {
	menu.init(e("#nav"));
	initDate();
	var t = e("#nav"),
		i = e("#nav > li");
	jQuery.each(i, function() {
		var i = e(this).find(".sub-nav-wrap");
		e(this).on("mouseover", function() {
			e(this).addClass("on");
			i.stop(!0, !0).fadeIn(250)
		}).on("mouseleave", function() {
			e(this).removeClass("on");
			i.stop(!0, !0).hide()
		});
		if ("auto" == i.css("top") && "auto" == i.css("bottom")) {
			var a = (e(this).outerHeight() - i.outerHeight()) / 2;
			i.css({
				top: a
			})
		}
	});
	e(".sub-nav-wrap a").bind("click", function() {
		e(this).parents(".sub-nav-wrap").hide()
	})
}(jQuery);
$("#page-tab").ligerTab({
	height: "100%",
	changeHeightOnResize: !0,
	onBeforeAddTabItem: function(e) {
		setCurrentNav(e)
	},
	onAfterAddTabItem: function() {},
	onAfterSelectTabItem: function(e) {
		setCurrentNav(e)
	},
	onBeforeRemoveTabItem: function() {},
	onAfterLeaveTabItem: function(e) {
		switch (e) {
		case "setting-vendorList":
			getSupplier();
			break;
	/*	case "setting-customerList":
			getCustomer();
			break;
	*/	case "setting-goodsList":
			getGoods();
			break;
		case "setting-settlementaccount":
			getAccounts();
			break;
		case "setting-settlementCL":
			getPayments();
			break;
		case "onlineStore-onlineStoreList":
			break;
		case "onlineStore-logisticsList":
		}
	}
});
var tab = $("#page-tab").ligerGetTabManager();
$("#nav").on("click", "a[rel=pageTab]", function(e) {
	e.preventDefault();
	var i = $(this).attr("tabid"),
		a = $(this).attr("href"),
		r = $(this).attr("showClose"),
		n = $(this).attr("tabTxt") || $(this).text().replace(">", ""),
		o = $(this).attr("parentOpen");
	o ? parent.tab.addTabItem({
		tabid: i,
		text: n,
		url: a,
		showClose: r
	}) : tab.addTabItem({
		tabid: i,
		text: n,
		url: a,
		showClose: r
	});
	return !1
});


tab.addTabItem({
	tabid: "index",
	text: "首页",
	url: SYSTEM.main_url,
	showClose: !1
});

$(window).load(function() {
	function e() {
		var e;
		switch (SYSTEM.siVersion) {
		case 3:
			e = "1";
			break;
		case 4:
			e = "3";
			break;
		default:
			e = "2"
		}
		$.getJSON(CONFIG.SERVICE_URL, {
			coid: SYSTEM.DBID,
			loginuserno: SYSTEM.UserName,
			version: e,
			type: "getallunreadcount" + SYSTEM.servicePro
		}, function(e) {
			if (0 != e.count) {
				{
					var t = $("#SysNews a");
					t.attr("href")
				}
				t.append("<span>" + e.count + "</span>");
				0 == e.syscount && t.data("tab", 2)
			}
		})
	}
	e();
	$("#skin-" + SYSTEM.skin).addClass("select").append("<i></i>");
	$("#sysSkin").powerFloat({
		eventType: "click",
		reverseSharp: !0,
		target: function() {
			return $("#selectSkin")
		},
		position: "5-7"
	});
	$("#selectSkin li a").click(function() {
		var e = this.id.split("-")[1];
		Public.ajaxPost(settings_skins, {
			skin: e
		}, function(e) {
			200 === e.status && window.location.reload()
		})
	});
	var t = $("#nav .item");
	$("#scollUp").click(function() {
		var e = t.filter(":visible");
		if (e.first().prev().length > 0) {
			e.first().prev().show(500);
			e.last().hide()
		}
	});
	$("#scollDown").click(function() {
		var e = t.filter(":visible");
		if (e.last().next().length > 0) {
			e.first().hide();
			e.last().next().show(500)
		}
	});

	//清理缓存
	$("#clear").click(function() {
		$.ajax({
			type: "GET",
			url: SYSTEM.clear_url,
			cache: !1,
			async: !0,
			dataType: "json",
			success: function(t) {
				if (1 === t) {
					Public.tips({
						type: 0,
						content: "清理成功"
					})
				}
				},
				error: function(e) {
					Public.tips({
						type: 1,
						content: "清理失败" + e
					})
				}
		})
	});
	if ($.cookie("ReloadTips")) {
		Public.tips({
			content: $.cookie("ReloadTips")
		});
		$.cookie("ReloadTips", null)
	}
});
