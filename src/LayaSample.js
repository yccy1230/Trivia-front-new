//导包
var tiledMap;
var operationView;
var questionDialog;
var Handler= Laya.Handler;
var Stage     = Laya.Stage;
var TiledMap  = Laya.TiledMap;
var Rectangle = Laya.Rectangle;
var WebGL     = Laya.WebGL;
var Event = Laya.Event;
var Socket = Laya.Socket;
var Byte   = Laya.Byte;

// 定义常量
var GAME_READY = 0;
var GAME_DICE_RESULT = 1;
var GAME_ANSWERING_QUESTION = 2;
var GAME_ANSWER_QUESTION_RESULT = 3;
var GAME_OVER = 4;
var ROOM_WAITING = 0;
var ROOM_PLAYING = 1;

//View Global Variable
var traceBits=[1,1,2,2,1,1,1,0,0,1,1,1,1,1,2,2,2,3,3,3,2,2,2,1,1,1,2,2,2,2,3,3,3,3,3,3,0,0,0,0,3,3,2,2,2,2,3,3,0,0,0,0,0,0,0,0,0,0];
var graph;
var unit_x=100;
var unit_y=80;
var roles;

//Game Data Variables
var myUserId;
var players;

function OperationPanel()
{
	OperationPanel.super(this);   
}
function QuestionDialog()
{
	QuestionDialog.super(this);
}

(function()
{
    // 不支持WebGL时自动切换至Canvas
    Laya.init(1500, 950, WebGL);

    //调用DebugTool调试面板
    // Laya.DebugTool.init();
    Laya.stage.alignV = Stage.ALIGN_MIDDLE;
    Laya.stage.alignH = Stage.ALIGN_CENTER;
    Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
    Laya.stage.bgColor = "#FFFFFF";

    createMap();
	
})();

function initData(){
    $.ajax({
        type: "GET",
        url: "http://localhost/trivia/game/refresh/",
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        success: function (body) {
            if (body.resCode !== "200") {
                alert("拉取房间数据出错！");
            }   
        }
    });
}

function createDice(){
    operationView.btnDice.on(Event.CLICK, this, initDiceBtnListener);
}

function initDiceBtnListener(){
    $.ajax({
        type: "GET",
        url: "http://localhost/trivia/game/roll/dice/",
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        success: function (body) {
            if (body.resCode !== "200") {
                alert(body.resMsg);
            } else{
                setBtnVisibility(false,false,false);
            }  
        }
    });
}

/**
 * 建立WebSocket连接
 */
function connect()
{
    socket = new Socket();
    //socket.connect("echo.websocket.org", 80);
    socket.connectByUrl("ws://localhost:8080/trivia/websocket/");

    output = socket.output;

    socket.on(Event.OPEN, this, onSocketOpen);
    socket.on(Event.CLOSE, this, onSocketClose);
    socket.on(Event.MESSAGE, this, onMessageReveived);
    socket.on(Event.ERROR, this, onConnectError);
}


function onSocketOpen()
{
    console.log("Connected");
}

function onSocketClose()
{
    console.log("Socket closed");
}

function onMessageReveived(message)
{
    console.log("Message from server:");
    var json = JSON.parse(message); //由JSON字符串转换为JSON对象
    refreshUI(json);
    console.log(json);
    socket.input.clear();
}

function onConnectError(e)
{
    console.log("error");
    alert("socket建立失败");
}

function refreshUI(message){
    if(typeof message.nickName !== 'undefined'){
        //socket连接数据包，更新玩家ID
        myUserId = message.id;
        return;
    }
    if(message.status === ROOM_PLAYING){
        refreshPlayerPanel(message);
        refreshPlayerPosition(message);
        refreshOpeartionpanel(message);
    } else if (message.status === ROOM_WAITING){
        
    }else{
        console.log("房间状态不正确！");
    }
}

/**
 * 刷新操作按钮
 * @param {*} message 
 */
function refreshOpeartionpanel(message){
    var stage = message.game.stage;
    var curPlayer;
    $.each(message.playerList,function(index,item){
        if(item.id === message.game.currentPlayerId) {
            curPlayer = item.userId;
            return false;
        }
    });
    setBtnVisibility(false,false,false);
    switch(stage){
        case GAME_READY:
            //新一轮游戏就绪 UI数据包
            if(curPlayer===myUserId){
                setBtnVisibility(false,false,true);
            }
        break;
        case GAME_DICE_RESULT:
            //掷骰子点数结果 UI数据包
            var dice = $("#dice");
            dice.attr("class","dice");//清除上次动画后的点数 
            dice.css("cursor","default"); 
            $(".wrap").append("<div id='dice_mask'></div>");//加遮罩 
            var num = message.game.diceNumber;
            dice.animate({left: '+2px'}, 100,function(){ 
                dice.addClass("dice_t"); 
            }).delay(200).animate({top:'-2px'},100,function(){ 
                dice.removeClass("dice_t").addClass("dice_s"); 
            }).delay(200).animate({opacity: 'show'},600,function(){ 
                dice.removeClass("dice_s").addClass("dice_e"); 
            }).delay(100).animate({left:'-2px',top:'2px'},100,function(){ 
                dice.removeClass("dice_e").addClass("dice_"+num); 
                $("#result").html("掷得点数是<span>"+num+"</span>"); 
                console.log(num);
                dice.css('cursor','pointer'); 
                $("#dice_mask").remove();//移除遮罩 
            }); 
            if(curPlayer===myUserId){

            }else{
                
            }
        break;
        case GAME_ANSWERING_QUESTION:
            //获取问题中（回答中） UI数据包
            if(curPlayer===myUserId){

            }else{
                
            }
        break;
        case GAME_ANSWER_QUESTION_RESULT:
            //回答问题结果 UI数据包
            if(curPlayer===myUserId){

            }else{
                
            }
        break;
        case GAME_OVER:
            //游戏结束 UI数据包
            setBtnVisibility(true,true,false);
            //TODO:游戏结果弹窗
        break;
    }
}

