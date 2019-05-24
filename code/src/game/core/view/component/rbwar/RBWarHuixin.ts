module rbwar {
	export class RBWarHuixin extends eui.Component {
		public beishuInfoLabel: eui.Label;
		public totalLabel: eui.Label;
		public mineLabel: eui.Label;
		public index: number;
		public root: RBWarGameScene;
		public touchGroup: eui.Group;

		public mineScore: number = 0;
		public totalScore: number = 0;
		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
			this.touchGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
		}

		public init(root: RBWarGameScene, index: number) {
			this.root = root;
			this.index = index;
			// this.peillabel.text = "";
			this.mineLabel.text = "0";
			this.totalLabel.text = "0";
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			let betMulti = roomInfo.betMulti;
			let xingyunBet = betMulti[3]
			let str = `${xingyunBet[5]}倍 | ${xingyunBet[4]}倍 | ${xingyunBet[3]}倍  | ${xingyunBet[2]}倍  | ${xingyunBet[1]}倍`;
			this.beishuInfoLabel.text = str;
		}

		private showBetMuilt() {
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;


		}

		public onTouchTap() {
			this.root.yzHuixin();
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
			}, 200).to({
				alpha: 1
			}, 200);
			egret.setTimeout(() => {
				egret.Tween.removeTweens(this.blinkImage);
				this.blinkImage.visible = false;
			}, this, 2000);
		}
	}
}