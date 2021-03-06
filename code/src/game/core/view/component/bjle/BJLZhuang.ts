module bjle {
	export class BJLZhuang extends eui.Component {
		public zhuangScore: eui.Label;
		public mineScore: eui.Label;
		public light: eui.Image;
		public index: number;
		public root: BJLGameScene;
		public mineScoreGroup: eui.Group;
		public mineScore1: number = 0;
		public totalScore: number = 0;
		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
			//this.touchChildren = false;
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
		}

		public init(root: BJLGameScene, index: number) {
			this.root = root;
			this.index = index;
			this.mineScore.text = "0";
			this.zhuangScore.text = "0";
		}

		public bili: eui.BitmapLabel;
		public init_bili(index) {
			this.bili.font = "bjl_zhuang_fnt";
			this.bili.text = index;
		}

		public onTouchTap() {
			this.root.yzZhuang();
		}

		/**
		 * 更新的我的押注
		 */
		public updateMyValue(value, isAdd, isRecont?) {
			if (isAdd) {
				this.mineScore1 += value;
			} else {
				this.mineScore1 = value;
			}
			this.mineScoreGroup.visible = isAdd;
			if (isRecont) {
				this.mineScoreGroup.visible = (value == 0) ? false : true;
			}
			this.mineScore.text = this.mineScore1 + "";
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
			this.zhuangScore.text = this.totalScore + "";
		}


		public winAni() {
			this.light.visible = true;
			this.light.alpha = 1;
			egret.Tween.get(this.light, { loop: true }).to({
				alpha: 0
			}, 400).to({
				alpha: 1
			}, 400);
			egret.setTimeout(() => {
				egret.Tween.removeTweens(this.light);
				this.light.visible = false;
			}, this, 2000);
		}
	}
}