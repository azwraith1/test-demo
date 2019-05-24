class MainHallScene extends game.BaseScene {
	public pmdKey: string = "common";
	public bgMusic: string = "main_bg_mp3";
	//适配group
	public resizeGroup: eui.Group;
	private topGroup: eui.Group;
	private backHomeBtn: eui.Button;
	private nameLabel: eui.Label;
	private headerImage: eui.Image;
	private gameScroller: eui.Scroller;
	private gameGroup: eui.Group;

	private personGroup: eui.Group;;
	private ruleBtn: eui.Button;
	private rechargeBtn: eui.Button;
	private btnGroup: eui.Group;
	private headerMask: eui.Image;
	private headerBtn: eui.Button;
	public constructor() {
		super();
		this.skinName = new MainHallSceneSkin();
	}

	/**
	 * 书写逻辑代码
	 */
	public createChildren() {
		super.createChildren();
		game.UIUtils.changeResize(1);
		this.backHomeBtn.visible = ServerConfig.HOME_PAGE_URL.indexOf("http") > -1 && ServerConfig.OP_RETURN_TYPE != "3";
		this.rechargeBtn.visible = ServerConfig.RECHARGE_URL.indexOf("http") > -1;
		// this.fullScreenBtn.visible = !NativeApi.instance.isiOSDevice;
		this.createDbComponent();
		//给玩家的数据赋值
		this.nameLabel.text = Global.playerProxy.playerData.nickname;
		let headerImage = `hall_header_${Global.playerProxy.playerData.sex}_${Global.playerProxy.playerData.figure_url}_png`;
		this.headerImage.source = headerImage;
		this.headerImage.mask = this.headerMask;
		this.updateGold();
		this.createList();
		Global.gameProxy.people();
		this.showPlayerCount();
		this.gameScroller.scrollPolicyV = "off";
		this.checkReconnectScene();
		this.gameScroller.bounces = true;
		let publicMsg = PMDComponent.instance;
		publicMsg.anchorOffsetY = 24;
		publicMsg.horizontalCenter = 0;
		publicMsg.top = 100;
		// this.showGame();

		this.showCreateAni();
	}


	private showCreateAni() {
		let startRight = this.personGroup.right;
		this.personGroup.right -= 600;
		egret.Tween.get(this.personGroup).to({
			right: startRight
		}, 400, egret.Ease.sineInOut);
		this.gameScroller.alpha = 0;
		egret.Tween.get(this.gameScroller).to({
			alpha: 1
		}, 700, egret.Ease.circIn);

		this.topGroup.top -= 400;
		egret.Tween.get(this.topGroup).to({
			top: this.topGroup.top + 400
		}, 400, egret.Ease.bounceIn);

		this.btnGroup.left -= 500;
		egret.Tween.get(this.btnGroup).to({
			left: this.btnGroup.left + 500
		}, 400, egret.Ease.bounceIn);

	}

	private girlDBComponent: DBComponent;
	private createDbComponent() {
		let mc: DBComponent = GameCacheManager.instance.getCache("main_girl");
		if (!mc) {
			mc = new DBComponent("girl");
			GameCacheManager.instance.setCache("girl", mc);
		}
		this.personGroup.addChild(mc);
		this.personGroup.bottom = -300;
		this.personGroup.right = -70;
		mc.resetPosition();
		mc.playDefault(-1);
	}

	protected onTouchTap(e: egret.TouchEvent) {
		switch (e.target) {
			case this.recordBtn:
				game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_GAMERECORD, null);
				break;
			case this.settingBtn:
				// game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN_HALL);
				// game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BJLGAME);
				game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SETTING, { setIndex: 1 });
				break;
			case this.ruleBtn:
				game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_HELP)
				break;
			case this.rechargeBtn:
				FrameUtils.goRecharge();
				break;
			case this.backHomeBtn:
				FrameUtils.goHome();
				break;
			case this.headerBtn:
			case this.headerImage:
				// majiang.MajiangUtils.playClick();
				game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_HEADER);
				break;
		}
	}


	private buttonLists: MainHallButton[] = [];
	/**
	 * 
	 */
	private createList() {
		let list = Global.gameProxy.sceneList;
		let comment = list[0];
		comment.grade = 1;
		let first = new MainHallButton(comment);
		this.buttonLists.push(first);
		first.showHot();
		first.x = 30;
		first.y = 30;
		this.gameGroup.addChild(first);
		// this.minX = this.localToGlobal().x;
		// this.maxWidth = this.minX + this.width;
		let xIndex = first.x + first.width / 2;
		for (let i = 2; i < list.length; i += 2) {
			let topData = list[i];
			let top = new MainHallButton(topData);
			this.buttonLists.push(top);
			top.x = xIndex + 5;
			top.y = 30;
			this.gameGroup.addChild(top);
			let bottomData = list[i + 1];
			if (bottomData) {
				let bottom = new MainHallButton(bottomData);
				this.buttonLists.push(bottom);
				bottom.x = xIndex + 5;
				bottom.y = top.height + 30;
				this.gameGroup.addChild(bottom);
			}

			xIndex += top.width;
		}

		let data = list[list.length - 1];
		let top = new MainHallButton(data);
		this.buttonLists.push(top);
		top.x = xIndex - top.width / 2;
		top.y = 30;
		this.gameGroup.addChild(top);
		top.visible = false;
	}

	private num: number;
	public test() {
		this.num = 1;

	}

	public onAdded() {
		super.onAdded();
		EventManager.instance.addEvent(EventNotify.UPDATE_PLAYER_COUNT, this.showPlayerCount, this);
		EventManager.instance.addEvent(EventNotify.CHANG_PLAYER_HEADER, this.changHeader, this);
		EventManager.instance.addEvent(EventNotify.JOIN_SCENE_GAMEID, this.buttonTouch, this);
		this.gameScroller.addEventListener(egret.Event.CHANGE, this.showGame, this);
		this.startDs();
	}

	public onRemoved() {
		super.onRemoved();
		EventManager.instance.removeEvent(EventNotify.UPDATE_PLAYER_COUNT, this.showPlayerCount, this);
		EventManager.instance.removeEvent(EventNotify.CHANG_PLAYER_HEADER, this.changHeader, this);
		EventManager.instance.removeEvent(EventNotify.JOIN_SCENE_GAMEID, this.buttonTouch, this);
		this.gameScroller.removeEventListener(egret.Event.CHANGE, this.showGame, this);
		egret.clearInterval(this.peopleCountInterval)
		this.peopleCountInterval = null;
	}


	/**
	 * 显示虚拟
	 */
	private showGame() {
		this.gameScroller.bounces = true;
		let s = this.gameScroller.viewport.scrollH;
		for (let i = 0; i < this.buttonLists.length; i++) {
			let button = this.buttonLists[i];
			button.checkAlapa(s, this.gameGroup.width);
		}
	}


	private changHeader(e: egret.Event) {
		let data = e.data;
		this.headerImage.source = `hall_header_${data.sex}_${data.figureUrl}_png`;
		Global.playerProxy.playerData.figure_url = data.figureUrl;
		Global.playerProxy.playerData.sex = data.sex;
	}
	//重连后禁止点击
	private reconnectTouch: boolean = false;

	private buttonTouch(evt: egret.TouchEvent) {
		if (this.reconnectTouch) return;
		switch (evt.data.gameId) {
			case "mjxlch":
			case "mjxzdd":
				LoadingScene.instance.load(["majiang_hall"], "majiang_bg_jpg", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN_HALL)
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG_HALL)
				});
				break;
			case "blnn":
				RotationLoading.instance.load(["niuniu_hall"], "majiang_bg_jpg", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN_HALL);
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_NIUNIUSELECT);
				});
				break;
			case "sangong":
				RotationLoading.instance.load(["sangong_hall"], "", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_SANGONG_HALL);
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN_HALL);
				});
				break;
			case "slot":
				RotationLoading.instance.load(["slot_hall"], "", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LAOHUJI_HALL);
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN_HALL);
				});
				break;
			case "rbwar":
				RotationLoading.instance.load(["rbwar_hall"], "", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_RBWAR_HALL);
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN_HALL);
				});
				break;
			case "dzmj":
				RotationLoading.instance.load(["dzmj_hall"], "", () => {
					// RES.loadGroup("majiang_back");
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN_HALL)
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_DZMJ_HALL)
				});
				break;
			case "zjh":
				RotationLoading.instance.load(["zhajinhua_hall"], "", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_ZJHSELECT);
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN_HALL);
				});
				break;
			case "baccarat":
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BJLHALL);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN_HALL);
				break;
		}
	}

	private sendMsg(obj) {
		egret.Tween.get(obj).to({ scaleX: 0.9, scaleY: 0.9 }, 50).to({ scaleX: 1, scaleY: 1 }).call(() => {
			Global.alertMediator.addAlert("暂未开放，敬请期待", null, null, true);
		});
	}

	/**
	 * 更新玩家信息
	 */
	private showPlayerCount() {
		for (let i = 0; i < this.buttonLists.length; i++) {
			let button = this.buttonLists[i];
			button.updatePlayerCount();
		}
		// this.scButton.peoples_mj.text = Global.gameProxy.peoplesCounts["scmj"];
		// this.nnButton.peoples_nn.text = Global.gameProxy.peoplesCounts["blnn"];
		// this.rbwarButton.peoples_rbwar.text = Global.gameProxy.peoplesCounts["rbwar"];
		// this.sgButton.peoples_sg.text = Global.gameProxy.peoplesCounts["sangong"];
		// this.lhjButton.peoples_lhj.text = Global.gameProxy.peoplesCounts["slot"];
	}

	/**
		 * 检查回到界面
		 */
	private checkReconnectScene() {
		let roomState = Global.gameProxy.roomState;
		if (roomState && roomState.state == 1) {
			this.reconnectTouch = true;
			this.reconnectRoom(roomState);
		}
	}

	/**
	 * 开启在线人数请求
	 */
	private peopleCountInterval;
	public startDs() {
		this.peopleCountInterval = egret.setInterval(() => { Global.gameProxy.people() }, this, 60000, );
	}

	private async reconnectRoom(roomState) {
		var data = roomState;
		Global.gameProxy.lastGameConfig = data;
		var handler = ServerPostPath.hall_sceneHandler_c_enter;
		let resp: any = await game.PomeloManager.instance.request(handler, data);
		try {
			if (resp.reconnect) {
				await HallForwardFac.redirectScene(resp, data, (isPlaying) => {
					if (isPlaying) {
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAIN_HALL);
					} else {
						this.reconnectTouch = false;
					}
				});
			}
		} catch (e) {
			Global.alertMediator.addAlert("加入房间失败");
		} finally {
			this.reconnectTouch = false;
		}
	}

	protected changeYcPos() {
		let child = GameLayerManager.gameLayer().netStatus;
		// child.validateNow();
	}
}