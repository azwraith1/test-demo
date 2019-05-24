/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-06-25 14:08:44 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 15:32:53
 * 主方法入口
 */
module game {
    export class Main extends eui.UILayer {
        /**
         * 加载进度界面
         * loading process interface
         */
        private loadingView: LoadingUI;
        private logoScene: LogoScene;
        private version: RES.VersionController;

        private pauseGame() {
            if (!Global.runBack) {
                console.log("pauseGame---------")
                // egret.ticker.pause();
                Global.runBack = true;
                EventManager.instance.dispatch(EventNotify.RUN_BACKEND);
            }
        }

        private resumeGame() {
            if (Global.runBack) {
                console.log("resumeGame---------")
                // egret.ticker.resume();
                Global.runBack = false;
                EventManager.instance.dispatch(EventNotify.RUN_FORTEND);
            }
        }


        private lifeCycleOld() {
            egret.lifecycle.addLifecycleListener((context) => {
            });
            egret.lifecycle.onPause = () => {
                if (PomeloManager.instance.state == PomeloStateEnum.INIT) {
                    return;
                }

                Global.runBack = true;
                egret.Tween.removeTweens(GameConfig.curStage());
            }

            egret.lifecycle.onResume = () => {
                if (PomeloManager.instance.state == PomeloStateEnum.INIT) {
                    return;
                }
                Global.runBack = false;
                egret.Tween.resumeTweens(GameConfig.curStage());
                if (NativeApi.instance.isiOSDevice && NativeApi.instance.isChromeForIOS) {
                    FrameUtils.postMessage("0");
                }
            }
        }


        private lifeCycleNew() {
            egret.lifecycle.addLifecycleListener((context) => {
                // custom lifecycle plugin
                context.onUpdate = () => {
                }

            });
            if (!egret.Capabilities.isMobile) {
                document.addEventListener("visibilitychange", () => {
                    document.hidden ? this.pauseGame() : this.resumeGame();
                });
            } else {
                egret.lifecycle.onPause = () => {
                    this.pauseGame()
                }

                egret.lifecycle.onResume = () => {
                    this.resumeGame();
                    if (PomeloManager.instance.state == PomeloStateEnum.DISCONNECT) {
                        NetReconnect.instance.show();
                    } else {
                        NetReconnect.instance.hide();
                        AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_ALERT);
                    }
                    if (NativeApi.instance.isiOSDevice && NativeApi.instance.isChromeForIOS) {
                        FrameUtils.postMessage("0");
                    }
                }
            }
        }

        protected createChildren(): void {
            super.createChildren();
            //初始化设备信息
            NativeApi.instance.initApi();
            if (NativeApi.instance.isSafari && NativeApi.instance.isiOSDevice) {
                UIUtils.checkFull1();
            }
            this.checkServerTime();
            //加载相应服务器配置
            ServerConfig.PATH_CONFIG = PathConfigFac.getPathByType(ServerConfig.PATH_TYPE);
            GameConfig.JS_VERSION = window['jsVersion'];
            GameConfig.RES_VERSION = window['resVersion'];
            //生命周期管理
            if (ServerConfig.PATH_TYPE == PathTypeEnum.NEI_TEST) {
                this.lifeCycleNew();
            } else {
                this.lifeCycleOld();
            }

            //检查资源版本
            this.checkVersion();
            //检查运行环境
            this.checkRuntime();

            this.addChild(GameLayerManager.gameLayer());
            game.AppFacade.getInstance().startUp(GameLayerManager.gameLayer());

            this.selectServerConfig();
            if (ServerConfig.PATH_CONFIG.token_login) {
                if (!Global.playerProxy.token) {
                    alert("请用正确的游戏打开方式！");
                    return;
                }
            }
            LogUtils.loglevel = ServerConfig.PATH_CONFIG.log_level;

            var assetAdapter = new AssetAdapter();
            this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
            this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
            //设置加载进度界面
            this.loadingView = new LoadingUI();
            this.stage.addChild(this.loadingView);

            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

            //跨域图片可加载            
            egret.ImageLoader.crossOrigin = "anonymous";

            RES.loadConfig("resource/default.res.json", "resource/");

            egret.TextField.default_fontFamily = "PingFang SC Bold";
        }


