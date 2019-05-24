module rbwar {
	export class RBWHallBar extends game.BaseUI {
		private tzfflable: eui.BitmapLabel;
		private cc_wz: eui.Image;
		private cc_image: eui.Image;
		private config;
		private dbGroup: eui.Group;
		private rbw_zh: eui.Image;
		public constructor(data) {
			super();
			this.config = data;
			this.skinName = new RBWHallBarSkin();
		}

		public onAdded() {
			super.onAdded();
			game.UIUtils.setAnchorPot(this);
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEnded, this);
		}

		public createChildren() {
			super.createChildren();
			let t = this.config.bet_base;
			let t1 = this.config.bet_max;
			let t2 = this.config.icon;
			let endshow = this.config.enable;
			this.showBarByConfig(t, t1, t2, endshow);
		}

		private lock: boolean = false;
		private onTouchEnded() {
			majiang.MajiangUtils.playClick();//管理声音的
			if(!this.config.enable){
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
			RotationLoading.instance.load(["rbwar_game"], "", () => {
				EventManager.instance.dispatch(EventNotify.ENTER_GOLD_SCENE, { gameId: 10008, sceneId: this.config.id });
			});
			egret.Tween.get(this).to({ scaleX: 0.9, scaleY: 0.9 }, 50).to({ scaleX: 1, scaleY: 1 }, 50);
		}

		public showBarByConfig(tz1, tz2, index, endshow) {
			if (!endshow) {
				this.rbw_zh.source = RES.getRes("rbw_select_gh_png");
				return;
			}
			this.tzfflable.text = tz1 + "-" + tz2;
			let dbComponent = GameCacheManager.instance.getCache(`rbw_main_${index}`);
			if (!dbComponent) {
				dbComponent = new DBComponent(`rbw_main_${index}`);
				dbComponent.touchEnabled = false;
			}
			dbComponent.playDefault(0);
			this.dbGroup.addChild(dbComponent);
			dbComponent.resetPosition();
			this.width = dbComponent.width
			this.height = dbComponent.height
			// dbComponent.y += 60;
			// this.cc_wz.source = RES.getRes(`rbw_s${index}_${index}_png`)
			// this.cc_image.source = RES.getRes(`rbw_s${index}_png`)
		}
	}
}