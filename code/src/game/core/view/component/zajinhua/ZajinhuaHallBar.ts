module zajinhua {
	export class ZajinhuaHallBar extends game.BaseUI {
		private config;
		private dbGroup: eui.Group;
		private difen: eui.BitmapLabel;
		private zhunru: eui.BitmapLabel;
		private index: number;
		public constructor(data, index) {
			super();
			this.config = data;
			this.index = index;
			this.skinName = new ZajinhuaHallbarSkin();
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
			majiang.MajiangUtils.playClick();//管理声音的
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
			RotationLoading.instance.load(["zhajinhua_game"], "", () => {
				EventManager.instance.dispatch(EventNotify.ENTER_GOLD_SCENE, { gameId: 10005, sceneId: this.config.id, diFen: this.config.bet_base, zhun: this.config.gold_min });
			});
			egret.Tween.get(this).to({ scaleX: 0.9, scaleY: 0.9 }, 50).to({ scaleX: 1, scaleY: 1 }, 50);
		}

		public showBarByConfig(num) {
			this.difen.text = num.bet_base;
			this.zhunru.text = num.gold_min;
			let dbComponent = GameCacheManager.instance.getCache(`zjh_xc_${this.index}`);
			if (!dbComponent) {
				dbComponent = new DBComponent(`zjh_xc_${this.index}`);
				dbComponent.touchEnabled = false;
			}
			dbComponent.playDefault(0);
			this.dbGroup.addChild(dbComponent);
			dbComponent.resetPosition();
			switch (this.index) {
				case 1:
					dbComponent.x = -15;
					this.x = 170;
					break;
				case 2:
					dbComponent.x = -28;
					dbComponent.y = -24;
					this.x = 490;
					break;
				case 3:
					dbComponent.x = -53;
					dbComponent.y = -33;
					this.x = 810;
					break
				case 4:
					dbComponent.x = -55;
					dbComponent.y = -47;
					this.x = 1128;
					break
			}
		}
	}
}