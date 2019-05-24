/*
  *  @Author:  Li  MengChan  
  *  @Date:  2018-07-02  15:04:51  
  *  @Descxription:  加载界面
  */
module game {
    export class LogoScene extends game.BaseScene {
        public pmdKey: string = "common";
        // private tipLabel: eui.Label;
        private progressBar: eui.Image;
        private maxX: number = 668;
        private clientVersion: eui.Label;
        private resVersion: eui.Label;
        private progressGroup: eui.Group;
        private resGroups: string[];
        private totalLoader: number = 0;;
        private currentLoader: number = 0;
        private resLoadedOK: boolean = false;
        private sceneConfigOK: boolean = false;
        public constructor() {
            super();
            this.skinName = new LogoSceneSkin();
        }

        public createChildren() {
            super.createChildren();
            //是否是pc
            this.createDb();

            let node = document.getElementById("loadingDiv");
            node.parentNode.removeChild(node);
            this.resGroups = ["main"];
            this.startLogin();
        }


        private loadingDB: DBComponent;
        private createDb() {
            this.loadingDB = new DBComponent("loading_db");
            this.progressGroup.addChild(this.loadingDB);
            this.loadingDB.playDefault(-1);
            this.loadingDB.y += 11;

        }
        /**
          *  开始加载资源
          */
        private beganLoadResGroup() {
            this.resGroup = this.resGroups.pop();
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.loadGroup(this.resGroup);
        }

        private onResourceLoadComplete(e: RES.ResourceEvent): void {
            if (e.groupName == this.resGroup) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                if (this.resGroups.length > 0) {
                    this.beganLoadResGroup();
                } else {
                    this.onResourceLoadOver();
                }
            }
        }

        /**
          *  preload资源组加载进度
          *  loading  process  of  preload  resource
          */
        private onResourceProgress(e: RES.ResourceEvent): void {
            if (e.groupName == this.resGroup) {
                this.currentLoader++;
                var rate = Math.floor(this.currentLoader / this.totalLoader * 100);
                this.progressBar.width = Math.floor(1008 * rate / 100);
                this.loadingDB.x = this.progressBar.width;
            }
        }


