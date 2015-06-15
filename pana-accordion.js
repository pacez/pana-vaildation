/*
author: pace zhong
date: 2015-06-15
desc: banner component for you.jd.com
*/
var accordion={
	init: function(options){
		var that=this;
		options = $.extend(true,{
			expandWidth: 500,
			itemWidth: 100,
			extpand: 0,
			autoPlay: true,
			delay: 3000,
			animateTime: 300
		},options);
		that.setExpand(options);
		that.autoPlay(options);
		that.event(options);
	},
	event: function(options){
		var that=this,
				$items=$("#"+options.id).find(".pana-accordion-item");
		$items.on("mouseover",function(){
			that.clearAnimate();
			var $this=$(this);
			that.active($this,options);
		});
		$items.on("mouseout",function(){
			that.autoPlay(options);
		});
	},
	clearAnimate: function(){
		if(this.delay){
			clearTimeout(this.delay);
		}
	},
	autoPlay: function(options){
		var that=this;
		that.clearAnimate();
		that.delay=setTimeout(function(){
			$next=$("#"+options.id).find(".active").next();
			if($next.length==0) {
				$next=$("#"+options.id).find(".pana-accordion-item:eq(0)");
			}
			that.active($next,options);
			that.autoPlay(options);
		},options.delay);
	},
	active: function($current,options){
		if($current.hasClass('active')) return;
		var $active=$current.closest(".pana-accordion").find(".active");
		$active.stop().animate({"width":options.itemWidth+"px"},options.animate,function(){
			$active.removeClass('active');
		});
		$current.addClass('active').stop().animate({
			"width": options.expandWidth+"px",
		},options.animateTime);
	},
	setExpand: function(options){
		var $item=$("#"+options.id).find(".pana-accordion-item:eq("+options.extpand+")");
		$item.addClass('active').animate({
			"width": options.expandWidth+"px",
		},options.animateTime);

	}
}

$(function(){
	accordion.init({
		id: 'accordion'
	});
});