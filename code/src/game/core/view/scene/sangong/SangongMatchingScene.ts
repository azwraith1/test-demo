module sangong {
	export class SangongMatchingScene extends game.BaseMatchingScene {
		public pmdKey: string = "sangong";
		public GAME_ID: string = "sangong";
		private players = {};
		private diFen: eui.Label;
		public bgMusic: string = "niuniu_bgm_mp3";
		/**
		 * 关闭匹配通知
		 */
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_SANGONG_WATING;

		/**
		 * 打开游戏大厅
		 */
		public GAME_HALL_NOTIFY: string = SceneNotify.OPEN_SANGONG_HALL;

		/**
		 * 进入游戏通知
		 */
		public GAME_SCENE_NOTIFY: string = SceneNotify.OPEN_SANGONG_GAME;

		/**
         * 记录界面的通知
         */
		public RECORD_NOTIFY: string = PanelNotify.OPEN_NIUGAMERECORD;

		/**
		 * 帮助界面的通知
		 */
		public HELP_NOTIFY: string = PanelNotify.OPEN_HELP_SHU;

		/**
		 * 设置界面的通知
		 */
		public SETTING_NOTIFY: string = PanelNotify.OPEN_SETTING;

		public constructor() {
			super();
			this.skinName = new SangongWaitSkin();
		}

		public async createChildren() {
			super.createChildren();
			this.showBtnsType(1);
			this.diFen.text = Global.gameProxy.lastGameConfig.diFen;
		}


		public resetPMDPosition() {
			let publicMsg = PMDComponent.instance;
			publicMsg.anchorOffsetY = 24;
			publicMsg.horizontalCenter = -10;
			publicMsg.top = 40;
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(ServerNotify.s_startNewRound, this.startNewRound, this);
			EventManager.instance.addEvent(ServerNotify.s_enterResult, this.enterResult, this);
			EventManager.instance.addEvent(ServerNotify.s_playerEnter, this.playerEnter, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(ServerNotify.s_startNewRound, this.startNewRound, this);
			EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.enterResult, this);
			EventManager.instance.removeEvent(ServerNotify.s_playerEnter, this.playerEnter, this);
		}

		private enterResult(e: egret.Event) {
			let data = e.data;
			if (data.code && data.code != 0) {
				Global.alertMediator.addAlert(data.msg, () => {

				}, null, true);
				return;
			}
			Global.roomProxy.setRoomInfo(e.data);
		}

		private playerEnter(e: egret.Event) {
			let data = e.data;
			this.players[data.playerIndex] = data.player;
			Global.roomProxy.updatePlayer(data.playerIndex, data.player);
		}

		public startNewRound(e: egret.Event) {
			game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
			game.AppFacade.getInstance().sendNotification(this.GAME_SCENE_NOTIFY);
		}


	}
}