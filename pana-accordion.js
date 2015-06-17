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
			extpand: 1,
			autoPlay: true,
			delay: 3000,
			animateTime: 300,
			bounce:"-50px"
		},options);
		that.initDom(options);
		that.autoPlay(options);
		that.event(options);
	},
	event: function(options){
		var that=this,
				$items=$("#"+options.id).find(".pana-accordion-item");
		$items.on("mouseover",function(){
			that.clearAnimate();
			that.active(options,$(this));
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
			that.active(options,$next);
			that.autoPlay(options);
		},options.delay);
	},
	active: function(options,$current){
		if($current && $current.hasClass('active')) return;

		var $items=$("#"+options.id).find(".pana-accordion-item"),
				currentIndex=$current.index();
				itemWidth=options.itemWidth,
				expandWidth=options.expandWidth;

		$items.removeClass("active");
		$items.each(function(i,elem){
			var $item=$(elem),
					pos_left=(i==0 ? 0 : i*itemWidth );

			if(i>currentIndex){
				pos_left+=expandWidth-itemWidth;
			}

			if(i==currentIndex){
				$item.addClass('active').stop(true).animate({
					"width": options.expandWidth+"px",
					"left": pos_left
				},options.animateTime);
			}else{
				$item.stop(true).animate({
					"left": pos_left
				},options.animateTime);
			}
		});
	},
	isRestart:function($current,$active,$items){
		return $active.index()===$items.length-1 && $current.index()===0
	},
	initDom: function(options){
		var that=this,
				$items=$("#"+options.id).find(".pana-accordion-item");

		$items.each(function(i,elem){
			$(elem).css("z-index",i+1);
		})
		that.active(options,$items.eq(options.extpand));
	}
}

$(function(){
	accordion.init({
		id: 'accordion',
		extpand: 0
	});
});