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
			animateTime: 300,
			bounce:"-50px"
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


		var that=this,
				$items=$("#"+options.id+" .pana-accordion-item"),
				$active=$current.closest(".pana-accordion").find(".active");

		$items.css("z-index",'2');


		$current.next().css("z-index",'1');
		if(that.isRestart($current,$active,$items)){
			var animateParam={"width":options.itemWidth+"px"}
		}else{
			var animateParam={"width":options.itemWidth+"px","margin-left":options.bounce}
		}
		$active.stop().animate(animateParam,options.animate,function(){
			$active.removeClass('active');
			if(!that.isRestart($current,$active,$items)){
				$active.animate({"margin-left":0},'100');
			}
		});

		if(that.isRestart($current,$active,$items)){
			var $next=$current.next();
			animateParam["margin-left"]=options.bounce;
			$next.stop().animate(animateParam,options.animate,function(){
				$next.removeClass('active');
				$next.animate({"margin-left":0},'100');
			});
		}

		$current.addClass('active').stop().animate({
			"width": options.expandWidth+"px",
		},options.animateTime);

	},
	isRestart:function($current,$active,$items){
		return $active.index()===$items.length-1 && $current.index()===0
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