        private checkServerTime() {
            let locationHref = window.location.host;
            var search = location.search;
            var host = window.location.host;
            if (host.indexOf("publish") > -1) {
                ServerConfig.PATH_TYPE = PathTypeEnum.PUBLISH_TEST;
            } else if (host.indexOf("intdemo") > -1) {
                ServerConfig.PATH_TYPE = PathTypeEnum.INTDEMO_TEST;
            }
            else if (host.indexOf("demo") > -1) {
                ServerConfig.PATH_TYPE = PathTypeEnum.DEMO_TEST;
            }
            else if (host.indexOf("test") > -1) {
                ServerConfig.PATH_TYPE = PathTypeEnum.QA_TEST;
            } else if (host.indexOf("xiaoxiongshequ") > -1) {
                ServerConfig.PATH_TYPE = PathTypeEnum.WAI_PRODUCT;
                return;
            }
            let tType = Utils.getURLQueryString("t");
            switch (tType) {
                case "1":
                    //192.168.2.6
                    ServerConfig.PATH_TYPE = PathTypeEnum.NEI_TEST;
                    break;
                case "2":
                    //192.168.2.6
                    ServerConfig.PATH_TYPE = PathTypeEnum.NEI_TEST1;
                    break;
                case "3":
                    //192.168.2.6
                    ServerConfig.PATH_TYPE = PathTypeEnum.QA_TEST;
                    break;
                case "4":
                    //192.168.2.6
                    ServerConfig.PATH_TYPE = PathTypeEnum.DEMO_TEST;
                    break;
            }
            let type = Utils.getURLQueryString("target");
            if (type) {
                ServerConfig.PATH_TYPE = PathTypeEnum.ZIDINGYI;
            }
        }

        /**
         * PC或者手机做出不同的适配
         */
        private checkRuntime() {
            this.checkIsHengShu();
            GameConfig.CURRENT_WIDTH = this.stage.stageWidth;
            GameConfig.CURRENT_HEIGHT = this.stage.stageHeight;
            GameConfig.WINSIZE_WIDTH = this.stage.stageWidth;
            GameConfig.WINSIZE_HEIGHT = this.stage.stageHeight;
            GameConfig.WINSIZE_BILI_WIDTH = GameConfig.WINSIZE_WIDTH / 1280;
            GameConfig.WINSIZE_BILI_HEIGHT = GameConfig.WINSIZE_HEIGHT / 720;
            this.stage.orientation = egret.OrientationMode.LANDSCAPE;
            if (!egret.Capabilities.isMobile) {
                this.stage.orientation = egret.OrientationMode.AUTO;
                this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
            } else {
                this.stage.scaleMode = egret.StageScaleMode.FIXED_NARROW;
            }
        }

        /**
         * 检查全屏
         */
        private checkVersion() {
            var self = this;
            //资源管理框架
            RES.web.Html5VersionController.prototype.getVirtualUrl = function (url) {
                if (ServerConfig.PATH_CONFIG.use_oss) {
                    if (url.match(".json") && ServerConfig.PATH_CONFIG.json_path) {
                        url = ServerConfig.PATH_CONFIG.json_path + url + "?v=" + GameConfig.RES_VERSION;
                        return url;
                    }
                    url = ServerConfig.PATH_CONFIG.oss_path + url + "?v=" + GameConfig.RES_VERSION;
                    return url;
                }

                if (url.match("http")) {
                    return url;
                }
                url += "?v=" + GameConfig.RES_VERSION;
                return url;
            }
            this.version = new RES.VersionController();
            RES.registerVersionController(this.version);
        }

        /**
         * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
         * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
         */
        private onConfigComplete(e: RES.ResourceEvent): void {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            var theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.loadGroup("preload");
        }

        private isThemeLoadEnd: boolean = false;

        /**
         * 主题文件加载完成,开始预加载
         * Loading of theme configuration file is complete, start to pre-load the
         */
        private onThemeLoadComplete(): void {
            this.isThemeLoadEnd = true;
            this.createScene();
        }

        private isResourceLoadEnd: boolean = false;

        /**
         * preload资源组加载完成
         * preload resource group is loaded
         */
        private onResourceLoadComplete(event: RES.ResourceEvent): void {
            if (event.groupName == "preload") {
                this.stage.removeChild(this.loadingView);
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                this.isResourceLoadEnd = true;
                this.createScene();
            }
        }

