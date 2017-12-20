
var tiledMap;
var Handler= Laya.Handler;


// 创建TestPageUI的子类
function Test()
{
	Test.super(this);   
}

(function()
{
	var Stage     = Laya.Stage;
	var TiledMap  = Laya.TiledMap;
	var Rectangle = Laya.Rectangle;
	var WebGL     = Laya.WebGL;


	(function()
	{
		// 不支持WebGL时自动切换至Canvas
		Laya.init(1400, 950, WebGL);

        //调用DebugTool调试面板
        // Laya.DebugTool.init();
		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		createMap();
	})();

	function createMap()
	{
		tiledMap = new TiledMap();
		tiledMap.createMap("../laya/assets/map/orthogonal-test-movelayer.json", new Rectangle(0, 0, 1100, 950),Handler.create(this,onMapLoaded));
        Laya.stage.on(laya.events.Event.KEY_DOWN,this,onKeyDown);//设置键盘监听事件
	}
})();

function onMapLoaded(){
    //预加载资源文件后执行回调
    Laya.loader.load(["res/atlas/comp.atlas","res/atlas/template/ButtonTab.atlas"], Handler.create(this, onDialogLoaded));
}

function onDialogLoaded(){
    Laya.class(Test, "Test", TestUI);
    var view = new Test();
    Laya.stage.addChild(view);
}

/**
 * 点击事件监听
 * @param {*} e 
 */
function onKeyDown(e) {
    var player = tiledMap.getLayerObject("hero","role1");
    var b = true;
//     var b = map1.getTileProperties(0, a-1, "isCanPass");
// console.log(tiledMap);
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
