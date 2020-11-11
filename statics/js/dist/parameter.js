$("#save").click(function() {
	var url,data;
//获取指定form中的所有的<input>对象
    function getElements(formId) {
        var form = document.getElementById(formId);
        var elements = new Array();
        var tagElements = form.getElementsByTagName('input');
        for (var j = 0; j < tagElements.length; j++){
            elements.push(tagElements[j]);

        }
        return elements;
    }

//获取单个input中的【name,value】数组
    function inputSelector(element) {
        if (element.checked)
            return [element.name, element.value];
    }

    function input(element) {
        switch (element.type.toLowerCase()) {
            case 'submit':
            case 'hidden':
            case 'password':
            case 'text':
                return [element.name, element.value];
            case 'checkbox':
            case 'radio':
                return inputSelector(element);
        }
        return false;
    }

//组合URL
    function serializeElement(element) {
        var method = element.tagName.toLowerCase();
        var parameter = input(element);

        if (parameter) {
            var key = encodeURIComponent(parameter[0]);
            if (key.length == 0) return;

            if (parameter[1].constructor != Array)
                parameter[1] = [parameter[1]];

            var values = parameter[1];
            var results = [];
            for (var i=0; i<values.length; i++) {
                results.push(key + '=' + encodeURIComponent(values[i]));
            }
            return results.join('&');
        }
    }

//调用方法
    function serializeForm(formId) {
        var elements = getElements(formId);
        var queryComponents = new Array();

        for (var i = 0; i < elements.length; i++) {
            var queryComponent = serializeElement(elements[i]);
            if (queryComponent)
                queryComponents.push(queryComponent);
        }

        return queryComponents.join('&');
    }

    data =  serializeForm('param');
    url = settings_parameter;
/*	data="companyname="+encodeURIComponent($.trim($('#companyName').val()));
	data+="&companyaddress="+encodeURIComponent($.trim($('#companyAddress').val()));
	data+="&companytel="+encodeURIComponent($.trim($('#companyTel').val()));
	data+="&companyfax="+encodeURIComponent($.trim($('#companyFax').val()));
	data+="&postcode="+encodeURIComponent($.trim($('#postcode').val()));*/
	$.dialog.confirm("是否确认修改？", function() {
		$.ajax({
		type:"post",
		cache:false,
		url:url,
		data:data,
		dataType: "json",
		timeout:10000,
		success:function(t){
			if (200 === t.status) {
				parent.window.$.cookie("ReloadTips", "系统参数设置成功");
				parent.window.location.reload()
			}else{
                Public.tips({
                    type: 1,
                    content: "修改失败"
                })
			}
		},
		error: function(e) {
			Public.tips({
				type: 1,
				content: "保存失败" + e
			})
		}
		});
	})		
});