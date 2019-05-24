/*
 * @Author: MC Lee 
 * @Date: 2019-05-22 10:20:39 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-22 17:11:37
 * @Description: 游戏场景基本类--主要实现功能 重连 -> 退出游戏-> 重新开始
 */
module game {
	export abstract class BaseGameScene extends game.BaseScene {
		/**
		 * 是否允许退出
		 */
		protected allowBack: boolean;

		/**
		 * 换桌按钮（重新开始）
		 */
		protected restartBtn: eui.Button;

		/**
		 * 打开游戏界面通知
		 */
		abstract GAME_SCENE_NOTIFY: string;

		/**
		 * 关闭游戏界面通知
		 */
		abstract HALL_SCENE_NOTIFY: string;

		/**
		 * 关闭当前界面通知
		 */
		abstract CLOSE_NOTIFY: string;

		/**
		 * 对应匹配界面通知
		 */
		abstract MATCHING_SCENE_NOTIFY: string;


		public constructor() {
			super();
		}


		public onAdded() {
			super.onAdded();
		}


		public onRemoved() {
			super.onRemoved();

		}

		/**
		 * 重连上来的回调
		 * @param  {} reqData
		 */
		protected async reconnectCall(reqData, proxy: any = Global.roomProxy) {
			Global.playerProxy.updatePlayerInfo(async () => {
				if (this.allowBack) {
					return;
				}
				let handler = ServerPostPath.hall_sceneHandler_c_enter;
				reqData['isContinue'] = false;
				let resp: any = await game.PomeloManager.instance.request(handler, reqData);
				if (!resp) {
					return;
				}
				if (!resp.error) {
					resp.error = {};
					resp.error.code = 0;
				}
				//游戏房间已经解散
				if (resp.error.code == -213) {
					let text = GameConfig.GAME_CONFIG['long_config']['10006'].content || "对局已结束";
					Global.alertMediator.addAlert(text, null, null, true);
					this.backHall();
					//弹出提示
				} else if (resp.error.code == 0) {
					proxy.setRoomInfo(resp);
					this.reloadGame();
				}
			})

		}


		/**
		 * 换桌按钮
		 */
		public async restartBtnTouch() {
			delete Global.gameProxy.lastGameConfig['roomId'];
			let quitResp: any = await Global.pomelo.request(ServerPostPath.game_roomHandler_c_quitRoom, {});
			if (quitResp.gold) {
				Global.playerProxy.playerData.gold = quitResp.gold;
			}
			if (quitResp) {
				if (quitResp.error && quitResp.error.code != ErrorCode.ROOM_NOT_EXIST) {
					Global.alertMediator.addAlert(quitResp.error.msg, null, null, true);
					if (quitResp.error.code != ErrorCode.ROOM_PLAYING) {
						this.backHall();
					}
					return;
				}
				let data = Global.gameProxy.lastGameConfig;
				let quitResp1: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_enter, data)
				if (quitResp1) {
					this.backMatching();
				} else {
					Global.alertMediator.addAlert("换桌失败，请重新换桌!");
				}
			} else {
				Global.alertMediator.addAlert("换桌失败，请重新换桌!");
			}
		}

		/**
		 * 返回按钮
		 */
		public async backBtnTouch() {
			if (!this.allowBack) {
				let text = GameConfig.GAME_CONFIG['long_config']['10002'].content;
				Global.alertMediator.addAlert(text, null, null, true);
				return;
			}
			var quitResp: any = await Global.pomelo.request(ServerPostPath.game_roomHandler_c_quitRoom, {});
			if (quitResp) {
				if (quitResp.error && quitResp.error.code != ErrorCode.ROOM_NOT_EXIST) {
					Global.alertMediator.addAlert(quitResp.error.msg, null, null, true);
					if (quitResp.error.code != ErrorCode.ROOM_PLAYING) {
						Global.gameProxy.clearLastGameConfig();
						this.backHall();
					}
					return;
				}
				if (quitResp.gold) {
					Global.playerProxy.playerData.gold = quitResp.gold;
				}
				this.backHall();
			}
		}

		/**
		 * 返回对应游戏大厅
		 */
		protected backHall() {
			game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
			game.AppFacade.getInstance().sendNotification(this.HALL_SCENE_NOTIFY);
		}

		/**
		 * 返回对应的匹配
		 */
		protected backMatching() {
			game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
			game.AppFacade.getInstance().sendNotification(this.MATCHING_SCENE_NOTIFY);
		}

		/**
		 * 重新打开当前界面
		 */
		protected reloadGame() {
			game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
			game.AppFacade.getInstance().sendNotification(this.GAME_SCENE_NOTIFY);
		}


	}
}