/**
 * 刷新玩家位置
 * @param {*} obj 
 */
function refreshPlayerPosition(obj){
    if(obj.status === ROOM_PLAYING){
        $.each(obj.playerList,function(index,item){
            if(item.position === -1) item.position = 0;
            var position =graph[item.position];
            roles[index].visible = true;
            roles[index].x=position.x;
            roles[index].y=position.y;
        });
    }else if(obj.status === ROOM_WAITING){
        $.each(obj.playerList,function(index,item){
            if(item.position === -1) item.position = 0;
            var position = graph[item.position];
            roles[index].x=position.x;
            roles[index].y=position.y; 
        });
    }
}

/**
 * 刷新玩家界面
 * @param {*数据包} message 
 */
function refreshPlayerPanel(obj){
    console.log(obj);
    if(obj.status === ROOM_PLAYING){
        operationView.playerText.text = " \t昵称\t \t\t \t位置\t \t\t \t金币\n\n";
        $.each(obj.playerList,function(index,item){
            operationView.playerText.text += " \t\t"+item.nickName+"\t";
            operationView.playerText.text += " \t\t\t\t"+item.position+"\t";
            operationView.playerText.text += " \t\t\t\t"+item.balance+"\n\n";
        });
    }else if(obj.status === ROOM_WAITING){
        operationView.playerText.text = " \t昵称\t \t\t \t位置\t \t\t \t金币\n\n";
        $.each(obj.playerList,function(index,item){
            operationView.playerText.text += " \t\t"+item.nickName+"\t";
            operationView.playerText.text += " \t\t\t\t"+ 0 +"\t";
            operationView.playerText.text += " \t\t\t\t"+ 0 +"\n\n";
        });
    } else {
        console.log("房间状态异常=====");
    }
}

/**
 * 设置按钮的显示状态
 * @param {*} btnReady 
 * @param {*} btnExit 
 * @param {*} btnDice 
 */
function setBtnVisibility(btnReady,btnExit,btnDice){
    operationView.btnReady.visible = btnReady;
    operationView.btnExit.visible = btnExit;
    operationView.btnDice.visible = btnDice;
}

/**
 * 创建地图
 */
function createMap()
{
    tiledMap = new TiledMap();
    tiledMap.createMap("../laya/assets/map/orthogonal-test-movelayer.json", new Rectangle(0, 0, 1100, 950),Handler.create(this,onMapLoaded));
}

/**
 * 地图加载完成回调
 */
function onMapLoaded(){
    this.tiledMap.scale = 1.0;
    //初始化地图走向
    graph = [];
    $.each(traceBits,function(index,item){
        if(index === 0) {
            graph.push({"x":50,"y":40});
            return true;
        }
        var position = graph[index-1];
        var t = traceBits[index-1];
        switch(t){
            case 0:
            graph.push({"x":position.x,"y":position.y-unit_y});
            break;
            case 1:
            graph.push({"x":position.x+unit_x,"y":position.y});
            break;
            case 2:
            graph.push({"x":position.x,"y":position.y+unit_y});
            break;
            case 3:
            graph.push({"x":position.x-unit_x,"y":position.y});
            break;
        }
    });
    //初始化角色列表
    roles = [tiledMap.getLayerObject("hero","role1"),tiledMap.getLayerObject("hero","role2"),
            tiledMap.getLayerObject("hero","role3"),tiledMap.getLayerObject("hero","role4")];
    $.each(roles,function(index,item){
        item.visible = false;
    });
    //预加载资源文件后执行回调
    Laya.loader.load(["h5/res/atlas/comp.atlas","h5/res/atlas/template/ButtonTab.atlas","h5/res/atlas/template/Warn.atlas"], Handler.create(this, onDialogLoaded));
}

/**
 * 操作加载完成回调
 */
function onDialogLoaded(){
    Laya.class(OperationPanel, "OperationPanel", OperationPanelUI);
    Laya.class(QuestionDialog, "QuestionDialog", QuestionDialogUI);
    operationView = new OperationPanel();
    questionDialog = new QuestionDialog();
    questionDialog.visible = true;
    operationView.x = 1100;
    operationView.y = 0;
    operationView.btnReady.on(Event.CLICK, this, btnReadyClicked);
    Laya.stage.addChild(operationView);
    createDice();
    connect();
    initData();
}

/**
 * 准备按钮点击事件 
 */
function btnReadyClicked(){
    $.ajax({
        type: "GET",
        url: "http://localhost/trivia/game/ready/1",
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        success: function (body) {
            if (body.resCode === "200") {
                operationView.btnReady.label="取消准备";
                operationView.btnReady._events = null
                operationView.btnReady.on(Event.CLICK, this, btnCancelReadyClicked);
            }
            else {
                alert(body.retMsg);
            }
        }
    });
}

/**
 * 取消准备监听
 */
function btnCancelReadyClicked(){
    operationView.btnReady.click
    $.ajax({
        type: "GET",
        url: "http://localhost/trivia/game/ready/0",
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        success: function (body) {
            if (body.resCode === "200") {
                operationView.btnReady.label="准备";
                operationView.btnReady._events = null
                operationView.btnReady.on(Event.CLICK, this, btnReadyClicked);
            }
            else {
                alert(body.retMsg);
            }
        }
    });
}