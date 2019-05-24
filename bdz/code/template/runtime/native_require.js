
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/res/res.js",
	"libs/modules/eui/eui.js",
	"libs/modules/tween/tween.js",
	"libs/modules/socket/socket.js",
	"libs/modules/puremvc/puremvc.js",
	"libs/modules/underscore/underscore.js",
	"promise/promise.js",
	"bin-debug/game/core/model/proxy/ResourceProxyBase.js",
	"bin-debug/game/core/view/component/majiang/BaseShoupaiGroup.js",
	"bin-debug/game/core/view/BaseComponent.js",
	"bin-debug/game/core/view/BaseMediator.js",
	"bin-debug/game/core/view/component/majiang/LeftShoupaiGroup.js",
	"bin-debug/game/config/GameConfig.js",
	"bin-debug/game/config/Global.js",
	"bin-debug/game/constants/EventNotify.js",
	"bin-debug/game/constants/PanelNotify.js",
	"bin-debug/game/constants/SceneNotify.js",
	"bin-debug/game/constants/SysNotify.js",
	"bin-debug/game/core/controller/command/ControllerPrepCommand.js",
	"bin-debug/game/core/controller/command/ModelPrepCommand.js",
	"bin-debug/game/core/controller/command/StartupCommand.js",
	"bin-debug/game/core/controller/command/ViewPrepCommand.js",
	"bin-debug/game/core/model/bean/ConnectInfoBean.js",
	"bin-debug/game/core/model/proxy/AudioProxy.js",
	"bin-debug/game/core/model/proxy/GameProxy.js",
	"bin-debug/game/core/model/proxy/NetProxy.js",
	"bin-debug/game/core/model/proxy/PlayerProxy.js",
	"bin-debug/AppFacade.js",
	"bin-debug/egert/AssetAdapter.js",
	"bin-debug/game/core/view/BaseItemRender.js",
	"bin-debug/egert/LoadingUI.js",
	"bin-debug/game/core/view/component/ToastTip.js",
	"bin-debug/egert/ThemeAdapter.js",
	"bin-debug/Main.js",
	"bin-debug/game/core/view/component/majiang/MineChupaiGroup.js",
	"bin-debug/game/core/view/component/majiang/MineShoupaiGroup.js",
	"bin-debug/game/core/view/component/majiang/RightShoupaiGroup.js",
	"bin-debug/game/core/view/component/majiang/TimerDirectionBar.js",
	"bin-debug/game/core/view/component/majiang/TopShoupaiGroup.js",
	"bin-debug/game/core/view/scene/logo/LogoMediator.js",
	"bin-debug/game/core/view/scene/logo/LogoScene.js",
	"bin-debug/game/core/view/scene/majiang/MajiangMediator.js",
	"bin-debug/game/core/view/scene/majiang/MajiangScene.js",
	"bin-debug/game/core/view/scene/majiang/MjiangSelectMediator.js",
	"bin-debug/game/core/view/scene/majiang/MjiangSelectScene.js",
	"bin-debug/game/core/widget/LeftShoupai.js",
	"bin-debug/game/core/widget/MineChupai.js",
	"bin-debug/game/core/widget/MineShoupai.js",
	"bin-debug/game/core/widget/RightShoupai.js",
	"bin-debug/game/core/widget/TopShoupai.js",
	"bin-debug/game/managers/EventManager.js",
	"bin-debug/game/managers/GameLayerManager.js",
	"bin-debug/game/managers/PomeloManager.js",
	"bin-debug/game/managers/PopUpManager.js",
	"bin-debug/game/managers/SocketManager.js",
	"bin-debug/game/utils/HashMap.js",
	"bin-debug/game/utils/PomeloForEgret.js",
	"bin-debug/game/utils/RegUtils.js",
	"bin-debug/game/utils/UIUtils.js",
	"bin-debug/game/utils/Utils.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "game.Main",
		frameRate: 60,
		scaleMode: "fixedNarrow",
		contentWidth: 1280,
		contentHeight: 720,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xFFFFFF,bgAlpha:0.4",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};