module niuniu {
	export class NiuniuHeader extends eui.Component {
		private goldLabel: eui.BitmapLabel;
		private nameLabel: eui.Label;
		private headerImage: eui.Image;
		private playerInfo;
		private beishuLabel: eui.BitmapLabel;
		private beishuGroup: eui.Group;
		public zhuangImage: eui.Image;
		public indexLabel: eui.Label;
		private bqImage: eui.Image;
		private liushuiLabel: eui.Label;
		private gold: number;
		public headerImage_k: eui.Image;
		public index;
		public constructor() {
			super();
			this.skinName = new NiuNiuHeaderSkin();
		}

		public createChildren() {
			super.createChildren();
		}

		public setIndex(index) {
			this.index = index;
			this.indexLabel.text = index + "";
		}

		public showBeishu(value) {
			this.bqImage.visible = value <= 0;
			this.beishuLabel.visible = value > 0;
			if (value > 0) {
				this.beishuLabel.text = "x" + value;
			}
			this.beishuGroup.visible = true;
		}

		public hideBeishu() {
			this.beishuGroup.visible = false;
		}

		public initWithPlayer(playerInfo) {
			if (!playerInfo) {
				this.nameLabel.text = Global.playerProxy.playerData.nickname;
				this.headerImage.source = `nns_${Global.playerProxy.playerData.sex}_${Global.playerProxy.playerData.figure_url}_png`;
				this.goldLabel.text = NumberFormat.formatGold_scence(Global.playerProxy.playerData.gold);
			} else {
				this.playerInfo = playerInfo;
				this.goldLabel.text = NumberFormat.formatGold_scence(playerInfo.gold);
				this.nameLabel.text = playerInfo.nickname;
				let headerId = playerInfo['figureUrl'] || playerInfo.figure_url;
				let headerSex = playerInfo['sex'] || playerInfo.sex;
				this.headerImage.source = `nns_${headerSex}_${headerId}_png`;
			}
			this.gold = Global.playerProxy.playerData.gold;
		}

		public showIsZhuang(isZhuang) {
			this.zhuangImage.visible = isZhuang;
			this.zhuangImage.scaleX = this.zhuangImage.scaleY = 0;
			egret.Tween.get(this.zhuangImage).to({ scaleX: 0, scaleY: 0 }, 50).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 200);
		}

		public change2Left() {
			this.beishuGroup.x = 0 - this.beishuGroup.width;
		}


		public showLiushuiLabel(gainGold: number) {
			let str;
			if (gainGold >= 0) {
				str = "+" + gainGold;
			} else {
				str = gainGold + "";
			}
			this.liushuiLabel.text = str;
			let player = Global.roomProxy.getPlayerInfoByIndex(this.index);
			this.goldLabel.text = NumberFormat.formatGold_scence(player.gold);
			// egret.setTimeout(()=>{
			// 	this.updatePlayerGold();
			// }, this, 500);
		}

		public updatePlayerGold() {
			let player = Global.roomProxy.getPlayerInfoByIndex(this.index);
			egret.Tween.get(this, { onChange: this.onChange, onChangeObj: this }).to({ gold: player.gold }, 500, egret.Ease.quadInOut);
		}

		private onChange(): void {
			this.goldLabel.text = NumberFormat.formatGold_scence(this.gold);
		}
	}
}