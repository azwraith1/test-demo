module rbwar {
	export class RBWarHeader extends BaseHeader {
		public headerGroup: eui.Group;
		public constructor() {
			super();
		}

		public showWin(num) {
			if (num == 1) {
				this.playerGold.visible = false;
				this.playerGold.x = -43;
				this.playerGold.y = -46;
			}

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

	}
}