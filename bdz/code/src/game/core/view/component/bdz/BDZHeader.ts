class BDZHeader extends game.BaseUI {
	private headerImage: eui.Image;
	private nameLabel: eui.Label;
	private goldLabel: eui.Label;
	private bossImage: eui.Image;
	private headerRect: eui.Rect;
	private playerInfo;
	private gold: number;
	private headerMask: eui.Image;
	private lsLabel: eui.BitmapLabel;
	public constructor() {
		super();
	}

	public createChildren() {
		super.createChildren();
		this.headerImage.mask = this.headerMask;
	}

	public initWithData(playerInfo) {
		if (!playerInfo) {
			this.nameLabel.text = Global.playerProxy.playerData.nickname;
			this.headerImage.source = `hall_header_${Global.playerProxy.playerData.sex}_${Global.playerProxy.playerData.figure_url}_png`;
			this.goldLabel.text = NumberFormat.fNumberStr(Global.playerProxy.playerData.gold);
		} else {
			this.playerInfo = playerInfo;
			this.goldLabel.text = NumberFormat.fNumberStr(playerInfo.gold);
			this.nameLabel.text = playerInfo.nickname;
			let headerId = playerInfo['figureUrl'] || playerInfo.figure_url;
			let headerSex = playerInfo['sex'] || playerInfo.sex;
			this.headerImage.source = `hall_header_${headerSex}_${headerId}_png`;
		}
		this.gold = Global.playerProxy.playerData.gold;
	}

	public showBoss(isDealer) {
		this.bossImage.visible = isDealer;
	}


	public updateGold(gold, isAdd) {
		if (isAdd) {
			this.playerInfo.gold += NumberFormat.fNumberStr(gold);
		} else {
			this.playerInfo.gold = NumberFormat.fNumberStr(gold);
		}
		if (this.playerInfo) {
			if (Global.roomProxy.checkIndexIsMe(this.playerInfo.uid)) {
				Global.playerProxy.playerData.gold = this.playerInfo.gold;
			}
		}
		this.goldLabel.text = NumberFormat.fNumberStr(this.playerInfo.gold)
	}

	private winGold: number = 0;
	public showLsLabel(gold) {
		egret.Tween.get(this, { onChange: this.onWinChange, onChangeObj: this }).to({ winGold: gold }, 500, egret.Ease.circIn);
		// egret.Tween.get(this.lsLabel).to({
		// 	scaleX: 1
		// }, 300, egret.Ease.bounceInOut);
		// this.lsLabel.text = "+" + NumberFormat.fNumberBDZStr(gold);
	}

	private onWinChange(): void {
		this.lsLabel.text = "+" + NumberFormat.fNumberBDZStr(this.winGold);
	}

}