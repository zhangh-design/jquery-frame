/**
 * msgconfirm 弹出框组件
 * lbc
 */

com.taijue.lwh.msgconfirm = function(title,msg,fn,scope){
	if(!!fn){
		$.messager.confirm(title,msg,function(b){
			fn.call(scope,b);
		});
	}else{
		$.messager.confirm(title,msg);
	}
}
