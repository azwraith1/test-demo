class MainHallButton extends game.BaseUI {
	private hotImage: eui.Image;
	private titleImage: eui.Image;
	private dbComponent: DBComponent;
	private dbGroup: eui.Group;
	private hotImageGroup: eui.Group;
	private buttonData: any;
	private newImage: eui.Image;
	// private minX: number;
	// private maxX: number;
	private pepleCountLabel: eui.Label;
	public constructor(buttonData) {
		super();
		this.buttonData = buttonData;
		if (this.buttonData.grade == GRADE.RECOMMEND) {
			this.skinName = new MainHallBigBtnSkin();
		} else {
			this.skinName = new MainHallSmallBtnSkin();
		}
	}

	public createChildren() {
		super.createChildren();
		let grade = this.buttonData.grade;
		if (grade == GRADE.HOT) {
			this.showHot();
		} else if (grade == GRADE.NEW) {
			this.showNew();
		}
		this.dbGroup.touchEnabled = false;
		this.dbGroup.touchChildren = false;
		this.titleImage.source = RES.getRes(`main_title_${this.buttonData.game_icon}_png`);
		this.createDb();
	}

	public onAdded() {
		super.onAdded();
		game.UIUtils.setAnchorPot(this);
	}

	public onTouchTap(e: egret.TouchEvent) {
		egret.Tween.get(this).to({ scaleX: 1.1, scaleY: 1.1 }, 100).to({ scaleX: 1, scaleY: 1 }, 100).call(() => {
			if (this.buttonData.gameId == "baccarat") {
				EventManager.instance.dispatch(EventNotify.JOIN_SCENE_GAMEID, { gameId: this.buttonData.gameId });
				return;
			}
			if (this.buttonData.grade == GRADE.DEV) {
				Global.alertMediator.addAlert("暂未开放，敬请期待", null, null, true);
				return;
			} else if (this.buttonData.grade == GRADE.MAINTENANCE) {
				Global.alertMediator.addAlert("游戏维护中", null, null, true);
				return;
			}
			EventManager.instance.dispatch(EventNotify.JOIN_SCENE_GAMEID, { gameId: this.buttonData.gameId });
		});
	}


	public updatePlayerCount() {
		if (this.buttonData.grade == GRADE.DEV) {
			this.pepleCountLabel.text = "敬请期待";
			return;
		}
		if (this.buttonData.grade == GRADE.MAINTENANCE) {
			this.pepleCountLabel.text = "维护中";
			return;
		}
		if (this.buttonData.gameId == "mjxlch") {
			this.pepleCountLabel.text = Global.gameProxy.peoplesCounts["scmj"];
		} else {
			this.pepleCountLabel.text = Global.gameProxy.peoplesCounts[this.buttonData.gameId];
		}
	}

	public checkAlapa(offersetX, width) {
		egret.Tween.removeTweens(this);
		let alpha = -1;
		if (offersetX > 0) {
			let maxX = this.x + this.width / 2;
			let minX = this.x// - this.width / 2 + this.width / 3;
			let nowPoint = offersetX;
			if (nowPoint < minX) {
				alpha = 1;
			} else {
				if (nowPoint >= minX && nowPoint < maxX) {
					let cha = nowPoint - minX;
					alpha = this.getChaAlphaByRight(cha);
				}
			}
		} else {
			let maxX = this.x + this.width / 2 - this.width / 4;
			let minX = this.x - this.width / 2 - this.width / 4;
			let nowPoint = width + offersetX;
			if (this.buttonData.gameId == "slot" || this.buttonData.gameId == "dzmj") {
				let pOffersetX = maxX + offersetX;
				if (nowPoint >= maxX) {
					alpha = 1;
				} else {
					if (nowPoint >= minX && nowPoint < maxX) {
						let cha = maxX - nowPoint;
						alpha = this.getChaAlphaByRight(cha);
					}
				}
			}
		}
		if (alpha && alpha > -1) {
			egret.Tween.get(this).to({
				alpha: alpha
			}, 50)
		}
	}

	public getChaAlphaByRight(cha) {
		if (cha > 0 && cha < this.width / 95) {
			return 1;
		} else
			if (cha >= this.width / 95 && cha < this.width / 80) {
				return 0.6;
			}
			else if (cha >= this.width / 80 && cha < this.width / 70) {
				return 0.5;
			} else if (cha >= this.width / 70 && cha < this.width / 50) {
				return 0.4;
			} else if (cha >= this.width / 50 && cha < this.width / 30) {
				return 0.3;
			} else if (cha >= this.width / 30 && cha < this.width) {
				return 0.2;
			}
	}


	private createDb() {
		let mc: DBComponent = GameCacheManager.instance.getCache(`mian_button${this.buttonData.gameId}`);
		if (!mc) {
			mc = new DBComponent(`${this.buttonData.gameId}`);
			// GameCacheManager.instance.setCache(`mian_button${this.buttonData.gameId}`, mc);
		}
		if (mc) {
			this.dbGroup.addChild(mc);
			mc.playDefault(-1);
		}
	}

	public showHot() {
		this.hotImage.visible = true;
		this.hotImageGroup.visible = true;
		let hot: DBComponent = new DBComponent("fire");
		this.hotImageGroup.addChild(hot);
		hot.verticalCenter = 0;
		hot.horizontalCenter = 0;
		hot.play("fire", -1);
	}

	public showNew() {
		this.newImage.visible = true;
	}

}


//游戏级别
const GRADE = {
	RECOMMEND: 1, //推荐
	HOT: 2, //火爆
	NEW: 3, //新游戏
	COMMON: 4, //一般
	DEV: 5, //敬请期待
	HIDE: 6, //隐藏
	MAINTENANCE: 7//维护
};