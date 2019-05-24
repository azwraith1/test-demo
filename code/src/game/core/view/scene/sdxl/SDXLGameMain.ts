/*
 * @Author: wangtao 
 * @Date: 2019-04-08 12:07:03 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 14:58:27
 * @Description: 
 */
module sdxl {
	export class SDXLGameMain extends game.BaseScene {
		public scene1: sdxl.SDXLGameScene1;
		public scene3: sdxl.SDXLGameScene3;
		private toFreeAni: DBComponent;


		public constructor() {
			super();
			this.skinName = new SDXLGameMainSkin();
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
			EventManager.instance.addEvent(ServerNotify.s_enterOtherSlotScene, this.enterOtherGame, this);
			EventManager.instance.addEvent(EventNotify.SDXL_ENTER_FREE_GAME_SCENE, this.enterFreeGame, this);
			EventManager.instance.addEvent(EventNotify.SDXL_QUIT_FREE_GAME, this.quitFreeGame, this);
			EventManager.instance.addEvent(ServerNotify.s_kickGame, this.kickGame, this);
			EventManager.instance.addEvent(EventNotify.SDXL_START_FREE_GAME_SCENE, this.startfreeGame, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
			EventManager.instance.removeEvent(ServerNotify.s_enterOtherSlotScene, this.enterOtherGame, this);
			EventManager.instance.removeEvent(EventNotify.SDXL_ENTER_FREE_GAME_SCENE, this.enterFreeGame, this);
			EventManager.instance.removeEvent(EventNotify.SDXL_QUIT_FREE_GAME, this.quitFreeGame, this);
			EventManager.instance.removeEvent(ServerNotify.s_kickGame, this.kickGame, this);
			EventManager.instance.removeEvent(EventNotify.SDXL_START_FREE_GAME_SCENE, this.startfreeGame, this);
		}

		public createChildren() {
			super.createChildren();
			this.toFreeAni = DBComponent.create("toFreeAni", "sdxl_opensakura");
			game.SDXLUtils.sakura = DBComponent.create("sakura", "sdxl_bigwin_sakura");
			game.SDXLUtils.titleChaneAni = DBComponent.create("titleChaneAni", "sdxl_bigwin_guang");
			this.scene3.anchorOffsetX = this.scene3.width / 2;
			// this.toFreeAni = new DBComponent("sdxl_opensakura");
			// game.SDXLUtils.sakura = new DBComponent("sdxl_bigwin_sakura");
			// game.SDXLUtils.titleChaneAni = new DBComponent("sdxl_bigwin_guang");
		}
		/**
		 * @param  {egret.Event} e
		 * 有其他未完成的老虎机游戏
		 */
		public enterOtherGame(e: egret.Event) {
			let resp = e.data;
			let text: string;
			if (resp.sceneId == 1001) {
				if (resp.isScatter) {
					text = "您在“大闹天宫”中还有未完成的免费游戏，请先去完成吧";
				}else if(resp.freeTimes){
					text = "您在“大闹天宫”中还有"+resp.freeTimes + "次免费游戏,请先去完成吧";
				}
			}else if(resp.sceneId == 1003){
				if (resp.isScatter) {
					text = "您在“赤壁之战”中还有未完成的免费游戏，请先去完成吧";
				}else if(resp.freeTimes){
					text = "您在“赤壁之战”中还有"+resp.freeTimes + "次免费游戏,请先去完成吧";
				}
			}
			if (resp) {
				Global.alertMediator.addAlert(text, () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDXL);
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SDXL_TIPS);
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DNTG_RECORD_PANEL);
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SDXL_AUTO_PANEL);
				}, "", true);
			}
		}

		public onTouchTap(e: egret.TouchEvent) {
			switch (e.target) {
			}
		}
		/**
		 * 播放免费游戏动画，开始免费游戏
		 */
		private enterFreeGame() {
			this.scene1.quitBtn.touchEnabled = false;
			SoundManager.getInstance().playEffect("sdxl_scatin_dntg_mp3");
			this.toFreeAni.bottom = 325;
			this.toFreeAni.horizontalCenter = 0;
			this.toFreeAni.play("", 1);
			this.scene3.visible = true;
			this.resizeGroup.addChild(this.toFreeAni);
			this.toFreeAni.resetPosition();
			egret.Tween.get(this.scene3).to({ bottom: 0, top: 0 }, 1300);
			this.toFreeAni.callback = () => {
				SoundManager.getInstance().playMusic("sdxl_sactbackground_mus_dntg_mp3");
				EventManager.instance.dispatch(EventNotify.SDXL_ENTER_FREE_GAME);
				game.UIUtils.removeSelf(this.toFreeAni);
			}

		}
		/**
		 * 退出神雕侠侣游戏
		 */
		private quitFreeGame() {
			this.scene3.visible = false;
			this.scene3.bottom = -720;
			this.scene3.top = 720;
			EventManager.instance.dispatch(EventNotify.SDXL_ENTER_COMMON_GAME);
		}
		/**
		 * 直接进入免费游戏
		 */
		private startfreeGame() {
			this.scene3.visible = true;
			this.scene3.bottom = this.scene3.top = 0;
			EventManager.instance.dispatch(EventNotify.SDXL_START_FREE_GAME);
		}
		/**
		 * 超时未下注请出房间
		 */
		private kickGame() {
			let text = "你已超过5分钟局未下注,请重新进入游戏";
			Global.alertMediator.addAlert(text, () => {
				Global.playerProxy.playerData.gold = game.SDXLUtils.ToTalMoney;
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDXL);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SDXL_TIPS);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SDXL_AUTO_PANEL);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LEAVE_LAOHU_PANEL);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DNTG_RECORD_PANEL);
			}, "", true);
			return;
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
			SoundManager.getInstance().stopEffectByName("sdxl_reel_mp3");
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
			game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDXL);
			game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
			game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SDXL_TIPS);
			game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
			game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LEAVE_LAOHU_PANEL);
			// }
		}
	}
}