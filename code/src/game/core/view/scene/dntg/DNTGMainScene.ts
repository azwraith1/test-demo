/*
 * @Author: wangtao 
 * @Date: 2019-03-27 14:23:49 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 17:49:26
 * @Description: 
 */
module dntg {
	export class DNTGMainScene extends game.BaseScene {
		private scene1: DNTGScene1;
		private scene2: DNTGScene2;
		private scene3: DNTGScens3
		public bgMusic: string;
		public constructor() {
			super();
			this.skinName = new DNTGMainSceneSkin();
		}

		public createChildren() {
			super.createChildren();
			game.UIUtils.removeButtonScaleEffects(this);
			this.scene2.visible = this.scene3.visible = false;
			// game.UIUtils.removeSelf(this.scene2);
			// this.scene2.onRemoved();
			// game.UIUtils.removeSelf(this.scene3);
			// this.scene3.onRemoved();
		}

		public isInScatter: boolean = false;

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.DNTG_ENTER_FREE_GAME, this.enterFreeGame, this);
			EventManager.instance.addEvent(EventNotify.DNTG_START_FREE_GAME, this.startFreeGame, this);
			EventManager.instance.addEvent(EventNotify.DNTG_QUIT_FREE_GAME, this.quitFreeGame, this);
			EventManager.instance.addEvent(ServerNotify.s_enterOtherSlotScene, this.enterOtherGame, this);
			EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
			EventManager.instance.addEvent(ServerNotify.s_kickGame, this.kickGame, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.DNTG_ENTER_FREE_GAME, this.enterFreeGame, this);
			EventManager.instance.removeEvent(ServerNotify.s_enterOtherSlotScene, this.enterOtherGame, this);
			EventManager.instance.removeEvent(EventNotify.DNTG_QUIT_FREE_GAME, this.quitFreeGame, this);
			EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
			EventManager.instance.removeEvent(EventNotify.DNTG_START_FREE_GAME, this.startFreeGame, this);
			EventManager.instance.removeEvent(ServerNotify.s_kickGame, this.kickGame, this);
		}

		/**
		 * @param  {egret.Event} e
		 * 有其他未完成的老虎机游戏
		 */
		public enterOtherGame(e: egret.Event) {
			let resp = e.data;
			let text: string;
			if (resp.sceneId == 1002) {
				if (resp.isScatter) {
					text = "您在“神雕侠侣”中还有未完成的免费游戏，请先去完成吧";
				} else if (resp.freeTimes) {
					text = "您在“神雕侠侣”中还有" + resp.freeTimes + "次免费游戏,请先去完成吧";
				}
			}else if(resp.sceneId == 1003){
				if (resp.isScatter) {
					text = "您在“赤壁之战”中还有未完成的免费游戏，请先去完成吧";
				} else if (resp.freeTimes) {
					text = "您在“赤壁之战”中还有" + resp.freeTimes + "次免费游戏,请先去完成吧";
				}
			}
			if (resp) {
				Global.alertMediator.addAlert(text, () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DNTG);
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHUGAME_TIPS);
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LEAVE_LAOHU_PANEL);
				}, "", true);
			}
		}
		/**
		 * 进入免费游戏场景
		 */
		public enterFreeGame() {
			// if(!this.scene2.parent){
			// 	this.resizeGroup.addChild(this.scene2)
			// 	// this.scene2.listenOn();
			// }
			// if(!this.scene3.parent){
			// 	this.resizeGroup.addChild(this.scene3)
			// 	this.scene3.listenOn();

			// }
			this.scene2.visible = this.scene3.visible = true;
			this.scene1.isInScatter = true;
			egret.Tween.get(this).to({ y: 1440 }, 1200).call(() => {
				this.scene1.visible = false;
			});
			EventManager.instance.dispatch(EventNotify.DNTG_ENTER_FREE_GAME_SCENE);
		}
		/**
		 * 超时未下注请出房间
		 */
		private kickGame() {
			let text = "你已超过5分钟局未下注,请重新进入游戏";
			Global.alertMediator.addAlert(text, () => {
				Global.playerProxy.playerData.gold = game.LaohuUtils.ToTalMoney;
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DNTG);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHUGAME_TIPS);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DNTG_RECORD_PANEL);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LEAVE_LAOHU_PANEL);
			}, "", true);
			return;
		}
		/**
		 * 继续免费游戏
		 */
		public startFreeGame() {
			// if(!this.scene2.parent){
			// 	this.resizeGroup.addChild(this.scene2)
			// 	// this.scene2.onAdded();
			// }
			// if(!this.scene3.parent){
			// 	this.resizeGroup.addChild(this.scene3)
			// 	this.scene3.listenOn();

			// }
			this.scene2.visible = this.scene3.visible = true;
			this.scene1.visible = false;
			this.scene1.isInScatter = true;
			egret.Tween.get(this).to({ y: 1440 }, 1200);
			EventManager.instance.dispatch(EventNotify.DNTG_START_FREE_GAME_SCENE);
		}
		/**
		 * 退出dntg
		 */
		public quitFreeGame() {
			this.scene1.isInScatter = false;
			this.scene1.visible = true;
			egret.Tween.get(this).to({ y: 0 }, 800).call(() => {
				// // this.scene2.onRemoved();
				// game.UIUtils.removeSelf(this.scene2);
				// // this.scene3.onRemoved();
				// game.UIUtils.removeSelf(this.scene3);
				this.scene2.visible = this.scene3.visible = false;
			});
			this.scene1.runningType = 3;
			EventManager.instance.dispatch(EventNotify.DNTG_ENTER_COMMON_GAME);
		}
		/**
		 * 断线重连
		 * @param  {egret.Event} e
		 */
		private async reconnectSuc(e: egret.Event) {
			// let handler = ServerPostPath.hall_sceneHandler_c_enter;
			// let data = { "gameId": "slot", "sceneId": 1011 };
			// let resp: any = await game.PomeloManager.instance.request(handler, data);
			// if (!resp) {
			game.LaohuUtils.auto_times = 0;
			SoundManager.getInstance().stopEffectByName("reel_dntg_mp3");
			game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
			// game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_LAOHU_GAME);
			// 	return;
			// }
			// if (!resp.error) {
			// 	resp.error = {};
			// 	resp.error.code = 0;
			// }
			// if (resp.error.code == -213) {
			// 	game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
			// 	game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_LAOHU_GAME);
			// 	let text = "游戏已经结束，请重新登录";
			// 	Global.alertMediator.addAlert(text);
			// 	//弹出提示
			// } else if (resp.error.code == 0) {
			// 	game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
			game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DNTG);
			game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
			game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHUGAME_TIPS);
			game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
			game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DNTG_RECORD_PANEL);
			// }
		}
	}
}