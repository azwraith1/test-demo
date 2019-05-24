class BaseHeader extends eui.Component {
	protected goldLabel: eui.BitmapLabel;
	protected nameLabel: eui.Label;
	protected headerImage: eui.Image;
	protected playerInfo;
	protected gold: number;
	protected index;
	protected zhuangImage: eui.Image;
	protected maskImage: eui.Image;
	public constructor() {
		super();
	}

	public createChildren() {
		super.createChildren();
		if (this.maskImage) {
			this.headerImage.mask = this.maskImage;
		}
	}

	public setIndex(index) {
		this.index = index;
	}

	public initWithPlayer(playerInfo) {
		if (!playerInfo) {
			this.nameLabel.text = Global.playerProxy.playerData.nickname;
			this.headerImage.source = `nns_${Global.playerProxy.playerData.sex}_${Global.playerProxy.playerData.figure_url}_png`;
			this.goldLabel.text = Global.playerProxy.playerData.gold + "";
		} else {
			this.playerInfo = playerInfo;
			this.goldLabel.text = playerInfo.gold + "";
			this.nameLabel.text = playerInfo.nickname;
			let headerId = playerInfo['figureUrl'] || playerInfo.figure_url;
			let headerSex = playerInfo['sex'] || playerInfo.sex;
			this.headerImage.source = `nns_${headerSex}_${headerId}_png`;
		}
		this.gold = Global.playerProxy.playerData.gold;
	}

	private onChange(): void {
		this.goldLabel.text = NumberFormat.fNumber(this.gold) + "";
	}

	public updatePlayerGold() {
		// let player = Global.niuniuProxy.getPlayerInfoByIndex(this.index);
		// egret.Tween.get(this, { onChange: this.onChange, onChangeObj: this }).to({ gold: player.gold }, 500, egret.Ease.quadInOut);
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
		egret.Tween.removeTweens(this.headerImage);
		switch (dirction) {
			case 1:
				egret.Tween.get(this.headerImage).to({
					y: 22.31
				}, 100).to({
					y: 32.31
				}, 100);
				break;
			case 2:
			case 3:
				egret.Tween.get(this.headerImage).to({
					x: 18.01
				}, 100).to({
					x: 8.01
				}, 100);
				break;
			case 4:
			case 5:
				egret.Tween.get(this.headerImage).to({
					x: -2
				}, 100).to({
					x: 8.01
				}, 100);
				break;
			case 6://第一名
				egret.Tween.get(this.headerImage).to({
					x: 21
				}, 100).to({
					x: 11
				}, 100);
				break;
			case 7://luckey用户
				egret.Tween.get(this.headerImage).to({
					x: 165
				}, 100).to({
					x: 175
				}, 100);
				break;

		}

	}
}