        private createScene() {
            if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
                this.startCreateScene();
            }
        }

        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        private onResourceLoadError(event: RES.ResourceEvent): void {
            console.warn("Group:" + event.groupName + " has failed to load");
            this.onResourceLoadComplete(event);
        }

        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        private onResourceProgress(event: RES.ResourceEvent): void {
            if (event.groupName == "preload") {
                this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
            }
        }

        /**
         * 选择连接方式
         */
        private selectServerConfig() {
            let token = Utils.getURLQueryString("token");
            if (token) {
                Global.playerProxy.token = token;
            }
            ServerConfig.RECHARGE_URL = decodeURIComponent(Utils.getURLQueryString("op_pay_url"));
            ServerConfig.HOME_PAGE_URL = decodeURIComponent(Utils.getURLQueryString("op_home_url"));
            ServerConfig.OP_RETURN_TYPE = decodeURIComponent(Utils.getURLQueryString("op_return_type"));
            ServerConfig.BACK_URL = decodeURIComponent(Utils.getURLQueryString("back_url"));
            ServerConfig.gid = Utils.getURLQueryString("gid") || "";
            ServerConfig.USER_NAME = Utils.getURLQueryString("un") || null;
            if (!ServerConfig.USER_NAME) {
                let name = egret.localStorage.getItem(GameConfig.DEFUALT_NAME);
                if (!name) {
                    let uuid = Utils.S4();
                    name = "t" + Math.floor(_.random(10000, 99999)) + uuid.substring(0, 3);
                    // egret.localStorage.setItem(GameConfig.DEFUALT_NAME, name);

                }
                ServerConfig.USER_NAME = name;
            }
        }

        private firstWidth;
        private firstHeight;
        private isFullScreen: boolean = false;
        private maxHengWidth: number;
        private maxShuWidth: number;
        private checkIsFull() {
            //只有ios移动端才会执行
            let width = GameConfig.CURRENT_WIDTH;
            let height = GameConfig.CURRENT_HEIGHT;
            let stageWidth = this.stage.stageWidth;
            let stageHeight = this.stage.stageHeight;
            if (GameConfig.CURRENT_ISSHU) {
                width = GameConfig.CURRENT_HEIGHT;
                height = GameConfig.CURRENT_WIDTH;
                stageWidth = this.stage.stageHeight;
                stageHeight = this.stage.stageWidth;
            }
            if (NativeApi.instance.isSafari) {
                return;
            }
            if (NativeApi.instance.isIphoneX) {
                FrameUtils.iphoneXScreen(stageWidth, stageHeight);
                return;
            }
            this.checkIsHengShu();

            //横屏
            if (width == this.stage.stageWidth && this.stage.stageHeight == height) {
                return;
            }
            if (width == 1280) {
                if (stageWidth != 1280) {
                    if (NativeApi.getChromeVersion() > 70) {
                        FrameUtils.postMessage("0");
                    }
                } else {
                    //横屏的相互操作
                    if (stageHeight > height) {
                        this.isFullScreen = false;
                        FrameUtils.postMessage("0");
                    } else {
                        this.isFullScreen = true;
                        FrameUtils.postMessage("1");
                    }
                }
            }
            //如果当前是竖屏 转入横屏
            else if (height == 720) {

                if (NativeApi.instance.getIphoneBanben()) {
                    this.isFullScreen = true;
                    FrameUtils.postMessage("1");
                    return;
                }
                if (stageHeight != 720) {
                    if (NativeApi.getChromeVersion() > 70) {
                        FrameUtils.postMessage("0");
                    }
                } else {
                    if (stageWidth > width) {
                        this.isFullScreen = false;
                        FrameUtils.postMessage("0");
                    } else {
                        this.isFullScreen = true;
                        FrameUtils.postMessage("1");
                    }
                }
            }
        }

        private checkIsHengShu() {
            if (window.orientation === 180 || window.orientation === 0) {
                GameConfig.CURRENT_DIRECTION = "portrait";
            } else if (window.orientation === 90 || window.orientation === -90) {
                GameConfig.CURRENT_DIRECTION = "landscape";
            } else {
                GameConfig.CURRENT_DIRECTION = "running";
            }
        }

        /**
         * 创建场景界面
         * Create scene interface
        */
        private resetZise;
        protected startCreateScene(): void {
            //监听窗口大小的改变
            this.stage.addEventListener(egret.StageOrientationEvent.ORIENTATION_CHANGE, (e: egret.StageOrientationEvent) => {
                if (NativeApi.instance.isIphoneX && NativeApi.getChromeVersion() > 70) {
                    if (GameConfig.CURRENT_WIDTH == this.stage.stageWidth && this.stage.stageHeight == GameConfig.CURRENT_HEIGHT) {
                        return;
                    }
                    if (NativeApi.instance.isSafari) {
                        return;
                    }
                    FrameUtils.postMessage("0");
                }
            }, this);
            this.stage.addEventListener(egret.Event.RESIZE, function () {
                GameConfig.WINSIZE_WIDTH = this.stage.stageWidth;
                GameConfig.WINSIZE_HEIGHT = this.stage.stageHeight;
                var beforeData = { wBili: GameConfig.WINSIZE_BILI_WIDTH, hBili: GameConfig.WINSIZE_BILI_HEIGHT };
                GameConfig.WINSIZE_BILI_WIDTH = GameConfig.WINSIZE_WIDTH / 1280;
                GameConfig.WINSIZE_BILI_HEIGHT = GameConfig.WINSIZE_HEIGHT / 720;
                EventManager.instance.dispatch(EventNotify.EVENT_RESIZE, beforeData);
                if (this.resetZise) {
                    egret.clearTimeout(this.resetZise);
                    this.resetZise = null;
                }
                this.resetZise = egret.setTimeout(() => {
                    this.checkIsFull();
                    GameConfig.CURRENT_WIDTH = this.stage.stageWidth;
                    GameConfig.CURRENT_HEIGHT = this.stage.stageHeight;
                    this.resetZise = null;
                }, this, 500);
            }, this);
            GameConfig.GAME_CONFIG = RES.getRes("client_json");
            DateTimeManager.instance.run();
            game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LOADING);
        }
    }

}
