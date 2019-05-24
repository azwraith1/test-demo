class BDZMatchingScene extends game.BaseScene {
	private joinTimeout;
	private juhuaGroup: eui.Group;
	private rotationImage: eui.Image;
	private scenceId: number = 0;
	private backBtn: eui.Button;
	private players = {};
	public pmdKey: string = "bdz";
	// private helpBtn: eui.Button;
	// private jiluBtn: eui.Button;
	// private setBtn: eui.Button;
	public constructor() {
		super();
		this.skinName = new BDZMatchingSceneSkin();
		RES.loadGroup("bdz_back");
		// game.AudioManager.getInstance().playBackgroundMusic("zjh_bgm_mp3");
	}

	public async createChildren() {
		super.createChildren();
		egret.Tween.get(this.rotationImage, { loop: true }).to({
			rotation: 360
		}, 3000);
		let publicMsg = PMDComponent.instance;
		publicMsg.anchorOffsetY = 24;
		publicMsg.horizontalCenter = 10;
		publicMsg.top = 50;
	}

	public onAdded() {
		super.onAdded();
		EventManager.instance.addEvent(ServerNotify.s_startNewRound, this.startNewRound, this);
		EventManager.instance.addEvent(ServerNotify.s_enterResult, this.enterResult, this);
		EventManager.instance.addEvent(ServerNotify.s_playerEnter, this.playerEnter, this);
		EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
		EventManager.instance.addEvent(EventNotify.s_initHandCards, this.s_initHandCards, this);
	}

	public onRemoved() {
		super.onRemoved();
		EventManager.instance.removeEvent(ServerNotify.s_startNewRound, this.startNewRound, this);
		EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.enterResult, this);
		EventManager.instance.removeEvent(ServerNotify.s_playerEnter, this.playerEnter, this);
		EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
		EventManager.instance.removeEvent(EventNotify.s_initHandCards, this.s_initHandCards, this);
	}

	private s_initHandCards(e: egret.Event) {
		let data = e.data;
		let roomInfo = Global.roomProxy.roomInfo;
		for (let key in roomInfo.players) {
			let player = roomInfo.players[key] as PlayerGameDataBean;
			player.handCardsNum = 4;
			if (Number(key) == data.playerIndex) {
				player.handCards = data.handCards;
				player.tipCards = data.tipCards || [];
				player.roundPattern = data.roundPattern;
			}
		}
		game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_MATCHING);
		game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_GAME, this.scenceId);
	}

	/**
	 * 服务器断开 网会断
	 */
	private async reconnectSuc() {
		// let matchSuc: boolean = await Global.roomProxy.reconnectRoom() as boolean;
		// LogUtils.logD("roomInfo %j=", roomInfo);
		// if (matchSuc) {
		// if (Global.roomProxy.roomInfo.playing) {
		game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_MATCHING);
		game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_HALL);
		// }
		// }
	}

	private enterResult(e: egret.Event) {
		let data = e.data;
		if (data.code && data.code != 0) {
			Global.alertMediator.addAlert(data.msg, () => {

			}, null, true);
			return;
		}
		// e.data.roomInfo['players'] = this.players;
		Global.roomProxy.setRoomInfo(e.data);
	}


	private playerEnter(e: egret.Event) {
		let data = e.data;
		this.players[data.playerIndex] = data.player;
		Global.roomProxy.updatePlayer(data.playerIndex, data.player);
	}

	public async startNewRound(e: egret.Event) {
		//await Global.gameProxy.req2updateRoom();
		Global.roomProxy.roomInfo.dealer = e.data.dealerIndex;

	}

	public onTouchTap(event: egret.TouchEvent) {
		event.stopPropagation();
		switch (event.target) {
			case this.backBtn:
				this.backBtnTouch();
				break;
		}
	}

	private async backBtnTouch() {
		Global.roomProxy.clearRoomInfo();
		var handler = ServerPostPath.hall_sceneHandler_c_leave;
		let resp1: any = await game.PomeloManager.instance.request(handler, null);
		if (resp1 && resp1.error && resp1.error.code == 0) {
			game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_MATCHING);
			game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_HALL);
		} else {
			Global.alertMediator.addAlert("退出房间失败", null, null, true);
		}
	}

}