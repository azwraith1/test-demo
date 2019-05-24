module bjle {
	export class BJLHallBar extends game.BaseUI {
		private tzfflable: eui.BitmapLabel;
		private cc_wz: eui.Image;
		private cc_image: eui.Image;
		private config;
		private dbGroup: eui.Group;
		private rbw_zh: eui.Image;
		public constructor(data) {
			super();
			this.config = data;
			this.skinName = new BJLHallBarSkin();
		}

		public onAdded() {
			super.onAdded();
			game.UIUtils.setAnchorPot(this);
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEnded, this);
		}

		public createChildren() {
			super.createChildren();
			this.showBarByConfig(this.config.id);
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
			EventManager.instance.dispatch(EventNotify.ENTER_GOLD_SCENE, { gameId: 10010, sceneId: this.config.id });
			// RotationLoading.instance.load(["rbwar_game"], "", () => {
			// 	EventManager.instance.dispatch(EventNotify.ENTER_GOLD_SCENE, { gameId: 100010, sceneId: this.config.id });
			// });
			egret.Tween.get(this).to({ scaleX: 0.9, scaleY: 0.9 }, 50).to({ scaleX: 1, scaleY: 1 }, 50);
		}

		public showBarByConfig(num) {
		//	this.tzfflable.text = num;
			// 	let mc: DBComponent = GameCacheManager.instance.getCache("niuniu_xc" + index);
			// 	if (!mc) {
			// 		mc = new DBComponent("niuniu_xc" + index);
			// 		GameCacheManager.instance.setCache("niuniu_xc" + index, mc);
			// 	}
			// 	this.effcGroup.addChild(mc);
			// 	mc.x = mc.width / 2;
			// 	mc.y = mc.height / 2 + 55;
			// 	mc.playDefault(-1);
			// 	this.visible = true;
			// 	this.config = config;
			// 	let id = config.id;
			// 	let gold_min = config.gold_min;
			// 	this.zhunruLabel.text = "准入:" + gold_min;
			// 	if (index % 2 == 0) {
			// 		this.zhunruLabel.horizontalCenter = 25;
			// 	} else {
			// 		this.zhunruLabel.horizontalCenter = 20;
			// 	}
			// 	if (index == 5) {
			// 		this.zhunruLabel.verticalCenter = 110;
			// 	}

			// 	this.zhunruLabel.textColor = color
			// }
		}
	}
}