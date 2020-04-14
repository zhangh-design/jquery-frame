/**
 * datagrid(数据表格)封装 
 * lwh
 */
/*this.grid = new com.taijue.lwh.grid({
	width: '700',
	height: '250',
	url: '/read/lspolygon/module/showController/readLineGrid',
	searchBar: [
		{label: '名称:',id:'search_name',labelWidth:35,xtype: 'text',width:160},
		{text: '查询',xtype: 'button',style:'margin-left:10px;',
			iconCls: 'icon-search',
			onClick: this.search.bind(this)
		}
	],
	toolBar:  [
		{text: '添加',iconCls: 'icon-add',handler: this.add.bind(this)},
		{text: '删除',style: 'margin-left:10px;',iconCls: 'icon-remove',handler: this.delete.bind(this)},
		{text: '启用',style: 'margin-left:10px;',iconCls: 'icon-edit',handler: this.start.bind(this)}
	],
	menu:[
		{label: '定位',iconCls: 'icon-location-point',listeners: {
			onClick: this.locaPoint,
			scope: this
		}},
		{label: '预案管理',iconCls: 'icon-world',listeners: {
			onClick: this.locaPoint,
			scope: this
		}}
	],
	columns:[[
        {field:'name',title:'名称',width:100},
        {field:'voltage',title:'电压等级',width:100},
        {field:'dept_name',title:'维护部门',width:100,align:'right'},
        {field:'substation_rid',title:'所属变电站',width:100,align:'right'},
	]]
});
this.panel.appendChild(this.grid.panel); 
//搜索
search: function(){
	var val = document.getElementById('search_name').value;
	this.grid.load({name: val});
}
* */
com.taijue.lwh.grid = function(obj){
	for(var property in obj){
		this[property] = obj[property];
	}
	this.initComponent();
}
com.taijue.lwh.grid.prototype = {
	id: 0,				//面板id,随机层次不重复
	panel: null,		//面板
	width: 'auto',		//面板宽度
	height: 'auto',		//高度
	fit: false,			//面板大小将自适应父容器 设置的width、height将失效
	border: false,		//边框
	url: '', 			//数据请求地址 'tree_data1.json?a='+Math.random() 
    method: 'get',		//数据请求方式 默认'get'
    queryParams: {},	//请求的额外参数 {name: 'dhkf'}
	search_panel: null,	//搜索栏
    columns: null,		//DataGrid列配置对象
    singleSelect: true,	//如果为true，则只允许选择一行
    checkbox: false,	//如果为true，则显示复选框。该复选框列固定宽度
    pagination: true,	//如果为true，则在DataGrid控件底部显示分页工具栏
    rownumbers: true,	//如果为true，则显示一个行号列
    isSelectRow: true,  //是否默认选中一行
    pageSize: 5,		//设置分页属性的时候初始化页面数据量 30条数据
    pageList : [ 5, 10, 30, 40, 50, 100 ], //和pageSize组合使用
    loadMsg: '正在加载数据，请稍后...',
    displayMsg: '当前显示 {from} - {to} 条记录 共 {total} 条记录',
	initComponent: function(){
		//初始化组件
		this.id = 'datagrid-'+Math.floor(Math.random()*10000); //设置id
		this.createContent();
		this.createMenu();
		window.webkitRequestAnimationFrame((this.draw).bind(this));
	},
	draw: function(){
		var me = this;
		document.body.appendChild(this.tool_panel);
		//查询栏
		if('searchBar' in this){
			_.each(this.searchBar, function(element, index, list){
				me.createSearchBar(element, index, list);
			});
		}
		//按钮栏
		if('toolBar' in this){
			_.each(this.toolBar, function(element, index, list){
				me.createToolBar(element, index, list);
			});
		}
		//判断是否要添加复选框
		if(this.checkbox){
			this.columns[0].unshift({field:'ck',checkbox: this.checkbox});
		}
		//生成grid
		$(this.panel).datagrid({
		    url: this.url,
		    method: this.method,
		    queryParams: this.queryParams,
			singleSelect: this.singleSelect,
		    rownumbers: this.rownumbers,
		   	toolbar: this.tool_panel,
		   	pageList : this.pageList,
		    pageSize: this.pageSize,
		   	pagination: this.pagination,
		   	loadMsg: this.loadMsg,
		    columns: this.columns,
		    displayMsg: this.displayMsg,
		    loadFilter: this.loadFilter.bind(this),
		    onLoadSuccess : this.onLoadSuccess.bind(this),
		    onRowContextMenu: this.onContextMenu.bind(this),
		    onDblClickRow: this.onDblClickRow,
		    onBeforeLoad: this.onBeforeLoad.bind(this)
		});
		$(this.panel).datagrid("fitColumns");
		this.setPagination($(this.panel).datagrid('getPager'));
	},
	/******** 监听事件 ********/
	//返回过滤数据显示
	loadFilter: function(data){
		var list = data.value;
		return {"total":data.message,"rows":list};
	},
	onBeforeLoad: function(param){
		param.validatetoken = Ext.getData("/root/lspoygon/login/poygonLoginController/getValidateToken",{},'get').value
	},
	//在数据加载成功的时候触发
	onLoadSuccess : function(data){
		if(this.isSelectRow) $(this.panel).datagrid('selectRow',0);
	},
	/***** 对外接口 ******/
	//刷新,将保持在当前页
	reload: function(){
		$(this.panel).datagrid('reload');
	},
	//选中多行
	getSelections: function(){
		return $(this.panel).datagrid('getSelections');
	},
	//加载和显示第一页的所有行,传入查询参数将取代'queryParams'属性
	load: function(params){
		if(!(!!params)) return;
		$(this.panel).datagrid('load',params);
	},
	/****** 创建面板对象 *******/
	createContent: function(){
		//<table id="dg" class="easyui-datagrid" style="width:700px;height:250px"></table>
		var panel = document.createElement('table');
		panel.setAttribute('id','dg');
		panel.classList.add('easyui-datagrid');
		panel.setAttribute("style","width:"+this.width+"px;height:"+this.height+"px;");
		//不需要提供column的宽度，列宽自适应内容长度
		panel.setAttribute("data-options","fitColumns:true");
		
		//工具栏
		this.tool_panel = document.createElement('div');
		this.tool_panel.setAttribute('style','padding:2px 5px;width:100%;');
		this.tool_panel.classList.add('datagrid-toolbar');
		//搜索bar
		this.search_panel = document.createElement('div');
		this.search_panel.classList.add('grid-search-panel');
		this.search_panel.setAttribute('style','height:auto;');
		
		//按钮bar
		this.bar_panel = document.createElement('div');
		this.bar_panel.classList.add('grid-bar-panel');
		this.bar_panel.setAttribute('style','height:auto;padding: 3px 0px 3px 0px;');
		
		this.tool_panel.appendChild(this.search_panel);
		this.tool_panel.appendChild(this.bar_panel);
		
		this.panel = panel;
	},
	//文本、时间控件等，搜索、重置按钮
	createSearchBar: function(element, index, list){
		var me = this;
		if(element.xtype=='text'||element.xtype=='password'){
			var p = document.createElement('input');
			p.setAttribute('id',element.id);
			p.setAttribute('type',element.xtype);
			p.setAttribute('style',element.style);
			this.search_panel.appendChild(p);
			
			$(p).textbox(element);
		}
		if(element.xtype=='button'){
			var s_btn = document.createElement('a');
			s_btn.setAttribute('id','btn');
			s_btn.setAttribute('href','javascript:void(0)');
			s_btn.setAttribute('style',element.style);
			this.search_panel.appendChild(s_btn);
			
			$(s_btn).linkbutton(element);
		}
	},
	//按钮 添加、删除、启用等按钮
	createToolBar: function(element,index,list){
		var btn = document.createElement('a');
		btn.setAttribute('href','javascript:void(0)');
		btn.setAttribute('style',element.style);
		btn.onclick = element.handler;	//事件
		this.bar_panel.appendChild(btn);
		
		$(btn).linkbutton(element);
	},
	//右键菜单按钮menu
	onContextMenu: function(e, index, row){
		if(!(!!this.menu)){
			return;
		}
		if('preventDefault' in e){
			e.preventDefault();
		}
		var me = this;
		//切换所有按钮组的样式
		if($("#tree_mm").children('.'+me.id).css('display')=='none'){
			$("#tree_mm").children('.'+me.id).show();
		}
		$("#tree_mm").children().not('.'+me.id).hide();
		$(this.panel).datagrid('uncheckAll');		//取消勾选所有行
		$(this.panel).datagrid('selectRow',index);	//选中某一行
		
		$("#tree_mm").menu('show',{
			left: e.pageX,
			top: e.pageY
		});
	},
	//创建右键菜单容器
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
						$("#tree_mm").menu("hide");
						//获取选中的行
						var record = $(me.panel).datagrid('getSelections');  
						var singlerecord = $(me.panel).datagrid('getSelected'); //选中第一行
						element.listeners[key].call(scope,singlerecord,record);
						event.stopPropagation();
					});
				}
			}
			document.getElementById('tree_mm').appendChild(div);
		});
	},
	//设置底部分页工具栏
	setPagination: function(pager){
		var me = this;
		pager.pagination({
			showPageList: false, //隐藏导航列表
			beforePageText: '第',
	        //页数文本框前显示的汉字
	        afterPageText: '页 共 {pages} 页',
	        displayMsg: me.displayMsg
		});
	}
}











