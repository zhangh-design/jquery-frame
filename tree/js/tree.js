/**
 * tree封装 
 * lwh
 */
/*var tree = new com.taijue.lwh.tree({
	url: '/read/lspolygon/module/showController/readPoygonTree',
	menu: [
		{label: '定位',iconCls: 'icon-location-point',listeners:{onClick: window.locaPoint,scope: window}}
	]
});
this.panel.appendChild(tree.panel);*/
(function(){
	var menu  = document.createElement('div');
	menu.setAttribute("id","tree_mm");
	menu.style.width = "120px";
	menu.classList.add('easyui-menu');
	
	document.body.appendChild(menu);
})();
com.taijue.lwh.tree = function(obj){
	for(var property in obj){
		this[property] = obj[property];
	}
	this.initComponent();
}
com.taijue.lwh.tree.prototype = {
	time: 0,			//监听次数
	id: 0,				//面板id,随机层次不重复
	panel: null,		//面板
	width: 'auto',		//面板宽度
	height: 'auto',		//高度
	url: 'tree_data1.json', 	//数据请求地址 'tree_data1.json?a='+Math.random() 
    method: 'get',		//数据请求方式 默认'get'
    queryParams: {},	//查询参数
    animate: true,		//定义节点在展开或折叠的时候是否显示动画效果
    menu: [],			//菜单 [{label: '定位',listeners:{onClick: window.locaPoint,scope: window}}]
    rootId:	'0-1',		//根目录id
    rootText: '根目录',	//根目录text
	initComponent: function(){
		//初始化组件
		this.id = 'tree-'+Math.floor(Math.random()*10000); //设置id
		this.createContent();
		this.createMenu();
		this.time = 0;
		this.listenDom();
	},
	listenDom: function(){
		var me = this;
		setTimeout(function(){
			me.time++;
		    if(me.time>10){
		    	console.info('元素未找到');
		    	me.time = 0;
		    	return;
		    }
		    var status = me.draw();
		    if(!status){
		    	setTimeout(arguments.callee,100);
		    }else{
		    	me.time = 0;
		    }
		},100);
	},
	draw: function(){
		var me = this;
		if($(this.panel).children().eq(0).length==0){
			return false;
		}
		this.onContextMenu = function(e,node){
			e.preventDefault();
			//切换所有按钮组的样式
			if($("#tree_mm").children('.'+me.id).css('display')=='none'){
				$("#tree_mm").children('.'+me.id).show();
			}
			$("#tree_mm").children().not('.'+me.id).hide();
			$(this).tree('select',node.target);
			//父节点不显示menu
			if(node.childs==undefined){	
				($("#tree_mm")).menu('show',{
					left: e.pageX,
					top: e.pageY
				});
			}
		}
		this.loadFilter = function(data){
			var list = data.value;
			for (var i=0;i<list.length;i++) {
					if(!me.isAllOpen&&list[i].childs > 0){
						list[i].state = ('state' in list[i]) ? list[i].state : 'closed';
					}
				}
			if(!me.rootOneStatus){
				var new_data = {};
		    	new_data.id = me.rootId;
		    	new_data.text = me.rootText;
		    	new_data.children = list;
		    	
		    	var result = [];
		    	result.push(new_data);
		    	me.rootOneStatus = true;
		    	return result;
			}else {
				return list;
			}
		}.bind(this);
		var me = this,$_tree = $(this.panel).children().eq(0);
		$_tree.tree(Object.assign(this,{onBeforeLoad: this.onBeforeLoad.bind(this)}));
		return true;
	},
	getOptions: function(){
		return	$(this.panel).children().eq(0).tree("options");
	},
	onBeforeLoad: function(node, param){
		param.validatetoken = Ext.getData("/root/lspoygon/login/poygonLoginController/getValidateToken",{},'get').value
	},
	//右键菜单栏
	createMenu: function(){
		var me = this;
		_.each(me.menu, function(element, index, list){
			var div = document.createElement('div');
			div.classList.add('menu-item',me.id);
			var html = '<div class="menu-text" style="height: 20px; line-height: 20px;">'+element.label+'</div>';
			if('iconCls' in element){
				html+="<div class='menu-icon "+element.iconCls+"'></div>";
			}
			div.innerHTML = html;
			//添加事件
			if('listeners' in element){
				var scope = element.listeners.scope;
				delete element.listeners["scope"];
				for(var key in element.listeners){
					var eventName = (key.replace('on','')).toLowerCase();
					$(div).on(eventName, function(e){
						var node = $(me.panel).children().eq(0).tree("getSelected");
						$("#tree_mm").menu("hide");
						element.listeners[key].call(scope,node);
						event.stopPropagation();
					});
				}
			}
			document.getElementById('tree_mm').appendChild(div);
		});
		
		/*var div = document.createElement('div');
		div.classList.add('menu-item');
		div.innerHTML = '<div class="menu-text" style="height: 20px; line-height: 20px;">Collapse-123</div>'+"";
		div.onclick = function(event){
			var node = $(me.panel).children().eq(0).tree("getSelected");
			$("#tree_mm").menu("hide");
			event.stopPropagation();
		}
		document.getElementById('tree_mm').appendChild(div);*/
	},
	createContent: function(){
		var panel = document.createElement('div');
		panel.classList.add('easyui-panel');
		panel.setAttribute("style","width:"+this.width+"px;height:"+this.height+"px;overflow:auto;");
		
		var ul = document.createElement('ul');
		ul.classList.add("easyui-tree");
		
		panel.appendChild(ul);
		this.panel = panel;
	}
}






