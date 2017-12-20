var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var OperationPanelUI=(function(_super){
		function OperationPanelUI(){
			
		    this.btnExit=null;
		    this.btnReady=null;
		    this.btnDice=null;

			OperationPanelUI.__super.call(this);
		}

		CLASS$(OperationPanelUI,'ui.OperationPanelUI',_super);
		var __proto__=OperationPanelUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(OperationPanelUI.uiView);

		}

		OperationPanelUI.uiView={"type":"View","props":{"x":0,"width":400,"height":700},"child":[{"type":"Tab","props":{"y":552,"x":212,"width":458,"selectedIndex":2,"pivotY":84,"pivotX":228,"height":167},"child":[{"type":"Button","props":{"y":102,"x":236,"width":143,"var":"btnExit","skin":"template/ButtonTab/btn_LargeTabButton_Right.png","name":"btnExit","labelSize":20,"labelColors":"#007AFF,#007AFF,#FFFFFF","label":"退出","height":66}},{"type":"Button","props":{"y":102,"x":52,"width":143,"var":"btnReady","skin":"template/ButtonTab/btn_LargeTabButton_Right.png","name":"btnReady","labelSize":20,"labelColors":"#007AFF,#007AFF,#FFFFFF","label":"准备","height":66}},{"type":"Button","props":{"y":102,"x":138,"width":143,"visible":false,"var":"btnDice","skin":"template/ButtonTab/btn_LargeTabButton_Right.png","name":"btnDice","labelSize":20,"labelColors":"#007AFF,#007AFF,#FFFFFF","label":"掷骰子","height":66}}]},{"type":"Image","props":{"y":55,"x":29,"width":342,"skin":"template/Warn/alert_dialog.png","height":234}},{"type":"TextArea","props":{"y":77,"x":56,"width":290,"text":"TextArea","height":192,"editable":false}}]};
		return OperationPanelUI;
	})(View);