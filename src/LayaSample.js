
var tiledMap;
var operationView;
var Handler= Laya.Handler;
var Stage     = Laya.Stage;
var TiledMap  = Laya.TiledMap;
var Rectangle = Laya.Rectangle;
var WebGL     = Laya.WebGL;
var Event = Laya.Event;
var Socket = Laya.Socket;
var Byte   = Laya.Byte;

//Global Variable
var curUserId;
var positions=[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];

// 定义常量
var GAME_READY = 0;
var GAME_DICE_RESULT = 1;
var GAME_ANSWERING_QUESTION = 2;
var GAME_ANSWER_QUESTION_RESULT = 3;
var GAME_OVER = 4;


// 创建TestPageUI的子类
function OperationPanel()
{
	OperationPanel.super(this);   
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
        curUserId = message.id;
        return;
    }
    var stage = message.game.stage;
    var curPlayer = message.game.currentPlayerId;
    refreshPlayerPanel(message);
    switch(stage){
        case GAME_READY:
        //新一轮游戏就绪
        if(curPlayer===curUserId){
            setBtnVisibility(false,false,true);
        }else{
            setBtnVisibility(false,false,false);
        }
        break;
        case GAME_DICE_RESULT:
        //掷骰子点数
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
        if(curPlayer===curUserId){

        }else{
            
        }
        break;
        case GAME_ANSWERING_QUESTION:
        //获取问题中（回答中）
        if(curPlayer===curUserId){

        }else{
            
        }
        break;
        case GAME_ANSWER_QUESTION_RESULT:
        //回答问题结果
        if(curPlayer===curUserId){

        }else{
            
        }
        break;
        case GAME_OVER:
        //游戏结束
        break;
    }
}

/**
 * 刷新玩家界面
 * @param {*} message 
 */
function refreshPlayerPanel(obj){
    console.log(obj);
    if(typeof operationView ==='undefined'){
        return;
    }
    operationView.playerText.text = " \t昵称\t \t\t \t位置\t \t\t \t金币\n\n";
    $.each(obj.playerList,function(index,item){
        operationView.playerText.text += " \t\t"+item.nickName+"\t";
        operationView.playerText.text += " \t\t\t\t"+item.position+"\t";
        operationView.playerText.text += " \t\t\t\t"+item.balance+"\n\n";
    });
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
    tiledMap.gridSize = 20;
    Laya.stage.on(laya.events.Event.KEY_DOWN,this,onKeyDown);//设置键盘监听事件
}

/**
 * 地图加载完成回调
 */
function onMapLoaded(){
    this.tiledMap.scale = 1.0;
    //预加载资源文件后执行回调
    Laya.loader.load(["h5/res/atlas/comp.atlas","h5/res/atlas/template/ButtonTab.atlas","h5/res/atlas/template/Warn.atlas"], Handler.create(this, onDialogLoaded));
    
}

/**
 * 操作加载完成回调
 */
function onDialogLoaded(){
    Laya.class(OperationPanel, "OperationPanel", OperationPanelUI);
    operationView = new OperationPanel();
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

/**
 * 键盘事件监听
 */
function onKeyDown(e) {
    var player = tiledMap.getLayerObject("hero","role1");
    var b = true;
    var height = tiledMap.height;
    var width = tiledMap.width;
    var gridSize = tiledMap.width/tiledMap.numColumnsTile;
　　switch (e.keyCode) {
　　　　case 38:{
　　　　　　if (((player.y - gridSize) > 0) && b) {
　　　　　　　　player.y -= gridSize;
           }
　　　　　　break;
      }
      case 40:{
          if (((player.y + gridSize) < (height- gridSize)) && b){
　　　　　　　　player.y += gridSize;
          }
          break;
      }  
      case 37:{
　　　　　　if (((player.x - gridSize) > 0) && b) {
 　　　　　　　player.x -= gridSize;
　　　　　　}
　　　　　　break;
      }
      case 39:{
　　　　　　if (((player.x + gridSize) < (width - gridSize)) && b) {
　　　　　　　　player.x += gridSize;
　　　　　　}
　　　　    break;
　　　　}　　
　　}
}
