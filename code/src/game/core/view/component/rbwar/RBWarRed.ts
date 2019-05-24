module rbwar {
	export class RBWarRed extends eui.Component {
		public peillabel: eui.Label;
		public mineLabel: eui.Label;
		public totalLabel: eui.Label;
		public index: number;
		public root: RBWarGameScene;

		public mineScore: number = 0;
		public totalScore: number = 0;
		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
			this.touchChildren = false;
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
		}

		public init(root: RBWarGameScene, index: number) {
			this.root = root;
			this.index = index;
			this.peillabel.text = "";
			this.mineLabel.text = "0";
			this.totalLabel.text = "0";
		}

		public onTouchTap() {
			if (this.index == 1) {
				this.root.yzRed();
			} else if (this.index == 2) {
				this.root.yzBlack();
			}
		}

		/**
		 * 更新的我的押注
		 */
		public updateMyValue(value, isAdd) {
			if (isAdd) {
				this.mineScore += value;
			} else {
				this.mineScore = value;
			}
			this.mineLabel.text = this.mineScore + "";
		}

		/**
		 * 更新总押注
		 */
		public updateTotalValue(value, isAdd) {
			if (isAdd) {
				this.totalScore += value;
			} else {
				this.totalScore = value;
			}
			this.totalLabel.text = this.totalScore + "";
		}

		private blinkImage: eui.Image;
		public winAni() {
			this.blinkImage.visible = true;
			this.blinkImage.alpha = 1;
			egret.Tween.get(this.blinkImage, { loop: true }).to({
				alpha: 0
			}, 400).to({
				alpha: 1
			}, 400);
			egret.setTimeout(() => {
				egret.Tween.removeTweens(this.blinkImage);
				this.blinkImage.visible = false;
			}, this, 2000);
		}
	}
}