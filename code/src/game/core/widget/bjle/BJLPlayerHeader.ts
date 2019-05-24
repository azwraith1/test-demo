module bjle {
	export class BJLPlayerHeader extends BaseHeader {
		private no1orSsz: eui.Image;
		private fuhao: eui.Image;
		private king: eui.Image;
		private no2image: eui.Image;
		private no1image: eui.Image;
		private dbGroup: eui.Group;
		public constructor() {
			super();
			this.skinName = new BJLPlayerHeaderSkin();
		}

		public showWin(num) {
			if (num == 1) {
				this.playerGold.visible = false;
				this.playerGold.x = -43;
				this.playerGold.y = -46;
			}

		}

		public addDb(obj) {
			//this.dbGroup.height
			this.dbGroup.addChild(obj);
		}


		private timer: any;
		private gainGold: any;
		public showLiushuiLabel(gainGold) {
			this.playerGold.text = 0 + "";
			this.count = 0;
			this.sumFen = 0;
			this.playerGold.visible = true;
			this.gainGold = gainGold;
			this.playerGold.visible = true;
			this.playerGold.alpha = 0;
			this.playerGold.y = this.playerGold.y + 20;
			egret.Tween.get(this.playerGold).to({ alpha: 0, y: this.playerGold.y }, 50).to({ alpha: 1, y: this.playerGold.y - 20 }, 50).call(() => {
				this.timer = egret.setInterval(() => {
					this.scoreAddOrNo();
				}, this, 30);
			});
		}

		/**
		 * 分数加减动画
		 */
		private count: number = 0;
		private sumFen: number = 0;
		private scoreAddOrNo() {
			this.count++;
			let finalNum = this.gainGold;
			let step = Math.abs(finalNum) / 30;
			this.sumFen = this.sumFen + Math.ceil(step);
			if (this.count > 20) {
				egret.clearInterval(this.timer);
				this.playerGold.text = "+" + finalNum;
			} else {
				this.playerGold.text = "+" + this.sumFen;

			}
		}

		public initWithPlayer(playerInfo, bjl?) {
			if (!playerInfo) {
				this.nameLabel.text = Global.playerProxy.playerData.nickname;
				this.headerImage.source = `hall_header_${Global.playerProxy.playerData.sex}_${Global.playerProxy.playerData.figure_url}_png`;
				this.goldLabel.text = NumberFormat.formatGold_scence(Global.playerProxy.playerData.gold);
			} else {
				this.playerInfo = playerInfo;
				if (bjl == 1) {
					this.no2image.visible = false;
					this.no1image.visible = true;
					this.no1image.source = RES.getRes("bjle_header_no1_png")
					this.no1orSsz.source = RES.getRes("bjle_header_fh1_png")
					this.fuhao.source = RES.getRes("bjle_header_fh_red_png")
					this.king.visible = true;
				} else if (bjl == 10) {
					this.no2image.visible = false;
					this.no1image.visible = false;
					this.king.visible = false;
					this.fuhao.visible = false;
					this.no1orSsz.source = RES.getRes("bjle_header_ssz_png")
				} else {
					this.no2image.visible = true;
					this.no2image.source = RES.getRes(`bjle_header_no${bjl}_png`)
					this.no1orSsz.source = RES.getRes("bjle_header_fh1_png")
					this.fuhao.source = RES.getRes("bjle_header_fh_yellow_png")
					this.no1image.visible = false;
					this.king.visible = false;

				}
				this.nameLabel.text = playerInfo.nickname || playerInfo.name;
				let headerId = playerInfo['figureUrl'] || playerInfo['url'];
				let headerSex = playerInfo['sex'] || playerInfo.sex;
				this.headerImage.source = `hall_header_${headerSex}_${headerId}_png`;
			}
			this.indexLabel.text = playerInfo.playerIndex || playerInfo.pIndex;
			this.index = playerInfo.playerIndex || playerInfo.pIndex;
		}


	}
}