module bjle {
	export class BJLMineHeader extends BaseHeader {
		public headerGroup: eui.Group;
		private liushuiLabel: eui.BitmapLabel;
		private dbGroup: eui.Group;
		public constructor() {
			super();
			this.skinName = new BJLMineHeaderSkin();
		}

		/**
		 * 自己流水显示与隐藏
		 */
		public lsfalse() {
			this.liushuiLabel.visible = false;

		}

		public addDb(obj) {
			this.dbGroup.removeChildren();
			this.dbGroup.addChild(obj);
		}

		private timer: any;
		private gainGold: any;
		public showLiushuiLabel(gainGold) {
			this.liushuiLabel.text = 0 + "";
			this.count = 0;
			this.sumFen = 0;
			this.liushuiLabel.visible = true;
			this.gainGold = gainGold;
			this.liushuiLabel.visible = true;
			this.liushuiLabel.alpha = 0;
			this.liushuiLabel.y = this.liushuiLabel.y + 20;
			egret.Tween.get(this.liushuiLabel).to({ alpha: 0, y: this.liushuiLabel.y }, 50).to({ alpha: 1, y: this.liushuiLabel.y - 20 }, 50).call(() => {
				// let demo = new CountUp('myTargetElement', 5449);
				// 		if (!demo.error) {
				// 			  demo.start();
				// 		} else {
				// 			  console.error(demo.error);
				// 		}
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
				this.liushuiLabel.text = "+" + finalNum;
			} else {
				this.liushuiLabel.text = "+" + this.sumFen;

			}
		}

		/**
		 * 押注头像移动
		 */
		public headerMovie(dirction) {
			egret.Tween.removeTweens(this.headerGroup);
			egret.Tween.get(this.headerGroup).to({
				y: -4
			}, 100).to({
				y: 6
			}, 100);
		}
	}
}
