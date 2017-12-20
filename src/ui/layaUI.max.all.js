var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var OperationPanelUI=(function(_super){
		function OperationPanelUI(){
			

			OperationPanelUI.__super.call(this);
		}

		CLASS$(OperationPanelUI,'ui.OperationPanelUI',_super);
		var __proto__=OperationPanelUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(OperationPanelUI.uiView);

		}

		OperationPanelUI.uiView={"type":"View","props":{"x":0,"width":600,"height":1000},"child":[{"type":"Tab","props":{"y":878,"x":306,"width":458,"selectedIndex":2,"pivotY":84,"pivotX":228,"height":167},"child":[{"type":"Button","props":{"y":103,"x":54,"width":136,"skin":"template/ButtonTab/btn_LargeTabButton_Left.png","name":"item0","labelSize":36,"labelColors":"#007AFF,#007AFF,#FFFFFF","label":"准备","height":65}},{"type":"Button","props":{"y":102,"x":236,"width":143,"skin":"template/ButtonTab/btn_LargeTabButton_Right.png","name":"item2","labelSize":36,"labelColors":"#007AFF,#007AFF,#FFFFFF","label":"退出","height":66}}]},{"type":"TextArea","props":{"y":19,"x":129,"width":334,"text":"TextArea","height":261}},{"type":"Image","props":{"y":55,"x":29,"width":542,"skin":"template/Warn/alert_dialog.png","height":369}},{"type":"Label","props":{"y":78,"x":57,"width":488,"skin":"template/Warn/label.png","height":328,"fontSize":28,"color":"#030406","align":"center"}}]};
		return OperationPanelUI;
	})(View);