/*
author: pace zhong
date: 2015-06-10
desc: validation framework for you.jd.com
*/
var vaildation={ 
	init: function (options){
		var that=this;
		options = $.extend(true,{
			checkingText:　"checking...",
			msg: that.msg, //提示信息
			submit: false //验证通过是否提交表单
		},options);

		if(!options.formId || !options.rules || !$.isArray(options.rules)){
			return;
		}

		that.bindValidation(options);

	},
	bindValidation: function(options){
		var that=this,
				$form=$("#"+options.formId),
				rules=options.rules;
		
		$form.on("submit",function(e){
			e.preventDefault();
			var ajaxTempCount=0;
			var allSuccess=function(){
				if(typeof options.success ==="function"){
					options.success($form);
				}
				if(options.submit==true){
					this.submit();
				}
			}


			if(that.validForm(rules,options)){
				var ajaxQueue=that.ajaxQueue,
						ajaxCount=ajaxQueue.length;
				//是否存在异步校验队列
				if(ajaxQueue.length>0){
					for(var i=0; i<ajaxCount; i++){
						var data={},
								$elem=$("#"+options.formId+" "+ajaxQueue[i]['selector']);

						data[ajaxQueue[i].dataname]=ajaxQueue[i].value;
						that.createExplain($elem,options.checkingText,"checking");

						$.ajax({
							elem: ajaxQueue[i]['selector'],
							url: ajaxQueue[i].url,
							data: data,
							success: function(msg){
								if(msg.success){
								 	apijaxTempCount+=1;
								 	if(ajaxTempCount>=ajaxCount){
										allSuccess();
									}
									that.clearExplain($("#"+options.formId+" "+this.elem));
								}else{
									//校验失败
									var $elem=$("#"+options.formId+" "+this.elem);
									that.showError({
										type: 'ajax',
										options: options,
										elem: $elem,
										msg: $elem.data('name')+result.errorMsg
									});
									if(typeof options.error==="function"){
										options.error($elem);
									}
								}
							},
							error: function(){
								//校验失败
								var $elem=$("#"+options.formId+" "+this.elem);
								that.showError({
									type: 'ajax',
									options: options,
									elem: $elem,
									msg: options.msg.netError
								});

								if(typeof options.error==="function"){
									options.error($elem);
								}
							}
						})

						/* 
						Site.api.getVaildResult(ajaxQueue[i]['url'],data,
							success: function(data){
								if(data.success){
								 	apijaxTempCount+=1;
								 	if(ajaxTempCount>=ajaxCount){
										allSuccess();
										//clear checking text
									}
								}else{
									that.showError({
										type: 'ajax',
										options: options,
										elem: $elem,
										msg: options.msg.netError
									});
								}
						 	},
						 	error: function(data, xhr, textStatus, errorThrown, btnHelper){
								that.showError({
									type: 'ajax',
									options: options,
									elem: $elem,
									msg: options.msg.netError
								});
						 	}
		        }
		        */
					}
				}else{
					//没有异步校验直接通过
					allSuccess()
				};
			}

			that.clearAjaxQueue();
		});

		if(options.trigger!=="submit"){
			for(var i=0; i<rules.length; i++){
				var $elem=$("#"+options.formId+" "+rules[i].selector);
				that.bindEvent($elem,rules[i].rule,options);
			}
		}
	},
	bindEvent:function($elem,rules,options){
		var that=this,
				trigger=options.trigger ? options.trigger : 'change'

		$elem.on(trigger,function(){
			that.vaildItem($elem,rules,options);
		});

	},
	validForm: function(rules,options){
		var that=this,result=true
		for(var i=0; i<rules.length; i++){
			if(!that.vaildItem($(rules[i]['selector']),rules[i].rule,options)){
				result=false;
			};
		}
		if(!rules) that.clearAjaxQueue();
		return result;
	},
	vaildItem: function($elem,rules,options){
		var that=this,
				type=$elem.attr("type");

		switch (type){
			case 'text': 
				var value=$elem.val();
				//文本框校验
				for(var ruleName in rules){
					if(ruleName == "ajax"){
						var ajaxVaildObject={
							selector:　$elem.selector,
							dataname: $elem.attr("name"),
							value: $.trim($elem.val()),
							url: rules[ruleName].url,
							errorMsg: rules[ruleName].errorMsg
						};
						that.ajaxQueue.push(ajaxVaildObject); 
					};
					if(ruleName in that._rules){
						if(!that._rules[ruleName]($elem,value,that.getArg(rules,ruleName),rules[ruleName]['maxLength'])){
							that.showError({
								type: ruleName,
								options: options,
								elem: $elem,
								rules: rules
							});
							if(typeof options.error==="function"){
								options.error($elem);
							}
							return false;
						};

						that.clearExplain($elem);
					}
				}
				break;
			default: 
				//selected,checkbox,radio校验 (只校验必选)
				for(var ruleName in rules){
					if(ruleName==="required"){
						if(!that._rules[ruleName]($elem,value,that.getArg(rules,ruleName),rules[ruleName]['maxLength'])){
							that.showError({
								type: ruleName,
								options: options,
								elem: $elem,
								rules: rules
							});
							if(typeof options.error==="function"){
								options.error($elem);
							}
							return false;
						}
						that.clearExplain($elem);
					}
				}
				break;							
		}

		return true;
	},
	getArg:function(rules,ruleName){
		var rule=rules[ruleName];
		if(ruleName === "regExp") return rule.exp;
		if(typeof rule === "number") return rule;
		if(rule.len || rule.len==0) return rule.len;
		if(rule.minLength || rule.minLength==0) return rule.minLength;
		if(rule.regExp) return rule.regExp;
	},
	_rules:{
		required: function($elem,value){ 
			if($elem.is('select')){
				var $selected=$elem.find("option:selected");
				return ($selected.length>0 && $selected.val()!=="unselected")
			}
			if($elem.attr('type')!=="text"){
				return ($elem.filter(":checked").length>0);
			}
			return $.trim(value).length > 0 
		},
		zipCode: function($elem,value){return /^[1-9][0-9]{5}$/.test(value) || !this.required($elem,value)},
		email: function($elem,value){ return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value) || !this.required($elem,value)},
		url: function($elem,value){ return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value) || !this.required($elem,value)},
		dateISO: function($elem,value){ return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value) || !this.required($elem,value)},
		number: function($elem,value){ return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) || !this.required($elem,value)},
		digits: function($elem,value){ return /^\d+$/.test(value) || !this.required($elem,value)},
		idCard: function($elem,value) { return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) || !this.required($elem,value)},
		minLength: function($elem,value,len) {
			var str=$.trim(value).toString(); 
			return str.length > len || !this.required($elem,value)
		},
		maxLength: function($elem,value,len) {
			var str=$.trim(value).toString(); 
			return str.length < len || !this.required($elem,value)
		},
		rangeLength: function($elem,value,minLength,maxLength) {
			var len=$.trim(value).toString().length; 
			return ((len >= minLength && len <= maxLength) || !this.required($elem,value));
		},
		rangeDate:　function($elem,start,end) { return parseInt(start,10) <= parseInt(end,10); },
		regExp: function($elem,value,regExp) { return regExp.test(value)}
	},
	msg: {
		required: "%s不能为空 !",
		zipCode: "请输入正确的邮编	!",
		email: "请输入正确的email格式!",
		url: "请输入正确的url!",
		dateISO: "请输入正确的日期格式!",
		number: "请输入有效数字!",
		digits: "只能数字!",
		idCard: "请输入正确的身份证号码!",
		minLength: "%s最小长度为%s!",
		maxLength: "%s最大长度为%s!",
		rangeLength: "%s字符长度范围为 %s - %s!",
		rangeDate: "开始日期不能小于结束日期!",
		netError: "网络异常，请稍后再试!"
	},
	showError: function(config){
		var that=this,
				type=config.type,
				options=config.options,
				$elem=config.elem,
				rules=config.rules,
				msg=config.msg;

		if(rules && type) rule=rules[type];
		switch(type){
			case 'rangeLength':
				that.createExplain($elem,that.formatMsg(options.msg[type],($elem.data("name") ? $elem.data("name") : ''),rule.minLength,rule.maxLength),'form-item-explain-error');
				break;
			case 'minLength':
			case 'maxLength':
				that.createExplain($elem,that.formatMsg(options.msg[type],($elem.data("name") ? $elem.data("name") : ''),rule),'form-item-explain-error');
				break;
			case 'regExp':
				that.createExplain($elem,rule.errorMsg,'form-item-explain-error');
				break;
			case 'ajax':
				that.createExplain($elem,msg,'form-item-explain-error');
				break;
			default:
				that.createExplain($elem,that.formatMsg(options.msg[type],($elem.data("name") ? $elem.data("name") : '')),'form-item-explain-error');
				return
		}
		
	},
	clearExplain: function($elem){
		var $explain=$elem.closest(".form-item").children(".form-item-explain");
		if($explain.attr("error-from")===$elem.attr("name")){
			$explain.empty();
			return;
		}
		if(!$elem.attr("name")){
			$explain.empty();
			return;
		}
	},
	createExplain: function($elem,msg,className){
		var $formItem=$elem.closest(".form-item"),
				$explain=$formItem.children(".form-item-explain");
		if($explain.length==0){
			$formItem.append('<div error-from="'+$elem.attr("name")+'" class="form-item-explain '+className+'">'+msg+'</div>');
		}
		$explain.removeClass("checking,form-item-explain-error").addClass(className).attr("error-from",$elem.attr("name")).html(msg);
	},
	clearAjaxQueue: function(){
		this.ajaxQueue=[];
	},
	formatMsg: function(text){
		var args = Array.prototype.slice.apply(arguments, [1]);
    for(var i = 0, j = args.length; i < j; i++){
      text = text.replace("%s", args[i]);
    }
    return text;
	},
	ajaxQueue: []
};