/*
 * @Author: Li MengChan 
 * @Date: 2018-07-02 10:10:54 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2019-02-26 17:46:59
 * @Description: 服务器通讯类
 */
module game {
	export class PomeloManager {
		public pomelo: PomeloForEgret.Pomelo;
		private static _instance: PomeloManager;
		public state: PomeloStateEnum = PomeloStateEnum.INIT;
		private pomeloFuncmap: HashMap<string, string> = new HashMap<string, string>();
		public lockReq: boolean = false;
		public lockResp: boolean = false;
		public isRunBack: boolean = false;
		private requestTimeout;
		private lockTimeOut;
		public lastReqUrls: HashMap<string, boolean> = new HashMap<string, boolean>();
		public constructor() {
			if (PomeloManager._instance) {
				throw new Error("PomeloManager使用单例");
			}
		}

		public static get instance(): PomeloManager {
			if (!PomeloManager._instance) {
				PomeloManager._instance = new PomeloManager();
				PomeloManager._instance.pomelo = new PomeloForEgret.Pomelo();
				PomeloManager._instance.listenOnAll();
				Global.pomelo = PomeloManager._instance;
				EventManager.instance.addEvent(PomeloForEgret.Pomelo.EVENT_CLOSE, PomeloManager._instance.onClose, this);
				EventManager.instance.addEvent("disconnect", PomeloManager._instance.reConnect, this);
				EventManager.instance.addEvent(PomeloForEgret.Pomelo.EVENT_IO_ERROR, PomeloManager._instance.onError, this);
			}
			return PomeloManager._instance;
		}

		private onClose() {
			PomeloManager._instance.clearRequestOutTime();
			if (PomeloManager.instance.isRunBack) {
				console.log("type5 dianxian");
				Global.alertMediator.addAlert("网络错误请重新连接", () => {
					PomeloManager._instance.reConnect();
				}, null, true);
			}
			// Global.pomelo.state = PomeloStateEnum.DISCONNECT;
		}


		private lastPingTime;
		public ping = 0;
		public startPingTime() {
			this.lastPingTime = Date.now();
			let routeName = ServerPostPath.connector_entryHandler_c_ping;
			this.pomelo.request(routeName, {}, (resp) => {
				this.ping = Date.now() - this.lastPingTime;
				GameLayerManager.gameLayer().showPingTime();
			});
			egret.setTimeout(() => {
				this.pomelo.request(routeName, {}, (resp) => {
					this.ping = Date.now() - this.lastPingTime;
					GameLayerManager.gameLayer().showPingTime();
				});
			}, this, 10000);
		}

		private startRequestOutTime() {
			if (this.requestTimeout) {
				return;
			}
			this.requestTimeout = egret.setTimeout(() => {
				//NetErrorTips.instance.show("网络错误,请求超时！");
				Global.alertMediator.addAlert("网络错误请重新连接", () => {
					console.log("type4 dianxian");
					PomeloManager._instance.reConnect();
				}, null, true);
			}, this, 8000);
		}


		private clearRequestOutTime() {
			egret.clearTimeout(this.requestTimeout);
			this.requestTimeout = null;
		}

		public startUnlockTimeout(roteName) {
			if (this.lockTimeOut) {
				egret.clearTimeout(this.lockTimeOut);
				this.lockTimeOut = null;
			}
			this.lockTimeOut = egret.setTimeout(function () {
				this.lockReq = false;
				this.lastReqUrls.put(roteName, false);
			}, this, 500);
		}

		/**
		 * 发送请求
		 * @param  {string} roteName
		 * @param  {any} param
		 */
		public request(roteName: string, param: any) {
			if (!param) {
				param = {};
			}

			LogUtils.logD(roteName + "请求参数 %j=", param);
			param.token = Global.playerProxy.token;
			if (Global.playerProxy.gametoken) {
				param.sdkToken = Global.playerProxy.gametoken;
			}
			return new Promise((resolve, reject) => {
				let isLock = this.lastReqUrls.get(roteName);
				if (isLock) {
					resolve({ error: { code: -100 } });
					return;
				}
				this.lastReqUrls.put(roteName, true);
				this.startRequestOutTime();
				egret.setTimeout(function () {
					this.lastReqUrls.put(roteName, false);
				}, this, 1000);
				this.pomelo.request(roteName, param, (resp) => {
					this.clearRequestOutTime();
					this.lastReqUrls.put(roteName, false);
					LogUtils.logD(roteName + "反悔 %j=", resp);
					if (resp && resp.code === 500 && roteName != ServerPostPath.game_roomHandler_c_queryRoomInfo) {
						NetErrorTips.instance.show("与服务器断开连接，请重新进入游戏!");
						// Global.alertMediator.addAlert("与服务器断开连接，请重新进入游戏！", () => {
						// 	FrameUtils.flushWindow();
						// }, null, true);
						return;
					}

					if (roteName == ServerPostPath.hall_sceneHandler_c_enter) {
						if (resp.error && resp.error.code != 0 && resp.error.code == -108) {
							Global.alertMediator.addAlert(resp.error.msg, () => {
								FrameUtils.flushWindow();
							}, null, true);
						} else
							if (resp.error && resp.error.code != 0 && resp.error.code != -213) {
								Global.alertMediator.addAlert(resp.error.msg, () => {
									// FrameUtils.flushWindow();
									resolve(null);
								}, null, true);
								return;
							}
					}
					resolve(resp);
				});
			})
		}

