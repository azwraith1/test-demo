class BaseHeader extends game.BaseUI {
	protected goldLabel: eui.BitmapLabel;
	protected nameLabel: eui.Label;
	public headerImage: eui.Image;
	public playerInfo;
	public index;
	protected zhuangImage: eui.Image;
	protected maskImage: eui.Image;
	protected headerGroup: eui.Group;
	public indexLabel: eui.Label;
	protected playerGold: eui.BitmapLabel;
	public constructor() {
		super();
	}

	public createChildren() {
		super.createChildren();
		if (this.maskImage) {
			this.headerImage.mask = this.maskImage;
		}
	}

	public onAdded() {
		super.onAdded();
	}

	public onRemoved() {
		super.onRemoved();
	}

	public setIndex(index) {
		this.index = index;
	}

	public initWithPlayer(playerInfo) {
		if (!playerInfo) {
			this.nameLabel.text = Global.playerProxy.playerData.nickname;
			this.headerImage.source = `hall_header_${Global.playerProxy.playerData.sex}_${Global.playerProxy.playerData.figure_url}_png`;
			this.goldLabel.text = NumberFormat.formatGold_scence(Global.playerProxy.playerData.gold);
		} else {
			this.playerInfo = playerInfo;
			this.goldLabel.text = NumberFormat.formatGold_scence(playerInfo.gold);
			this.nameLabel.text = playerInfo.nickname || playerInfo.name;
			let headerId = playerInfo['figureUrl'] || playerInfo['url'];
			let headerSex = playerInfo['sex'] || playerInfo.sex;
			this.headerImage.source = `hall_header_${headerSex}_${headerId}_png`;
		}
		this.indexLabel.text = playerInfo.playerIndex || playerInfo.pIndex;
		this.index = playerInfo.playerIndex || playerInfo.pIndex;
	}
	/**
	 * 更新金币
	 */
	public updateGold(gold: number, isAdd: boolean = false) {
		if (!this.playerInfo) {
			this.goldLabel.text = NumberFormat.formatGold_scence(gold);
			return;
		}
		if (isAdd) {
			this.playerInfo.gold += NumberFormat.handleFloatDecimal(gold, 4);
		} else {
			this.playerInfo.gold = NumberFormat.handleFloatDecimal(gold, 4);
		}
		if (this.playerInfo) {
			if (Global.playerProxy.checkIsMe(this.playerInfo.uid)) {
				Global.playerProxy.playerData.gold = this.playerInfo.gold;
			}
		}
		this.goldLabel.text = NumberFormat.formatGold_scence(this.playerInfo.gold)
	}

	public showIsZhuang(isZhuang) {
		this.zhuangImage.visible = isZhuang;
		this.zhuangImage.scaleX = this.zhuangImage.scaleY = 0;
		egret.Tween.get(this.zhuangImage).to({ scaleX: 0, scaleY: 0 }, 50).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 200);
	}
	/**
	 * 玩家头像移动。
	 */
	public headerMovie(dirction) {
		egret.Tween.removeTweens(this.headerGroup);
		switch (dirction) {
			case 1:
				egret.Tween.get(this.headerGroup).to({
					y: -10
				}, 100).to({
					y: 0
				}, 100);
				break;
			case 2:
			case 3:
				egret.Tween.get(this.headerGroup).to({
					x: 10
				}, 100).to({
					x: 0
				}, 100);
				break;
			case 4:
			case 5:
				egret.Tween.get(this.headerGroup).to({
					x: -10
				}, 100).to({
					x: 0
				}, 100);
				break;
			case 6://第一名
				egret.Tween.get(this.headerGroup).to({
					x: 10
				}, 100).to({
					x: 0
				}, 100);
				break;
			case 7://luckey用户
				egret.Tween.get(this.headerGroup).to({
					x: -10
				}, 100).to({
					x: 0
				}, 100);
				break;
		}
	}
}