        public onAdded() {
            super.onAdded();
            EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
        }

        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
        }


        public reconnectSuc() {
            Global.alertMediator.addAlert("请重新登录", () => {
                FrameUtils.flushWindow();
            }, null, true)
        }

        /**
          *  用户登录成功
          */
        public async userLoginSuc() {
            let publicMsg = PMDComponent.instance;
            publicMsg.anchorOffsetY = 24;
            publicMsg.horizontalCenter = 0;
            publicMsg.top = 100;
            GameLayerManager.gameLayer().loadLayer.addChild(publicMsg);
            GameLayerManager.gameLayer().createNetStatus();
            EventManager.instance.dispatch(ServerNotify.s_broadcast, Global.gameProxy.pMd)
            await Global.gameProxy.people();
            if (NativeApi.instance.isiOSDevice) {
                if (NativeApi.instance.isSafari) {
                    FrameUtils.checkSafariStart();
                } else if (NativeApi.instance.isChromeForIOS) {
                    FrameUtils.postMessage("0");
                }
            }
            PomeloManager.instance.startPingTime();
            if (Global.gameProxy.roomState && Global.gameProxy.roomState.state == 1) {
                var handler = ServerPostPath.hall_sceneHandler_c_enter;
                let resp: any = await game.PomeloManager.instance.request(handler, Global.gameProxy.roomState);
                if (resp.error) {
                    Global.gameProxy.clearAllRoomInfo();
                    Global.alertMediator.addAlert(resp.error.msg, () => {
                    }, null, true);
                    HallForwardFac.redirectHall(() => {
                        AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_LOADING);
                    });
                    return;
                }
                if (resp.reconnect) {
                    HallForwardFac.redirectScene(resp, Global.gameProxy.roomState, (isPlaying) => {
                        if (isPlaying) {
                            game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_LOADING);
                        } else {
                            Global.gameProxy.clearAllRoomInfo();
                            game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
                        }
                    });
                }
            } else {
                HallForwardFac.redirectHall(() => {
                    AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_LOADING);
                });
            }
        }

        /**
         * 开发模式登陆
         */
        public async devLogin() {
            let data1 = Date.now();
            await this.auth({
                operatorId: 1,
                channel_id: 1,
                authData: {
                    username: ServerConfig.USER_NAME,
                    password: '123654',
                    figure_url: Math.floor(_.random(1, 6)),
                    sex: Math.floor(_.random(0, 1)),

                },
                devType: 2,
                devId: NativeApi.instance.getDeivice()
            });
            await this.queryEntry();
            await this.connect();

            let resp: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_queryGameState, {});
            Global.gameProxy.roomState = resp;
            Global.gameProxy.lastGameConfig = resp;
            let res = RESUtils.getResNameByGid();
            if (res) {
                this.resGroups = this.resGroups.concat(res);
            }
            this.totalLoader = RESUtils.getGroupTotal(this.resGroups);
            this.beganLoadResGroup();
            this.getSceneConfigInfo();
        }



        /**
         * 正式环境登陆
         */
        public async envLogin() {
            await this.loginByToken();
            await this.queryEntry();
            await this.connect();
            let resp: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_queryGameState, {});
            Global.gameProxy.roomState = resp;
            Global.gameProxy.lastGameConfig = resp;
            let res = RESUtils.getResNameByGid();
            if (res) {
                this.resGroups = this.resGroups.concat(res);
            }
            this.totalLoader = RESUtils.getGroupTotal(this.resGroups);
            this.beganLoadResGroup();
            this.getSceneConfigInfo();
            // await this.getSceneConfigInfo();
        }

        private timeout;
        private async loginByToken() {
            egret.clearTimeout(this.timeout);
            let gatePath = ServerConfig.PATH_CONFIG.http_header + ServerConfig.PATH_CONFIG.http_server + ":" + ServerConfig.PATH_CONFIG.http_port;
            let data = { token: Global.playerProxy.token };
            this.timeout = egret.setTimeout(function () {
                Global.alertMediator.addAlert("登陆超时，请刷新页面重新登陆!", () => {
                    FrameUtils.flushWindow();
                }, null, true);
            }, this, 60000);
            let time = Date.now();
            let resp: any = await Global.netProxy.sendRequestAsync(gatePath + "/gate/clientApi/getPlayerInfo", data);
            egret.clearTimeout(this.timeout);
            return new Promise((resolve, reject) => {
                if (resp.error) {
                    if (resp.error.code && resp.error.code == -107) {
                        Global.alertMediator.addAlert(resp.error.msg, () => {
                            FrameUtils.flushWindow();
                        }, null, true);
                        return;
                    }
                    Global.alertMediator.addAlert("游戏链接已失效，请由平台重新进入", () => {
                        FrameUtils.flushWindow();
                    }, null, true);
                } else {
                    LogUtils.logD(resp);
                    Global.playerProxy.playerData = resp.data;
                    Global.playerProxy.token = data.token;
                    resolve();
                }
            })

        }

        /**
         * 先登录
         */
        public startLogin() {
            if (!ServerConfig.PATH_CONFIG.token_login) {
                LogUtils.logD("测试环境登陆")
                this.devLogin();
            } else {
                LogUtils.logD("正式环境登陆")
                this.envLogin();
            }
        }

        /**
         * 资源加载完毕
         */
        public async onResourceLoadOver() {

            this.resLoadedOK = true;
            this.checkLoginOver();

        }
        /**
         * 服务器获取授权
         * @param  {} data
         */
        public async auth(data) {
            let gatePath = ServerConfig.PATH_CONFIG.http_header + ServerConfig.PATH_CONFIG.http_server + ":" + ServerConfig.PATH_CONFIG.http_port;
            egret.clearTimeout(this.timeout);
            this.timeout = egret.setTimeout(function () {
                Global.alertMediator.addAlert("连接服务器失败,请重试!", () => {
                    FrameUtils.flushWindow();
                }, null, true);
            }, this, 10000);
            let resp: any = await Global.netProxy.sendRequestAsync(gatePath + "/gate/clientApi/auth", data);
            egret.clearTimeout(this.timeout);
            return new Promise((resolve, reject) => {
                if (resp.error) {
                    Global.alertMediator.addAlert("连接服务器失败,请检查网络!", () => {
                        FrameUtils.flushWindow();
                    }, null, true);
                } else {
                    Global.playerProxy.playerData = resp.data;
                    Global.playerProxy.token = resp.data.token;
                    Global.playerProxy.gametoken = resp.data.sdkToken;
                    resolve();
                }
            });
        }


        /**
         * 获取socket服务器地址列表
         */
        public async queryEntry() {
            var req = { token: Global.playerProxy.token };
            let self = this;
            return new Promise((resolve, reject) => {
                let gatePath = ServerConfig.PATH_CONFIG.http_header + ServerConfig.PATH_CONFIG.http_server + ":" + ServerConfig.PATH_CONFIG.http_port;
                Global.netProxy.sendRequest(gatePath + "/gate/clientApi/queryEntry", req, function (resp) {
                    if (resp.error) {
                        Global.alertMediator.addAlert("连接服务器失败,请检查网络!", () => {
                            FrameUtils.flushWindow();
                        }, null, true);
                    } else {
                        if (resp.data && resp.data.path) {
                            ServerConfig.PATH_CONFIG.socket_path_1 += resp.data.path;
                        }
                        Global.gameProxy.connectorInfo = resp.data;
                        self.resVersion.text = "游戏版本: " + resp.data.serverVersion;
                        self.clientVersion.text = "客户端版本:" + GameConfig.JS_VERSION;
                        resolve();
                    }
                })
            });
        }




        public uploadPlayerAddress() {
            let browser = NativeApi.instance.getDeivice();
            let device = "PC";
            if (NativeApi.instance.isAndroidDevice) {
                device = "Android";
            } else if (NativeApi.instance.isiOSDevice) {
                device = "IOS";
            }
            let reqData = {
                token: Global.playerProxy.token,
                info: {
                    browser: browser,
                    devices: device,
                    game_id: ServerConfig.gid
                }
            }
            let gatePath = ServerConfig.PATH_CONFIG.http_header + ServerConfig.PATH_CONFIG.http_server + ":" + ServerConfig.PATH_CONFIG.http_port;
            Global.netProxy.sendRequest(gatePath + "/gate/clientApi/uploadStatistics", reqData, null);
        }


        /**
         * 使用token登陆
         */
        private chaoshi;
        public async connect() {
            try {
                egret.clearTimeout(this.chaoshi);
                //先握手
                this.chaoshi = egret.setTimeout(() => {
                    Global.alertMediator.addAlert("连接游戏服务器失败", () => {
                        FrameUtils.flushWindow();
                    }, null, true);
                }, this, 10000)

                await PomeloManager.instance.initServer(Global.gameProxy.connectorInfo.host, Global.gameProxy.connectorInfo.port);
                let resp: any = await PomeloManager.instance.request('connector.entryHandler.c_connect', {
                    token: Global.playerProxy.token
                });
                egret.localStorage.setItem("firstlogin", "1");
                this.uploadPlayerAddress();
                Global.gameProxy.pMd = resp.broadcast;
                egret.clearTimeout(this.chaoshi);
                this.chaoshi = null;
                return new Promise(function (resolve, reject) {
                    if (resp) {
                        if (resp.error && resp.error.code != 0) {
                            alert("登录失败")
                            return;
                        }
                        PomeloManager.instance.state = PomeloStateEnum.CONNECT;
                    }
                    resolve();
                })
                //登陆成功
            } catch (err) {
                PomeloManager.instance.state = PomeloStateEnum.DISCONNECT;
                egret.setTimeout(this.connect, this, 10000);
            }
        }

        public async getSceneList() {
            try {
                let resp: any = await PomeloManager.instance.request('hall.sceneHandler.c_getGameListInfo', {});
                let list = [];
                for (let i = 0; i < resp.length; i++) {
                    let data = resp[i];
                    if (data.grade != 6) {
                        list.push(data);
                    }
                }
                Global.gameProxy.sceneList = list;
                this.sceneConfigOK = true;
                this.checkLoginOver();
            } catch (err) {
                egret.error('********* 获取金币场场配置信息 err=', err);
            }
        }

        //获取金币场场配置信息
        public async getSceneConfigInfo() {
            try {
                let resp: any = await PomeloManager.instance.request('hall.sceneHandler.c_getSceneConfigInfo', {});
                if(resp.gameConfigs){
                    Global.gameProxy.gameNums = resp.gameConfigs;
                    Global.gameProxy.gameIds = resp.gameIds;
                }else{
                    Global.gameProxy.gameNums = resp;
                }
                
                this.getSceneList();
            } catch (err) {
                egret.error('********* 获取金币场场配置信息 err=', err);
            }
        }

        public async checkLoginOver() {
            if (this.resLoadedOK && this.sceneConfigOK) {
                this.userLoginSuc();
            }
        }
    }
}