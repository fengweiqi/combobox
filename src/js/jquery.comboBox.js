;(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define(["jquery"], factory);
	} else {
		// 全局模式
		factory(jQuery);
	}
}(function($) {

	var pluginName = 'comboBox';  //插件名称

    var Privateclass = function(el) {//私有类
			this.el=el;
			this.opts=el.data(pluginName);//获取插件参数
			this.data=function(dataName,opts){
				el.data(dataName,opts);
			}
			this.render();
	}
	Privateclass.prototype = {

		render:function(){//渲染
			
			var inputWrap = document.createElement('div');

				inputWrap.className = 'inputWrap';

				ul = document.createElement('ul');

				ul.className = 'inputUlList';

				$(this.el).wrap(inputWrap);

				$(this.el).after(ul);

				this.select().focus().hideList();
		},

		resetList:function(options){//重置列表数据
				var opts = {
						data:[],
						callback:function(){

						}
				};

				opts = $.extend({},opts,options);
				
				var that = this;

				var $ul = that.el.parent().find('ul');

				$ul.html('');

				$.each(opts.data, function(index, val) {

					var li = document.createElement('li');

					var a = document.createElement('a');

						$(a).attr('data-value',this.value).html(this.text);
						$(li).append(a);
					
					
						$ul.append(li);
				});
				
				
				
		},

		select:function(){//选择

			var that = this;

			var $ul = that.el.parent().find('ul');

			$ul.on('click','a', function(event) {
			
				var val = $(this).attr('data-value');
				var text = $(this).text();

				that.el.val(val);
				$ul.hide();
			});

			return this;
		},


		focus:function(){
			var $ul = this.el.parent().find('ul');
			this.el.on('focus', function(event) {
				$ul.show();
			});
			
			
			return this;
		},

		hideList:function(){

			var ul = this.el.parent().find('ul').get(0);

			var that = this;

			$('html').on('click', function(event) {

				var e = window.event||event;

				var target = e.srcElement||e.target;

				var input = that.el.get(0);

				if(ul !==target && !$.contains(ul, target)&&input !==target && !$.contains(input, target)){

					$(ul).hide();

				}
			});

			return this;
		}
	}
	var privateclass=[];//用于私有类实例化
	var methods = {//对外接口

		init: function(options){

			return this.each(function() {
				var $this = $(this);
				var opts = $this.data(pluginName);
				if(typeof(opts) == 'undefined') {

					var defaults = {
							id:0, 
						    slideTime:700,	//动画滑行速度，越大越慢
						    autoPlay:true,	//true为自动播放，
						    pauseTime:3000,	//动画暂停时间
						    hoverPause:false, //是否鼠标悬停,默认为false
						    index:0, //展示项目的索引
						    autoReSize:true, //是否自适应
						    derection:'h'//h水平滑动，v垂直方向滑动
					   };

					opts = $.extend({}, defaults, options);
					$this.data(pluginName, opts);

				} else {

					opts = $.extend({}, opts, options);

				}
				opts.id=new Date().getTime();
				privateclass[opts.id]=new Privateclass($this);
				// 代码在这里运行
				


			});
		},

		resetList:function(data){

			return $(this).each(function() {
					var opts = $(this).data(pluginName);
					privateclass[opts.id].resetList(data);

			});
		},

		bindListener:function(data){

			return $(this).each(function() {
					var opts = $(this).data(pluginName);
					privateclass[opts.id].bindListener(data);

			});
		}

	};
	$.fn[pluginName] = function() {
		var method = arguments[0];

		if(methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if( typeof(method) == 'object' || !method ) {
			method = methods.init;
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.easySlide' );
			return this;
		}
		
		return method.apply(this, arguments);

	}
}));

