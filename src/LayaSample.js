
var tiledMap;
(function()
{
	var Stage     = Laya.Stage;
	var TiledMap  = Laya.TiledMap;
	var Rectangle = Laya.Rectangle;
	var WebGL     = Laya.WebGL;


	(function()
	{
		// 不支持WebGL时自动切换至Canvas
		Laya.init(1100, 800, WebGL);

        //调用DebugTool调试面板
        Laya.DebugPanel.init();
        Laya.DebugTool.init();
		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		createMap();
	})();

	function createMap()
	{
		tiledMap = new TiledMap();
		tiledMap.createMap("../laya/assets/map/orthogonal-test-movelayer.json", new Rectangle(0, 0, Laya.stage.width, Laya.stage.height), null);
        Laya.stage.on(laya.events.Event.KEY_DOWN,this,onKeyDown);//设置键盘监听事件
	}
})();

function onKeyDown(e) {
    var player = tiledMap.getLayerObject("hero","role1");
    var b = true;
//     var b = map1.getTileProperties(0, a-1, "isCanPass");
console.log(player.x+"  "+player.y);
　　switch (e.keyCode) {
　　　　case 38:{
　　　　　　if ( (player.y - 48) <= 0) {
　　　　　　　　player.y = 0;
　　　　　　}else{
             if(b){
　　　　　　　　　　player.y -= 48;
　　　　　　　　}
          }
　　　　　　break;
      }
      case 40:{
          if ( (player.y + 48) >= (576- 48)){
　　　　　　　　player.y = 576 - 48;
          }else{
             if(b){
　　　　　　　　　　player.y += 48;
　　　　　　　　}
          }
          break;
      }  
      case 37:{
　　　　　　if ( (player.x - 48) <= 0) {
　　　　　　　　player.x = 0;
　　　　　　}else{
　　　　　　　　if(b){
 　　　　　　　　　　player.x -= 48;
　　　　　　　　}
　　　　　　}
　　　　　　break;
      }
      case 39:{
　　　　　　if ( (player.x + 48) >= (576 - 48)) {
　　　　　　　　player.x = 576 - 48;
　　　　　　}else{
　　　　　　　　if(b){
　　　　　　　　　　player.x += 48;
　　　　　　　　}
　　　　　　}
　　　　    break;
　　　　}　　
　　}
}
