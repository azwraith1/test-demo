module sangong {
	export class SangongHallSceneBar extends game.BaseUI {
		private zhunruLabel: eui.Label;
		private difenImage: eui.Image;
		private config;
		private barImg: eui.Image;
		private effcGroup: eui.Group;
		public constructor() {
			super();
		}

		public onAdded() {
			super.onAdded();
			game.UIUtils.setAnchorPot(this);
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEnded, this);
		}

		public createChildren() {
			super.createChildren();
		}

		private lock: boolean = false;
		private onTouchEnded() {
			majiang.MajiangUtils.playClick();//管理声音的
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
			RotationLoadingShu.instance.load(["sangong_game"], "", () => {
				EventManager.instance.dispatch(EventNotify.ENTER_GOLD_SCENE, { gameId: 10004, sceneId: this.config.id, diFen: this.config.bet_base });
			});
			egret.Tween.get(this).to({ scaleX: 0.9, scaleY: 0.9 }, 50).to({ scaleX: 1, scaleY: 1 }, 50);
		}

		public showBarByConfig(config, index) {
			let mc: DBComponent = GameCacheManager.instance.getCache("sg_xc_" + index);
			if (!mc) {
				mc = new DBComponent("sg_xc_" + index);
				GameCacheManager.instance.setCache("sg_xc_" + index, mc);
			}
			this.effcGroup.addChild(mc);
			if (index == 5) {
				mc.x = mc.width / 2 - 20;
			} else if (index == 4) {
				mc.x = mc.width / 2;
			} else {
				mc.x = mc.width / 2 - 15;
			}
			mc.y = mc.height / 2 - 10;
			if (index % 2 == 0) {
				mc.y = mc.height / 2 - 13;
			}
			mc.playDefault(-1);
			this.visible = true;
			this.config = config;
			let bet_base = config.bet_base;
			let icon = config.icon;
			let id = config.id;
			let gold_min = config.gold_min;
			this.zhunruLabel.text = "准入:" + gold_min;
			let betStr = bet_base + "";
			switch (index) {
				case 1:
					this.zhunruLabel.horizontalCenter = -15;
					this.zhunruLabel.verticalCenter = 120;
					break;
				case 2:
					this.zhunruLabel.horizontalCenter = 5;
					this.zhunruLabel.verticalCenter = 117;
					break;
				case 3:
					this.zhunruLabel.horizontalCenter = -13;
					this.zhunruLabel.verticalCenter = 120;
					break;
				case 4:
					this.zhunruLabel.horizontalCenter = 5;
					this.zhunruLabel.verticalCenter = 120;
					break;
				case 5:
					this.zhunruLabel.horizontalCenter = 6;
					this.zhunruLabel.verticalCenter = 135;
					break;
			}
		}
	}
}