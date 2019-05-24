class BDZHallScene extends game.BaseScene {
	private backbtn: eui.Button;
	private selectGroup: eui.Group;
	private headerImage: eui.Image;
	public static hallId: string = "bdz";
	public pmdKey: string = "bdz";
	private goldLable: eui.Label;
	private nameLable: eui.Label;
	private qpBtn: eui.Button;
	private jlBtn: eui.Button;
	private helpBtn: eui.Button;
	public constructor() {
		super();
		this.skinName = new BDZHallSceneSkin();
	}


	public createChildren() {
		super.createChildren();
		this.gameList();
		this.renderPlayerInfo();
		this.checkReconnectScene();
		// game.AudioManager.getInstance().playBackgroundMusic("zjh_bgm_mp3");

	}

	private renderPlayerInfo() {
		let playerInfo = Global.playerProxy.playerData;
		this.nameLable.text = playerInfo.nickname;
		this.headerImage.source = `hall_header_${Global.playerProxy.playerData.sex}_${Global.playerProxy.playerData.figure_url}_png`;
		this.goldLable.text = NumberFormat.fNumber(Global.playerProxy.playerData.gold) + "";
		this.updateGold();
	}

	public onAdded() {
		super.onAdded();
		EventManager.instance.addEvent(ServerNotify.s_enterResult, this.enterResult, this);
		EventManager.instance.addEvent(EventNotify.ENTER_GOLD_SCENE, this.enterScene, this);
		this.init();
	}

	public onRemoved() {
		super.onRemoved()
		EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.enterResult, this);
		EventManager.instance.removeEvent(EventNotify.ENTER_GOLD_SCENE, this.enterScene, this);

	}

	/**
 * 游戏列表滑动效果；
 */
	// private gameScroller: eui.Scroller;
	private init() {

	}

	private remove() {

		/**
		 * 监听在滑动列表里面的值，只需要过程。
		 */
		// this.gameScroller.removeEventListener(egret.Event.CHANGE, this.showGame, this);
	}

	/**
	 * 显示虚拟
	 */
	private showGame() {
		// let item1 = this.selectGroup.getChildByName("item1001");
		// let item2 = this.selectGroup.getChildByName("item1002");
		// let item3 = this.selectGroup.getChildByName("item1003");
		// this.gameScroller.bounces = true;
		// let s = this.gameScroller.viewport.scrollH;
		// if (s > 0) {
		// 	if (s < 365 && s > 0) {
		// 		let num = Math.abs(s) / 365;
		// 		let num1 = parseFloat(num.toFixed(2));
		// 		if (num1 >= 1) {
		// 			num1 = 1;
		// 		}
		// 		item1.alpha = 1 - num1;
		// 		item2.alpha = item3.alpha = 1;
		// 	} else if (s < 556 && s > 390) {
		// 		let num = (Math.abs(s) - 390) / 365;
		// 		let num1 = parseFloat(num.toFixed(2));
		// 		if (num1 >= 1) {
		// 			num1 = 1;
		// 		}
		// 		item1.alpha = 0;
		// 		item2.alpha = 1 - num1;
		// 		item3.alpha = 1;
		// 	}
		// } else {
		// 	if (s > -335) {
		// 		let num = Math.abs(s) / 335;
		// 		let num1 = parseFloat(num.toFixed(2));
		// 		if (num1 >= 1) {
		// 			num1 = 1;
		// 		}
		// 		item3.alpha = 1 - num1;
		// 		item1.alpha = item2.alpha = 1;
		// 	} else if (s < -335 && s > -510) {
		// 		let num = (Math.abs(s) - 335) / 335;
		// 		let num1 = parseFloat(num.toFixed(2));
		// 		if (num1 >= 1) {
		// 			num1 = 1;
		// 		}
		// 		item2.alpha = 0;
		// 		item2.alpha = 1 - num1;
		// 		item1.alpha = 1;
		// 	}
		// }

	}



	private enterResult(e: egret.Event) {
		let data = e.data;
		if(data.reconnect){
			return;
		}
		if (data.code && data.code != 0) {
			Global.alertMediator.addAlert(data.msg, () => {
			}, null, true);
			return;
		}
		Global.roomProxy.setRoomInfo(e.data);
		try {
			game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_HALL);
			// game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_ZJHWAITE, data);
		} catch (e) {
			Global.alertMediator.addAlert("加入房间失败");
		} finally {
			this.lock = false;
		}
	}

	public async onTouchTap(e: egret.TouchEvent) {
		e.stopPropagation();
		switch (e.target) {
			// case this.helpBtn:
			// 	game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_ZJHHELP);
			// 	break;
			// case this.jlBtn:
			// 	game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_ZJHRECORD);
			// 	break;
		}
	}
	/**
	 * 检查回到界面
	 */
	private checkReconnectScene() {
		let roomState = Global.roomProxy.roomState;
		if (roomState && roomState.state == 1) {
			RotationLoading.instance.load(["bdz_game"], "", () => {
				this.enterScene({ data: roomState });
			});
		}
	}

	/**
	 * 获取对局信息
	 * @param  {egret.Event} e?
	 */
	private lock: boolean = false;
	private async enterScene(event) {
		if (this.lock) {
			return;
		}
		this.lock = true;
		var data = event.data;
		Global.roomProxy.lastGameConfig = data;
		var handler = ServerPostPath.hall_sceneHandler_c_enter;
		let resp: any = await game.PomeloManager.instance.request(handler, data);
		if (!resp) {
			this.lock = false;
			return;
		}
		try {
			if (resp.reconnect) {
				HallForwardFac.redirectScene(resp, data, () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_HALL);
				});
			} else {
				RotationLoading.instance.load(["bdz_game"], "", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_HALL);
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_MATCHING, data);
				});
			}
		} catch (e) {
			Global.alertMediator.addAlert("加入房间失败");
		} finally {
			this.lock = false;
		}
	}




	private gameList() {
		var nums = Global.gameProxy.gameNums["bdz"];
		let index = 1;
		var item: any;
		for (let i in nums) {
			let barConfig = nums[i];
			item = new BDZHallBar(nums[i], index);
			item.name = "item" + i;
			this.selectGroup.addChild(item);
			// item.x = 25 + item.width / 2 + (index - 1) * (item.width + 20)
			index++;
			item.alpha = 1;
			egret.Tween.get(this.selectGroup).to({
				alpha: 1
			}, 800);
			this.lock = false;

		}
	}
}