		public listenOnAll() {
			var allNotify = _.extendOwn(ServerNotify);
			for (var key in allNotify) {
				this.pomelo.on(allNotify[key], (event, resp) => {
					LogUtils.logD(Date.now() + "," + event + "收到推送:  %j=", resp);
					if (event == ServerNotify.s_robLogin) {
						NetReconnect.instance.active = false;
						NetErrorTips.instance.show("您的账号在其他地方登陆,请重新登陆");
						// Global.alertMediator.addAlert("您的账号在其他地方登陆,请重新登陆", () => {
						// 	FrameUtils.flushWindow();
						// }, null, true);
						return;
					}
					if (event == ServerNotify.s_kickPlayer) {
						Global.alertMediator.addAlert(resp.reason, () => {
							FrameUtils.flushWindow();
						}, null, true);
						return;
					}

					if (event == ServerNotify.s_payGold) {
						if (resp.ownGold) {
							Global.playerProxy.playerData.gold = resp.ownGold;
							EventManager.instance.dispatch(event, resp);
							return;
						}
					}
					// if (this.lockReq) {
					// 	return;
					// }
					EventManager.instance.dispatch(event, resp);
				});
			}
		}

		public listenOn(funcName: string, callback) {
			this.pomelo.on(funcName, (resp) => {

			})

		}

		/**
		 * 取消监听
		 * @param  {string} funcName
		 */
		public listenOff(funcName: string) {
			this.pomelo.off(funcName, null);
		}

		/**
		 * 请求服务器，无返回
		 * @param  {string} roteName
		 * @param  {any} param
		 * @param  {boolean} isShow?
		 */
		public notify(roteName: string, param: any, isShow?: boolean) {
			// if (!isShow) {
			// 	Global.showWaritPanel();
			// }
			this.pomelo.notify(roteName, param);
		}

		/**
		 * 初始化服务器
		 * @param  {} host
		 * @param  {} port
		 */
		public initServer(host, port) {
			host = host;//ServerConfig.PATH_CONFIG.socket_path;
			port = port;
			return new Promise((resolve, reject) => {
				this.pomelo.init({
					host: host,
					port: port,
					log: true
				}, (socket) => {
					if (socket.code == 200) {
						resolve(true);
					} else {
						resolve(false);
					}
				});
			});
		}

		public disConnect() {
			console.log("type1 dianxian");
			if (Global.pomelo.state != PomeloStateEnum.DISCONNECT) {
				Global.pomelo.state = PomeloStateEnum.DISCONNECT;
				this.pomelo.disconnect();
				this.clearRequestOutTime();
				if (PomeloManager.instance.isRunBack) {
					Global.alertMediator.addAlert("网络错误请重新连接", () => {
						this.reConnect();
					}, null, true);
				}
			}
		}

		public disConnectAndReconnect() {
			console.log("type3 dianxian");
			if (Global.pomelo.state != PomeloStateEnum.DISCONNECT) {
				Global.pomelo.state = PomeloStateEnum.DISCONNECT;
				this.pomelo.disconnect();
				this.clearRequestOutTime();
				egret.setTimeout(() => {
					this.reConnect();
				}, this, 200);
			}
		}


		public disConnectBySelf() {
			console.log("type2 dianxian");
			Global.pomelo.state = PomeloStateEnum.DISCONNECT;
			this.pomelo.disconnect();
		}


		public reConnect() {
			console.log("type6 dianxian");
			if (!PomeloManager.instance.isRunBack && Global.pomelo.state == PomeloStateEnum.DISCONNECT) {
				NetReconnect.instance.show();
			} else {
				Global.pomelo.state = PomeloStateEnum.DISCONNECT;
			}
		}


		public onError() {
			Global.pomelo.state = PomeloStateEnum.DISCONNECT;
			NetErrorTips.instance.show("您的网络似乎出现问题,请重新进入游戏");
			// Global.alertMediator.addAlert("您的网络似乎出现问题,请重新进入游戏", () => {
			// 	FrameUtils.flushWindow();
			// }, null, true);
		}
	}
}