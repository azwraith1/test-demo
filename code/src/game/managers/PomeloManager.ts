/*
 * @Author: Li MengChan 
 * @Date: 2018-07-02 10:10:54 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 15:33:14
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
		private requestTimeout;
		private lastRequestHandler: string;
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
			if (Global.runBack) {
				// console.log("type5 dianxian");
				// Global.alertMediator.addAlert("网络错误请重新连接", () => {
				PomeloManager._instance.reConnect();
				// }, null, true);
			}
			// Global.pomelo.state = PomeloStateEnum.DISCONNECT;
		}

		private startRequestOutTime() {
			if (this.requestTimeout) {
				return;
			}
			this.requestTimeout = setTimeout(() => {
				//NetErrorTips.instance.show("网络错误,请求超时！");
				Global.alertMediator.addAlert("网络错误请重新连接1", () => {
					console.log("type4 dianxian");
					PomeloManager._instance.reConnect();
				}, null, true);
			}, 8000);
		}


		private clearRequestOutTime() {
			clearTimeout(this.requestTimeout);
			this.requestTimeout = null;
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
			if (this.lastRequestHandler == roteName) {
				return;
			}
			this.lastRequestHandler = roteName;
			setTimeout(() => {
				this.lastRequestHandler = null;
			}, 500);
			LogUtils.logD(roteName + "请求参数 %j=", param);
			param.token = Global.playerProxy.token;
			if (Global.playerProxy.gametoken) {
				param.sdkToken = Global.playerProxy.gametoken;
			}
			return new Promise((resolve, reject) => {
				this.startRequestOutTime();

				this.pomelo.request(roteName, param, (resp) => {
					this.clearRequestOutTime();
					LogUtils.logD(roteName + "反悔 %j=", resp);
					if (resp && resp.code === 500 && roteName != ServerPostPath.game_roomHandler_c_queryRoomInfo) {
						if (roteName == ServerPostPath.game_roomHandler_c_quitRoom) {
							return;
						}
						NetErrorTips.instance.show("与服务器断开连接，请重新进入游戏!");
						return;
					}
					if (resp.error && resp.error.code && resp.error.code == -107) {
						Global.alertMediator.addAlert(resp.error.msg, () => {
							FrameUtils.flushWindow();
							// resolve(null);
						}, null, true);
					}
					if (roteName == ServerPostPath.hall_sceneHandler_c_enter) {
						if (resp.error && resp.error.code != 0 && resp.error.code != -213) {
							Global.alertMediator.addAlert(resp.error.msg, () => {
								// FrameUtils.flushWindow();
								resolve(null);
							}, null, true);
							return;
						}
					}
					if (resp.data) {
						resolve(resp.data);
					} else if (resp.error) {
						resolve(resp);
					} else {
						resolve({ error: { code: 0 } });
					}
				});
			})
		}


		public requestByCallback(roteName: string, param: any, callback) {
			if (!param) {
				param = {};
			}
			if (this.lastRequestHandler == roteName) {
				return;
			}
			this.lastRequestHandler = roteName;
			setTimeout(() => {
				this.lastRequestHandler = null;
			}, 500);
			LogUtils.logD(roteName + "请求参数 %j=", param);
			param.token = Global.playerProxy.token;
			if (Global.playerProxy.gametoken) {
				param.sdkToken = Global.playerProxy.gametoken;
			}
			this.startRequestOutTime();
			this.pomelo.request(roteName, param, (resp) => {
				this.clearRequestOutTime();
				LogUtils.logD(roteName + "反悔 %j=", _.clone(resp));
				if (resp && resp.code === 500 && (roteName != ServerPostPath.game_roomHandler_c_queryRoomInfo)) {
					if (roteName == ServerPostPath.game_roomHandler_c_quitRoom) {
						return;
					}
					NetErrorTips.instance.show("与服务器断开连接，请重新进入游戏!");
					// Global.alertMediator.addAlert("与服务器断开连接，请重新进入游戏！", () => {
					// FrameUtils.flushWindow();
					// }, null, true);
					return;
				}
				if (resp.error && resp.error.code && resp.error.code == -107) {
					Global.alertMediator.addAlert(resp.error.msg, () => {
						FrameUtils.flushWindow();
						// resolve(null);
					}, null, true);
				}
				if (roteName == ServerPostPath.hall_sceneHandler_c_enter) {
					if (resp.error && resp.error.code != 0 && resp.error.code != -213) {
						Global.alertMediator.addAlert(resp.error.msg, () => {
							// FrameUtils.flushWindow();
							callback(null);
						}, null, true);
						return;
					}

				}
				if (resp.data) {
					callback(resp.data);
				} else if (resp.error) {
					callback(resp.error);
				} else {
					callback({ error: { code: 0 } });
				}
			});
		}

		public listenOnAll() {
			var allNotify = _.extendOwn(ServerNotify);
			for (var key in allNotify) {
				this.pomelo.on(allNotify[key], (event, resp) => {
					let data = JSON.stringify(resp);
					LogUtils.logD(Date.now() + "," + event + "收到推送:  %j=", JSON.parse(data));
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
							LogUtils.logD("修改玩家金币:" + resp.ownGold);
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

			});
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
				// if (Global.runBack) {
				// Global.alertMediator.addAlert("网络错误请重新连接", () => {
				this.reConnect();
				// }, null, true);
				// }
			}
		}


		public disConnectBySelf() {
			console.log("type2 dianxian");
			Global.pomelo.state = PomeloStateEnum.DISCONNECT;
			this.pomelo.disconnect();
		}


		public reConnect() {
			console.log("type6 dianxian");
			//  &&
			if (!Global.runBack && Global.pomelo.state == PomeloStateEnum.DISCONNECT) {
				NetReconnect.instance.show();
			} else {
				Global.alertMediator.addAlert("网络错误请重新连接", () => {
					NetReconnect.instance.show()
				}, null, true);
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

		public disConnectAndReconnect() {
			console.log("type3 dianxian");
			let self = this;
			if (Global.pomelo.state != PomeloStateEnum.DISCONNECT) {
				Global.pomelo.state = PomeloStateEnum.DISCONNECT;
				this.pomelo.disconnect();
				this.clearRequestOutTime();
				setTimeout(() => {
					self.reConnect();
				}, 200);
			}
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
			egret.setInterval(() => {
				this.lastPingTime = Date.now();
				this.pomelo.request(routeName, {}, (resp) => {
					this.ping = Date.now() - this.lastPingTime;
					GameLayerManager.gameLayer().showPingTime();
				});
			}, this, 10000);
		}
	}
}