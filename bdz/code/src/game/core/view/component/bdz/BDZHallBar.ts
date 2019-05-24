class BDZHallBar extends game.BaseUI {
	private config;
	private dbGroup: eui.Group;
	private zrLabel: eui.BitmapLabel;
	private index: number;
	public constructor(data, index) {
		super();
		this.config = data;
		this.index = index;
		this.skinName = new BDZHallBarSkin();
	}

	public onAdded() {
		super.onAdded();
		game.UIUtils.setAnchorPot(this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEnded, this);
	}

	public createChildren() {
		super.createChildren();
		this.showBarByConfig(this.config);
	}

	private lock: boolean = false;
	private onTouchEnded() {
		game.AudioManager.getInstance().playSound("ui_click_mp3");;//管理声音的
		if (!this.config.enable) {
			Global.alertMediator.addAlert("即将开放,敬请期待", null, null, true);
			return;
		}
		if (this.lock) {
			return;
		}
		this.lock = true;
		egret.setTimeout(function () {
			this.lock = false
		}, this, 1000);
		let playerGold = Global.playerProxy.playerData.gold;
		if (playerGold < this.config.gold_min) {
			let text = GameConfig.GAME_CONFIG['long_config']['10003'].content || "金币不足,无法进入";
			Global.alertMediator.addAlert(text, null, null, true);
			return;
		}
		RotationLoading.instance.load(["bdz_game"], "", () => {
			EventManager.instance.dispatch(EventNotify.ENTER_GOLD_SCENE, { gameId: 10009, sceneId: this.config.id });
		});
		egret.Tween.get(this).to({ scaleX: 0.9, scaleY: 0.9 }, 50).to({ scaleX: 1, scaleY: 1 }, 50);
	}

	public showBarByConfig(num) {
		this.zrLabel.text = NumberFormat.fNumberBDZStr3(num.bet_base);
		let dbComponent = GameCacheManager.instance.getCache(`bdz_xc_${this.index}`) as DBComponent;
		if (!dbComponent) {
			dbComponent = new DBComponent(`bdz_xc_${this.index}`);
			dbComponent.touchEnabled = false;
		}
		dbComponent.play("default", -1);
		// dbComponent.playDefault(0);
		this.dbGroup.addChild(dbComponent);
		dbComponent.resetPosition();
		switch (this.index) {
			case 1:
				// dbComponent.x = -15;
				this.x = 170;
				break;
			case 2:
				// dbComponent.x = -28;
				// dbComponent.y = -24;
				this.x = 530;
				break;
			case 3:
				// dbComponent.x = -53;
				// dbComponent.y = -33;
				this.x = 890;
				break
		}
	}
}
