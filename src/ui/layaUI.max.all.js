var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var OperationPanelUI=(function(_super){
		function OperationPanelUI(){
			
		    this.playerText=null;
		    this.btnReady=null;
		    this.btnDice=null;
		    this.btnExit=null;

			OperationPanelUI.__super.call(this);
		}

		CLASS$(OperationPanelUI,'ui.OperationPanelUI',_super);
		var __proto__=OperationPanelUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(OperationPanelUI.uiView);

		}

		OperationPanelUI.uiView={"type":"View","props":{"x":0,"width":400,"height":700},"child":[{"type":"Image","props":{"y":55,"x":29,"width":342,"skin":"template/Warn/alert_dialog.png","height":234}},{"type":"TextArea","props":{"y":77,"x":56,"width":290,"var":"playerText","text":"TextArea","height":192,"fontSize":20,"editable":false}},{"type":"Button","props":{"y":600,"x":40,"width":100,"var":"btnReady","skin":"comp/button.png","name":"btnReady","labelSize":20,"labelFont":"SimHei","label":"准备","height":50}},{"type":"Button","props":{"y":600,"x":150,"width":100,"var":"btnDice","skin":"comp/button.png","name":"btnDice","labelSize":20,"labelFont":"SimHei","label":"掷骰子","height":50}},{"type":"Button","props":{"y":600,"x":260,"width":100,"var":"btnExit","skin":"comp/button.png","name":"btnExit","labelSize":20,"labelFont":"SimHei","label":"退出","height":50}}]};
		return OperationPanelUI;
	})(View);
var QuestionDialogUI=(function(_super){
		function QuestionDialogUI(){
			
		    this.btnConfirm=null;

			QuestionDialogUI.__super.call(this);
		}

		CLASS$(QuestionDialogUI,'ui.QuestionDialogUI',_super);
		var __proto__=QuestionDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(QuestionDialogUI.uiView);

		}

		QuestionDialogUI.uiView={"type":"Dialog","props":{"width":600,"height":400},"child":[{"type":"Image","props":{"y":105,"x":121,"width":338,"skin":"comp/bg.png","height":266}},{"type":"RadioGroup","props":{"y":212,"x":156,"width":320,"space":20,"skin":"comp/radiogroup.png","selectedIndex":0,"labels":"选项A,label2,label2,label2","labelPadding":"0,0,0,10","labelFont":"SimHei","height":150,"direction":"vertical"}},{"type":"Label","props":{"y":159,"x":151,"width":281,"text":"校园中的毛爷爷雕塑指向哪里？","height":27,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Button","props":{"y":325,"x":355,"width":72,"var":"btnConfirm","skin":"comp/button.png","name":"btnConfirm","labelSize":15,"labelFont":"SimHei","label":"确定","height":27}},{"type":"Label","props":{"y":126,"x":150,"text":"问题:","fontSize":16,"font":"SimHei","color":"#ffffff"}}]};
		return QuestionDialogUI;
	})(Dialog);